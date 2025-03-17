import * as vscode from 'vscode';
import { ctrlvApi } from '../api/ctrlv-client';
import { mapVSCodeLanguageToCtrlV } from '../api/language-mapper';
import { showShareSuccessNotification } from '../utils/notifications';
import { trackEvent } from '../utils/telemetry';

/**
 * Command to share the entire file content
 */
export async function shareEntireFile(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
    }

    // Get the entire document text
    const text = editor.document.getText();
    
    if (!text.trim()) {
        vscode.window.showWarningMessage('File is empty, nothing to share');
        return;
    }
    
    // Check if file is too large (>100KB)
    if (text.length > 100000) {
        const proceed = await vscode.window.showWarningMessage(
            'This file is quite large. Are you sure you want to share it?',
            'Share Anyway',
            'Cancel'
        );
        
        if (proceed !== 'Share Anyway') {
            return;
        }
    }
    
    // Get language from document
    const vscodeLang = editor.document.languageId;
    const language = mapVSCodeLanguageToCtrlV(vscodeLang);
    
    // Get user configuration
    const config = vscode.workspace.getConfiguration('ctrlv');
    const defaultExpiration = config.get<string>('defaultExpiration') || '24h';
    const oneTimeViewDefault = config.get<boolean>('oneTimeViewDefault') || false;
    const copyToClipboard = config.get<boolean>('copyToClipboard') || true;
    
    try {
        // Show progress notification
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Sharing file via CtrlV",
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 30, message: "Preparing file..." });
            
            // Call API to create snippet
            const result = await ctrlvApi.createSnippet({
                content: text,
                language,
                expiration: defaultExpiration,
                one_time_view: oneTimeViewDefault
            });
            
            progress.report({ increment: 70, message: "Creating share link..." });
            
            // Get sharing URL
            const shareUrl = result.sharing_url!;
            
            // Copy to clipboard if configured
            if (copyToClipboard) {
                await vscode.env.clipboard.writeText(shareUrl);
            }
            
            // Track usage (anonymous)
            trackEvent('shareEntireFile', { 
                language, 
                codeLength: text.length,
                fileName: editor.document.fileName.split('/').pop() || 'unknown',
                oneTimeView: oneTimeViewDefault 
            });
            
            // Show success notification with options
            showShareSuccessNotification(shareUrl);
            
            return result;
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to share file: ${(error as Error).message}`);
        
        // Track error (anonymous)
        trackEvent('shareError', { 
            error: (error as Error).message,
            language, 
            codeLength: text.length
        });
    }
}
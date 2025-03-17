import * as vscode from 'vscode';
import { ctrlvApi } from '../api/ctrlv-client';
import { mapVSCodeLanguageToCtrlV } from '../api/language-mapper';
import { showShareSuccessNotification } from '../utils/notifications';
import { trackEvent } from '../utils/telemetry';

/**
 * Command to share the currently selected code
 */
export async function shareSelectedCode(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
    }

    // Get the selected text
    const selection = editor.selection;
    const text = editor.document.getText(selection);
    
    if (!text.trim()) {
        vscode.window.showErrorMessage('Please select some code to share');
        return;
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
            title: "Sharing code via CtrlV",
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 30, message: "Connecting to CtrlV..." });
            
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
            trackEvent('shareSelectedCode', { 
                language, 
                codeLength: text.length,
                oneTimeView: oneTimeViewDefault 
            });
            
            // Show success notification with options
            showShareSuccessNotification(shareUrl);
            
            return result;
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to share code: ${(error as Error).message}`);
        
        // Track error (anonymous)
        trackEvent('shareError', { 
            error: (error as Error).message,
            language, 
            codeLength: text.length
        });
    }
}
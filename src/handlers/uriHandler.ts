// handlers/uriHandler.ts - New file to handle incoming URIs
import * as vscode from 'vscode';
import { trackEvent } from '../utils/telemetry';

/**
 * Handles URIs passed from the web to VS Code via vscode:// protocol
 * Format: vscode://ChukwukaIbejih.ctrlv-code-sharing/open?extension=js&content=...
 */
export async function handleUri(uri: vscode.Uri): Promise<void> {
    try {
        // Parse the URI
        const queryParams = new URLSearchParams(uri.query);
        
        // Get content from the query parameters
        const content = queryParams.get('content');
        if (!content) {
            vscode.window.showErrorMessage('No content provided in the URI');
            return;
        }
        
        // Get file extension from path or query parameters
        let extension = queryParams.get('extension');
        if (!extension && uri.path) {
            // Try to extract from the path (format: /:extension)
            const match = uri.path.match(/\/:(\w+)/);
            if (match && match[1]) {
                extension = match[1];
            }
        }
        
        // Default to .txt if no extension is found
        const fileExtension = extension || 'txt';
        
        // Get language ID from extension
        const languageId = getLanguageFromExtension(fileExtension);
        
        // Create a new untitled document with the content
        const document = await vscode.workspace.openTextDocument({
            language: languageId,
            content: decodeURIComponent(content)
        });
        
        // Show the document in an editor
        await vscode.window.showTextDocument(document);
        
        // Track usage
        trackEvent('openFromBrowser', { 
            extension: fileExtension,
            contentLength: content.length
        });
        
        vscode.window.showInformationMessage('Code opened from CtrlV successfully!');
    } catch (error) {
        vscode.window.showErrorMessage(`Error handling URI: ${error instanceof Error ? error.message : String(error)}`);
        
        // Track error
        trackEvent('openFromBrowserError', { 
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

/**
 * Maps file extensions to VS Code language IDs
 */
function getLanguageFromExtension(extension: string): string {
    // Remove leading dot if present
    const ext = extension.startsWith('.') ? extension.substring(1) : extension;
    
    // Map of common extensions to VS Code language IDs
    const extensionToLanguage: Record<string, string> = {
        'js': 'javascript',
        'ts': 'typescript',
        'py': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'php': 'php',
        'rs': 'rust',
        'sql': 'sql',
        'html': 'html',
        'css': 'css',
        'md': 'markdown',
        'json': 'json',
        'cs': 'csharp',
        'go': 'go',
        'rb': 'ruby',
        'sh': 'shellscript',
        'yaml': 'yaml',
        'yml': 'yaml',
        'xml': 'xml',
        'txt': 'plaintext'
    };
    
    return extensionToLanguage[ext] || 'plaintext';
}


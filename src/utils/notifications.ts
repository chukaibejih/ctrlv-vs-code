import * as vscode from 'vscode';

/**
 * Shows a success notification with the share URL and actions
 */
export async function showShareSuccessNotification(shareUrl: string): Promise<void> {
    const copyButtonLabel = 'Copy URL';
    const openButtonLabel = 'Open in Browser';
    const dismissButtonLabel = 'Dismiss';
    
    // Create notification with multiple action buttons
    const selection = await vscode.window.showInformationMessage(
        `CtrlV link created successfully!`,
        { modal: false, detail: shareUrl },
        copyButtonLabel,
        openButtonLabel,
        dismissButtonLabel
    );
    
    // Handle button click
    if (selection === copyButtonLabel) {
        await vscode.env.clipboard.writeText(shareUrl);
        vscode.window.showInformationMessage('Share URL copied to clipboard!');
    } else if (selection === openButtonLabel) {
        vscode.env.openExternal(vscode.Uri.parse(shareUrl));
    }
}

/**
 * Shows an error notification with details
 */
export function showErrorNotification(message: string, details?: string): void {
    if (details) {
        vscode.window.showErrorMessage(message, { modal: false, detail: details });
    } else {
        vscode.window.showErrorMessage(message);
    }
}
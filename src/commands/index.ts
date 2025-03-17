import * as vscode from 'vscode';
import { shareSelectedCode } from './shareSelection';
import { shareEntireFile } from './shareFile';

/**
 * Register all extension commands
 */
export function registerCommands(context: vscode.ExtensionContext): void {
    // Register shareSelection command
    const shareSelectionCommand = vscode.commands.registerCommand(
        'ctrlv.shareSelection',
        shareSelectedCode
    );
    
    // Register shareFile command
    const shareFileCommand = vscode.commands.registerCommand(
        'ctrlv.shareFile',
        shareEntireFile
    );
    
    // Add to subscriptions
    context.subscriptions.push(shareSelectionCommand);
    context.subscriptions.push(shareFileCommand);
}
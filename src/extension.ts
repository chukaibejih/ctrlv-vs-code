import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { registerTelemetry } from './utils/telemetry';

/**
 * This method is called when the extension is activated.
 * Extension is activated the first time a command is executed.
 */
export function activate(context: vscode.ExtensionContext) {
    // Register commands
    registerCommands(context);
    
    // Set up telemetry (anonymized usage stats)
    registerTelemetry(context);
    
    // Show welcome message for new installations
    const previousVersion = context.globalState.get<string>('ctrlv.version');
    const currentVersion = vscode.extensions.getExtension('Chukwuka Ibejih.ctrlv-code-sharing')?.packageJSON.version;
    
    if (!previousVersion) {
        // First installation
        vscode.window.showInformationMessage(
            'CtrlV Code Sharing is now installed! Share code directly from VS Code.',
            'Learn More'
        ).then(selection => {
            if (selection === 'Learn More') {
                vscode.env.openExternal(vscode.Uri.parse('https://www.ctrlv.codes'));
            }
        });
    } else if (previousVersion !== currentVersion) {
        // Version update
        vscode.window.showInformationMessage(
            `CtrlV Code Sharing has been updated to version ${currentVersion}!`,
            'See Changes'
        ).then(selection => {
            if (selection === 'See Changes') {
                vscode.env.openExternal(vscode.Uri.parse('https://github.com/yourusername/ctrlv-vscode/blob/main/CHANGELOG.md'));
            }
        });
    }
    
    // Store current version
    context.globalState.update('ctrlv.version', currentVersion);
    
    console.log('CtrlV Code Sharing extension is now active');
}

/**
 * This method is called when the extension is deactivated
 */
export function deactivate() {
    console.log('CtrlV Code Sharing extension has been deactivated');
}
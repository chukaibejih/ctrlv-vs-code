import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { registerTelemetry } from './utils/telemetry';
import { handleUri } from './handlers/uriHandler'; // New import

/**
 * This method is called when the extension is activated.
 * Extension is activated the first time a command is executed.
 */
export function activate(context: vscode.ExtensionContext) {
    // Register commands
    registerCommands(context);
    
    // Set up telemetry (anonymized usage stats)
    registerTelemetry(context);
    
    // Register URI handler for "Open in VS Code" functionality
    context.subscriptions.push(
        vscode.window.registerUriHandler({
            handleUri
        })
    );
    
    // Show welcome message for new installations
    const previousVersion = context.globalState.get<string>('ctrlv.version');
    const currentVersion = vscode.extensions.getExtension('ChukwukaIbejih.ctrlv-code-sharing')?.packageJSON.version;
    
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
            `CtrlV Code Sharing has been updated to version ${currentVersion}!`
        );
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
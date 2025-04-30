import * as vscode from 'vscode';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

// Types for telemetry
interface TelemetryEventProps {
    [key: string]: any;
}

// Anonymous telemetry for understanding extension usage
// Only tracks actions (not content or personal info)
let telemetryEnabled = true;
let machineId = '';

/**
 * Initialize telemetry with user preferences
 */
export function registerTelemetry(context: vscode.ExtensionContext): void {
    // Check if telemetry is enabled in VS Code
    telemetryEnabled = vscode.env.isTelemetryEnabled;
    
    // Listen for telemetry changes
    context.subscriptions.push(
        vscode.env.onDidChangeTelemetryEnabled((enabled) => {
            telemetryEnabled = enabled;
        })
    );
    
    // Get or create machine ID for anonymous stats
    machineId = context.globalState.get<string>('ctrlv.machineId') || '';
    if (!machineId) {
        machineId = uuidv4();
        context.globalState.update('ctrlv.machineId', machineId);
    }
}

/**
 * Track an event for telemetry purposes
 * This is completely anonymous and only used to improve the extension
 */
export function trackEvent(eventName: string, properties?: TelemetryEventProps): void {
    if (!telemetryEnabled) {
        return;
    }
    
    try {
        // Create the event data
        const eventData = { 
            event_type: 'vscode_extension',
            event_name: eventName,
            client_id: machineId,
            timestamp: new Date().toISOString(),
            vs_code_version: vscode.version,
            ...properties
        };
        
        // Send to your existing metrics API
        axios.post('https://backend.ctrlv.codes/api/v1/snippets/metrics/vscode/', eventData)
            .catch(error => {
                // Silent fail for telemetry errors
                console.error('Telemetry error:', error);
            });
    } catch (error) {
        // Silently fail telemetry errors
        console.error('Telemetry error:', error);
    }
}
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as vscode from 'vscode';

/**
 * Types for API requests and responses
 */
export interface CreateSnippetRequest {
    content: string;
    language: string;
    expiration?: string;
    one_time_view?: boolean;
}

export interface CreateSnippetResponse {
    id: string;
    access_token: string;
    sharing_url?: string;
}

export interface SnippetInfo {
    id: string;
    content: string;
    language: string;
    created_at: string;
    expires_at: string;
    view_count: number;
    one_time_view: boolean;
}

/**
 * CtrlV API Client
 */
export class CtrlVApiClient {
    private client: AxiosInstance;
    private baseUrl: string;
    
    constructor() {
        this.baseUrl = vscode.workspace.getConfiguration('ctrlv').get<string>('apiUrl') || 'https://backend.ctrlv.codes';
        
        // Create axios instance
        this.client = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'CtrlV-VSCode-Extension/1.0.0',
            },
            timeout: 10000 // 10 seconds timeout
        });
    }
    
    /**
     * Creates a new snippet on CtrlV
     */
    async createSnippet(request: CreateSnippetRequest): Promise<CreateSnippetResponse> {
        try {
            const response: AxiosResponse<CreateSnippetResponse> = await this.client.post(
                '/api/v1/snippets/',
                request
            );
            
            // Always use the frontend URL regardless of what the API returns
            const id = response.data.id;
            const token = response.data.access_token;
            response.data.sharing_url = `https://www.ctrlv.codes/s/${id}?token=${token}`;
            
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // Server responded with an error status
                    throw new Error(`API Error (${error.response.status}): ${
                        error.response.data?.error || error.message
                    }`);
                } else if (error.request) {
                    // Request was made but no response received
                    throw new Error(`Network Error: No response received. Please check your internet connection.`);
                }
            }
            
            // Generic error handling
            throw new Error(`Failed to create snippet: ${(error as Error).message}`);
        }
    }
    
    /**
     * Get a snippet by ID and token
     */
    async getSnippet(id: string, token: string): Promise<SnippetInfo> {
        try {
            const response: AxiosResponse<SnippetInfo> = await this.client.get(
                `/api/v1/snippets/${id}/?token=${token}`
            );
            
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                throw new Error('Snippet not found or has expired.');
            }
            throw new Error(`Failed to retrieve snippet: ${(error as Error).message}`);
        }
    }
}

// Export singleton instance
export const ctrlvApi = new CtrlVApiClient();
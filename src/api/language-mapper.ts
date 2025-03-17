/**
 * Maps VS Code language identifiers to CtrlV supported languages
 */
export function mapVSCodeLanguageToCtrlV(vsCodeLangId: string): string {
    // Direct mappings (same name)
    const directMappings = [
        'javascript',
        'typescript',
        'python',
        'java',
        'cpp',
        'php',
        'rust',
        'sql',
        'html',
        'css',
        'markdown',
        'json'
    ];
    
    if (directMappings.includes(vsCodeLangId)) {
        return vsCodeLangId;
    }
    
    // Special mappings
    const specialMappings: Record<string, string> = {
        'plaintext': 'text',
        'shellscript': 'bash',
        'csharp': 'cs',
        'c': 'cpp',
        'objective-c': 'cpp',
        'swift': 'swift', 
        'go': 'go',   
        'ruby': 'ruby', 
        'typescript-react': 'typescript',
        'javascriptreact': 'javascript',
        'vue': 'javascript',
        'vue-html': 'html',
        'xml': 'html',
        'xaml': 'html',
        'yaml': 'json',
        'dockerfile': 'bash',
        'dart': 'javascript',
        'kotlin': 'java',
        'scala': 'java',
        'scss': 'css',
        'less': 'css',
        'stylus': 'css',
        'jsx': 'javascript',
        'tsx': 'typescript'
    };
    
    return specialMappings[vsCodeLangId] || 'text';
}
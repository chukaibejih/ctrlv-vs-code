# CtrlV Code Sharing for VS Code

Share code snippets directly from VS Code with [CtrlV](https://www.ctrlv.codes), the developer's quick share companion designed to eliminate friction from code sharing.

## Features

- **Share Selected Code:** Quickly share any selected code with syntax highlighting
- **Share Entire Files:** Share your complete file with a single click
- **One-Time View Links:** Generate links that automatically expire after a single view
- **Configurable Expiration:** Set how long your shared snippets should remain available
- **Copy to Clipboard:** Automatically copy share URLs to your clipboard
- **Context Menu Integration:** Right-click to share code from the editor
- **Keyboard Shortcuts:** Use Ctrl+Alt+V (Cmd+Alt+V on Mac) to share selected code

## Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "CtrlV Code Sharing"
4. Click Install

## Usage

### Share Selected Text

1. Select the code you want to share
2. Right-click and select "CtrlV: Share Selected Code" or use keyboard shortcut Ctrl+Alt+V (Cmd+Alt+V on Mac)
3. The share URL will be automatically copied to your clipboard

### Share Entire File

1. With a file open in the editor
2. Right-click and select "CtrlV: Share Entire File"
3. The share URL will be automatically copied to your clipboard

### Viewing Shared Code

Shared code can be viewed by anyone with the link. The code will be displayed with proper syntax highlighting on the CtrlV website.

## Configuration

This extension can be customized through VS Code settings:

| Setting | Description | Default |
|---------|-------------|---------|
| `ctrlv.defaultExpiration` | Default expiration time for shared snippets | `24h` |
| `ctrlv.oneTimeViewDefault` | Default setting for one-time view links | `false` |
| `ctrlv.copyToClipboard` | Automatically copy the sharing URL to clipboard | `true` |
| `ctrlv.apiUrl` | CtrlV API URL | `https://backend.ctrlv.codes` |

To change these settings:

1. Open VS Code Settings (File > Preferences > Settings)
2. Search for "CtrlV"
3. Adjust the settings as needed

## Package
npx vsce package

## Known Issue
- The extension does not currently support .tsx files, although it does work properly with .ts files. We're working on adding TypeScript React (.tsx) file support in an upcoming release.

## Privacy and Security

The CtrlV VS Code extension:

- Only sends the code you explicitly choose to share
- Does not collect or transmit any personal information
- Uses secure HTTPS for all API communication
- Honors VS Code's telemetry opt-out settings
- Only collects anonymous usage statistics to improve the extension (if telemetry is enabled)

## FAQ

### Do I need an account to use CtrlV?

No! CtrlV is designed to be frictionless - no signup or login required.

### How long do shared snippets last?

By default, snippets expire after 24 hours, but you can configure this to 1 hour or 7 days in the extension settings.

### Is my code private?

Yes. Shared code is only accessible to people who have the exact share URL with the correct access token.

### What languages are supported?

CtrlV supports syntax highlighting for all major programming languages including JavaScript, TypeScript, Python, Java, C++, PHP, Rust, SQL, HTML, CSS, Markdown, JSON, and many more.

## Issues and Feedback

Found a bug or have a feature request? Please open send an email to chukaibejih@gmail.com.

## About CtrlV

CtrlV is a developer's quick share companion designed to eliminate friction from code sharing. Paste your code, get a shareable link, and you're done. Visit [ctrlv.codes](https://www.ctrlv.codes) to learn more.

## License

MIT
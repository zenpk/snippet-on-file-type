// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
type Defined = {
  fileType: string;
  snippets: Snippet[];
};

type Snippet = {
  name: string;
  content: string;
};
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension "snippet-on-file-type" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "snippet-on-file-type.insertSnippetBasedOnFileType",
    (snippetName: string) => {
      const editor = vscode.window.activeTextEditor;
      const fileType = editor?.document?.languageId;
      if (!fileType) {
        return;
      }
      const config = vscode.workspace.getConfiguration();
      const definedSnippets = config.get(
        "snippet-on-file-type.defineSnippets"
      ) as Defined[];
      let snippetContent = "";
      for (const defined of definedSnippets) {
        if (defined.fileType === fileType) {
          for (const snippet of defined.snippets) {
            if (snippet.name === snippetName) {
              snippetContent = snippet.content;
              break;
            }
          }
          break;
        }
      }
      if (snippetContent) {
        const snippetString = new vscode.SnippetString(snippetContent);
        vscode.window.activeTextEditor?.insertSnippet(snippetString);
      }
    }
  );
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
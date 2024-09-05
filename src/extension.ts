// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
type Defined = {
  fileTypes: string[];
  snippets: Snippets;
};

type Snippets = { [K: string]: string };

export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension "snippet-on-file-type" is now active!');
  const snippetMap = new Map<string, Map<string, string>>(); // fileType -> snippetName -> snippet
  const config = vscode.workspace.getConfiguration();
  const definedSnippets = config.get(
    "snippet-on-file-type.defineSnippets"
  ) as Defined[];
  for (const defined of definedSnippets) {
    for (const fileType of defined.fileTypes) {
      const typeMap = snippetMap.get(fileType) || new Map<string, string>();
      for (const name of Object.keys(defined.snippets)) {
        typeMap.set(name, defined.snippets[name]);
      }
      snippetMap.set(fileType, typeMap);
    }
  }

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "snippet-on-file-type.insertSnippetBasedOnFileType",
    async (snippetName: string, addNewLine = true) => {
      const editor = vscode.window.activeTextEditor;
      const fileType = editor?.document?.languageId;
      if (!fileType) {
        return;
      }
      if (addNewLine) {
        // add a new line below current cursor position
        const position = editor.selection.active;
        const newPosition = position.with(position.line + 1, 0);
        const newSelection = new vscode.Selection(newPosition, newPosition);
        await editor.edit((editBuilder) => {
          editBuilder.insert(newPosition, "\n");
        });
        editor.selection = newSelection;
      }
      const snippetContent = snippetMap.get(fileType)?.get(snippetName) ?? "";
      if (snippetContent) {
        const snippetString = new vscode.SnippetString(snippetContent);
        editor.insertSnippet(snippetString);
      }
    }
  );
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

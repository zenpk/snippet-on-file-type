import * as vscode from "vscode";

type Defined = {
  fileTypes: string[];
  snippets: Snippets;
};

// string for backward compatibility, should use string[] from 1.0.0 onwards
type Snippets = { [K: string]: string | string[] };

export function activate(context: vscode.ExtensionContext) {
  // setup
  const snippetMap = new Map<string, Map<string, string | string[]>>(); // fileType -> snippetName -> snippet
  const config = vscode.workspace.getConfiguration();
  const definedSnippets = config.get(
    "snippet-on-file-type.defineSnippets"
  ) as Defined[];
  for (const defined of definedSnippets) {
    for (const fileType of defined.fileTypes) {
      const typeMap =
        snippetMap.get(fileType) || new Map<string, string | string[]>();
      for (const name of Object.keys(defined.snippets)) {
        typeMap.set(name, defined.snippets[name]);
      }
      snippetMap.set(fileType, typeMap);
    }
  }

  const disposable = vscode.commands.registerCommand(
    "snippet-on-file-type.insertSnippetBasedOnFileType",
    async (snippetName: string, addNewLine = true) => {
      const editor = vscode.window.activeTextEditor;
      const fileType = editor?.document?.languageId;
      if (!fileType) {
        return;
      }
      const snippetContent = snippetMap.get(fileType)?.get(snippetName) ?? "";
      if (!snippetContent) {
        return;
      }

      if (addNewLine) {
        // add a new line below current cursor position
        await vscode.commands.executeCommand("editor.action.insertLineAfter");
      }

      if (typeof snippetContent === "string") {
        // old configuration format
        const snippetString = new vscode.SnippetString(snippetContent);
        editor.insertSnippet(snippetString);
      } else {
        const snippetString = new vscode.SnippetString(
          snippetContent.join("\n")
        );
        editor.insertSnippet(snippetString);
      }
    }
  );
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

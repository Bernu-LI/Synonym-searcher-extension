// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand(
		'synonym-searcher.helloWorld', 
		async () => {

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage("Editor does not exists")
			return
		}

		const text = editor.document.getText(editor.selection)

		const response = await fetch(
			`https://api.datamuse.com/words?ml=${text}`
		)
		const data = await response.json() as any

		const quickPick = vscode.window.createQuickPick()
		quickPick.items = data.map((x: any) => ({label: x.word}))
		quickPick.onDidChangeSelection(([item]) => {
			if (item) {
				editor.edit(edit => {
					edit.replace(editor.selection, item.label)
				})
				quickPick.dispose
			}
		})
		quickPick.onDidHide(() => quickPick.dispose())
		quickPick.show()
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

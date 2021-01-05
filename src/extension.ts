import * as vscode from 'vscode';
import { MinMaxFiinder } from './minmaxfinder';

let minValueDecorationType: vscode.TextEditorDecorationType | undefined;
let maxValueDecorationType: vscode.TextEditorDecorationType | undefined;

let maxDecorators: {
	range: vscode.Range;
	hoverMessage: string;
}[] = [];
let minDecorators: {
	range: vscode.Range;
	hoverMessage: string;
}[] = [];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('"jp-katohirohito-extension-vscode-minmax-in-csv" is activated.');

	// register some listener that make sure the decoration is available until changed.
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(clearHighlightNumbers));
	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(clearHighlightNumbers));

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'jp-katohirohito-extension-vscode-minmax-in-csv.highlightNumbers',
			highlightNumbers));
}

// this method is called when your extension is deactivated
export function deactivate() { }

function highlightNumbers() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	clearHighlightNumbers();

	const minmax = new MinMaxFiinder(editor);
	if (!minmax.hasData) {
		vscode.window.showInformationMessage("There are no values in the document.");
		return;
	}

	// create a decorator type that we use to decorate min numbers
	minValueDecorationType = vscode.window.createTextEditorDecorationType({
		borderWidth: '2px',
		borderStyle: 'solid',
		borderColor: { id: 'minmaxInEditor.minNumberBackground' },
		overviewRulerColor: 'blue',
		overviewRulerLane: vscode.OverviewRulerLane.Right
	});

	// create a decorator type that we use to decorate max numbers
	maxValueDecorationType = vscode.window.createTextEditorDecorationType({
		backgroundColor: { id: 'minmaxInEditor.maxNumberBackground' }
	});

	const minDecorators = minmax.minNumberRanges
		.map(r => { return { range: r, hoverMessage: 'min value' }; });
	const maxDecorators = minmax.maxNumberRanges
		.map(r => { return { range: r, hoverMessage: 'max value' }; });

	editor.setDecorations(minValueDecorationType, minDecorators);
	editor.setDecorations(maxValueDecorationType, maxDecorators);
}

function clearHighlightNumbers() {
	// clean up all decorations
	if (minValueDecorationType) {
		minValueDecorationType.dispose();
		minValueDecorationType = undefined;
	}

	if (maxValueDecorationType) {
		maxValueDecorationType.dispose();
		maxValueDecorationType = undefined;
	}
}
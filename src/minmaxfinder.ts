import * as vscode from 'vscode';

export class MinMaxFiinder {
	readonly hasData;

	max = Number.MIN_VALUE;
	min = Number.MAX_VALUE;
	readonly minNumberRanges: vscode.Range[] = [];
	readonly maxNumberRanges: vscode.Range[] = [];

	constructor(editor: vscode.TextEditor | undefined) {
		if (!editor) {
			return;
		}

		const text = editor.document.getText();

		let regex = /[+-]?\d+(\.\d+)?/g;
		let match;
		while ((match = regex.exec(text))) {
			const value = parseFloat(match[0]);
			if (value <= this.min) {
				if (value < this.min) {
					this.min = value;
					this.minNumberRanges.length = 0;
				}

				this.hasData = true;
				const startPos = editor.document.positionAt(match.index);
				const endPos = editor.document.positionAt(match.index + match[0].length);
				this.minNumberRanges.push(new vscode.Range(startPos, endPos));
			}

			if (value >= this.max) {
				if (value > this.max) {
					this.max = value;
					this.maxNumberRanges.length = 0;
				}

				this.hasData = true;
				const startPos = editor.document.positionAt(match.index);
				const endPos = editor.document.positionAt(match.index + match[0].length);
				this.maxNumberRanges.push(new vscode.Range(startPos, endPos));
			}
		}
	}
}

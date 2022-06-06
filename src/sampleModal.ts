import { App, Modal } from 'obsidian';

export class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const contentEl = this.contentEl;
		contentEl.setText('Woah!');
	}

	onClose() {
		const contentEl = this.contentEl;
		contentEl.empty();
	}
}

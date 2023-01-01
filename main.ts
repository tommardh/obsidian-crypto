import { Editor, MarkdownPostProcessorContext, MarkdownView, Notice, Plugin } from 'obsidian';
import { CryptoSettingTab } from './src/CryptoSettingTab';
import { 
	MyPluginSettings,
	DEFAULT_SETTINGS
} from './src/interfaces';
import { MyCrypto } from './src/myCrypto';
import { EditorModal } from './src/editorModal';

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	myCrypto: MyCrypto;

	async onload() {
		await this.loadSettings();
		this.myCrypto = new MyCrypto(this.settings.secretPath);

		// this.registerMarkdownCodeBlockProcessor("crypto", this.myCrypto.cryptoProcessor);

		this.registerMarkdownCodeBlockProcessor("crypto", (source: string, el: HTMLElement, _ctx: MarkdownPostProcessorContext) => {
			let rows: string [] = [];
			if (this.settings.showDecrypted) {
				const decrypted = this.myCrypto.decrypt(source);
				rows = decrypted.split("\n").filter((row) => row.length > 0);
			} else {
				rows = source.split("\n").filter((row) => row.length > 0);
			}
			const div = el.createEl("div", { cls: "crypto" });
			for (let i = 0; i < rows.length; i++) {
				div.createEl("p", { text: rows[i] });
			}
		});

		this.addCommand({
			id: 'edit-crypto-command',
			name: 'Edit',
			editorCallback: (editor: Editor, _view: MarkdownView) => {
				const selected = editor.getSelection();
				const decrypted = this.myCrypto.decrypt(selected);
				console.log('decrypted:', decrypted);
				if (['Wrong key!', 'No key available!', 'Error: Not possible to decode!'].includes(decrypted)) {
					new Notice(decrypted);
					return;
				}
				const stringToEdit = (decrypted === 'Empty!') ? '' : decrypted;
				console.log('string to edit:', stringToEdit);
				new EditorModal(this.app, stringToEdit, (result) => {
					const encrypted = this.myCrypto.encrypt(result);
					editor.replaceSelection(encrypted);
				}).open();
			}
		});

		this.addCommand({
			id: 'encrypt-command',
			name: 'Encrypt',
			editorCallback: (editor: Editor, _view: MarkdownView) => {
				const selected = editor.getSelection();
				const encrypted = this.myCrypto.encrypt(selected);
				const block = '```crypto\n' + encrypted + '\n```';
				editor.replaceSelection(block);
			}
		});

		this.addCommand({
			id: 'new-crypto-command',
			name: 'New',
			editorCallback: (editor: Editor, _view: MarkdownView) => {
				const selected = '';
				new EditorModal(this.app, selected, (result) => {
					const encrypted = this.myCrypto.encrypt(result);
					const block = '```crypto\n' + encrypted + '\n```';
					editor.replaceSelection(block);
					}).open();
			}
		});

		this.addSettingTab(new CryptoSettingTab(this.app, this));
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}



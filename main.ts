import { Editor, MarkdownPostProcessorContext, MarkdownView, Notice, Plugin } from 'obsidian';
import { SampleSettingTab } from './src/SampleSettingTab';
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
			const decrypted = this.myCrypto.decrypt(source);
			const rows = decrypted.split("\n").filter((row) => row.length > 0);
			const div = el.createEl("div", { cls: "crypto" });
			for (let i = 0; i < rows.length; i++) {
				div.createEl("p", { text: rows[i] });
			}
		});

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, _view: MarkdownView) => {
				const selected = editor.getSelection();
				const decrypted = this.myCrypto.decrypt(selected);		
				new EditorModal(this.app, decrypted, (result) => {
					new Notice(`Hello, ${result}!`);
					const encrypted = this.myCrypto.encrypt(result);
					editor.replaceSelection(encrypted);
				}).open();
			}
		});

		// This adds an editor command that can perform some operation on the current editor instance
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

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
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



import { Editor, MarkdownView, Notice, Plugin } from 'obsidian';
import { SampleSettingTab } from './src/SampleSettingTab';
import { 
	MyPluginSettings,
	DEFAULT_SETTINGS
} from './src/interfaces';
import { SampleModal } from './src/sampleModal';
import { MyCrypto } from './src/myCrypto';
import { EditorModal } from './src/editorModal';

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	myCrypto: MyCrypto;

	async onload() {
		await this.loadSettings();
		this.myCrypto = new MyCrypto(this.settings.secretPath);

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		const text = 'Crypto';
		statusBarItemEl.setText(text);

		this.registerMarkdownCodeBlockProcessor("crypto", (source, el, ctx) => {
			const decrypted = this.myCrypto.decrypt(source);
			const rows = decrypted.split("\n").filter((row) => row.length > 0);
			const div = el.createEl("div", { cls: "crypto" });
			for (let i = 0; i < rows.length; i++) {
				div.createEl("p", { text: rows[i] });
			}
		});

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
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

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
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



import { App, PluginSettingTab, Setting, TextComponent, } from 'obsidian'; // , Notice } from 'obsidian';
import MyPlugin from '../main';
export class CryptoSettingTab extends PluginSettingTab {
	public plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	public display(): void {
		const containerEl = this.containerEl;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Settings for Osidian Crypto.' });

		new Setting(containerEl)
			.setName('Path to crypto key file (including file name)')
			.setDesc('Use path to local file and encrypted files can only be read with this device.')
			.addText((text: TextComponent) => text
				.setPlaceholder('Enter absolute path')
				.setValue(this.plugin.settings.secretPath)
				.onChange(async (value: string) => {
					// console.log('secretpath: ' + value);
					this.plugin.settings.secretPath = value;
					await this.plugin.saveSettings();
					this.plugin.myCrypto.updateSecretPath(value);
					// new Notice('Path to crypto key file updated!');
				})
			);
		new Setting(containerEl)
			.setName('show decrypted')
			.setDesc(
				'shows encrypted data unencrypted',
			)
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.showDecrypted).onChange((value) => {
					this.plugin.settings.showDecrypted = value;
					this.plugin.saveData(this.plugin.settings);
					this.display();
				}),
			);
	}
}

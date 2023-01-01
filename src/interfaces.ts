export interface MyPluginSettings {
	secretPath: string;
	showDecrypted: boolean;
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
	secretPath: './secret.json',
	showDecrypted: false
}

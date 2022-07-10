export interface MyPluginSettings {
	secretPath: string;
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
	secretPath: './secret.json'
}

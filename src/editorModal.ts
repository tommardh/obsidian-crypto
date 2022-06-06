import { App, Modal, Setting, TextAreaComponent } from "obsidian";

export class EditorModal extends Modal {
    private result: string;
    onSubmit: (result: string) => void;

    constructor(app: App, initialValue: string, onSubmit: (result: string) => void) {
        super(app);
        this.onSubmit = onSubmit;
        this.result = initialValue;
    }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h1", { text: "Edit text to encode" });


    new Setting(contentEl)
    .setName("Name")
    .addTextArea((textArea: TextAreaComponent) => {
        textArea.setValue(this.result);
        textArea.onChange((value: string) => {
            this.result = value
        })
    });

    new Setting(contentEl)
      .addButton((btn) =>
        btn
          .setButtonText("Submit")
          .setCta()
          .onClick(() => {
            this.close();
            this.onSubmit(this.result);
          }));
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
export class CompanionSheet extends foundry.applications.sheets.ActorSheetV2 {
  static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
    classes: ["deepshadow", "sheet", "actor", "companion-sheet"],
    position: {
      width: 780
    }
  }, { inplace: false });

  get title() {
    return this.actor?.name || "Companion";
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    context.actor = this.actor;
    context.levelLabel = "RP";

    return context;
  }

  async _renderHTML(context, options) {
    return renderTemplate("templates/companion-sheet.hbs", context);
  }
}

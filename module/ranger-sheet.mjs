export class RangerSheet extends foundry.applications.sheets.ActorSheetV2 {
  static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
    classes: ["deepshadow", "sheet", "actor", "ranger-sheet"],
    position: {
      width: 780
    }
  }, { inplace: false });

  get title() {
    return this.actor?.name || "Ranger";
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    context.actor = this.actor;
    context.levelLabel = "LV";

    return context;
  }

  async _renderHTML(context, options) {
    return renderTemplate("systems/deepshadow/templates/ranger-sheet.hbs", context);
  }
}

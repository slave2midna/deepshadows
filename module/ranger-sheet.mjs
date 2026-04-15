const { ActorSheetV2 } = foundry.applications.sheets;
const { HandlebarsApplicationMixin } = foundry.applications.api;

export class RangerSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
    classes: ["deepshadow", "sheet", "actor", "ranger-sheet"],
    position: {
      width: 780
    },
    form: {
      closeOnSubmit: false
    }
  }, { inplace: false });

  static PARTS = {
    sheet: {
      root: true,
      template: "systems/deepshadow/templates/ranger-sheet.hbs"
    }
  };

  get title() {
    return this.actor?.name || "Ranger";
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.actor = this.actor;
    context.levelLabel = "LV";
    return context;
  }
}

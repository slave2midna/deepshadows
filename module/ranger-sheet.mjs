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
    context.editableImage = this.isEditable;
    return context;
  }

  async _onClickAction(event, target) {
    if (target.dataset.action === "editPortrait") {
      event.preventDefault();
      if (!this.isEditable) return;

      new FilePicker({
        type: "image",
        current: this.actor.img,
        callback: async (path) => {
          await this.actor.update({ img: path });
        }
      }).browse();

      return;
    }

    return super._onClickAction(event, target);
  }
}

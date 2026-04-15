const { ActorSheetV2 } = foundry.applications.sheets;
const { HandlebarsApplicationMixin } = foundry.applications.api;

export class MonsterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
    classes: ["deepshadow", "sheet", "actor", "monster-sheet"],
    position: {
      width: 780
    },
    form: {
      closeOnSubmit: false,
      submitOnChange: true
    }
  }, { inplace: false });

  static PARTS = {
    sheet: {
      root: true,
      template: "systems/deepshadow/templates/monster-sheet.hbs"
    }
  };

  get title() {
    return this.actor?.name || "Monster";
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.actor = this.actor;

    context.extrafield1Name = "system.details.level";
    context.extrafield1Value = this.actor.system.details.level;

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

    if (target.dataset.action === "incrementField" || target.dataset.action === "decrementField") {
      event.preventDefault();
      if (!this.isEditable) return;

      const wrapper = target.closest(".ds-stat-stepper");
      const input = wrapper?.querySelector("input[type='number']");
      if (!input) return;

      if (target.dataset.action === "incrementField") input.stepUp();
      else input.stepDown();

      await this.submit();
      return;
    }

    return super._onClickAction(event, target);
  }
}

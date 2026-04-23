const { ActorSheetV2 } = foundry.applications.sheets;
const { HandlebarsApplicationMixin } = foundry.applications.api;

export class RangerSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  tabGroups = {
    primary: "overview"
  };

  static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
    classes: ["deepshadow", "sheet", "actor", "ranger-sheet"],
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
      template: "systems/deepshadow/templates/ranger-sheet.hbs"
    }
  };

  get title() {
    return this.actor?.name || "Ranger";
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.actor = this.actor;

    context.extrafield1Name = "system.details.level";
    context.extrafield1Value = this.actor.system.details.level;

    context.extrafield2Name = "system.details.experience";
    context.extrafield2Value = this.actor.system.details.experience ?? 0;

    context.subfield1Value = this.actor.system.details.battlePoints ?? 30;
    context.subfield2Value = this.actor.system.details.recruitmentPoints ?? 120;

    const activePrimaryTab = this.tabGroups.primary ?? "overview";

    context.tabs = [
      {
        id: "overview",
        label: "Overview",
        active: activePrimaryTab === "overview"
      },
      {
        id: "abilities",
        label: "Abilities",
        active: activePrimaryTab === "abilities"
      },
      {
        id: "inventory",
        label: "Inventory",
        active: activePrimaryTab === "inventory"
      },
      {
        id: "progression",
        label: "Progression",
        active: activePrimaryTab === "progression"
      },
      {
        id: "party",
        label: "Party",
        active: activePrimaryTab === "party"
      }
    ];

    context.isOverviewTab = activePrimaryTab === "overview";
    context.isAbilitiesTab = activePrimaryTab === "abilities";
    context.isInventoryTab = activePrimaryTab === "inventory";
    context.isProgressionTab = activePrimaryTab === "progression";
    context.isPartyTab = activePrimaryTab === "party";

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

    if (target.dataset.action === "activateTab") {
      event.preventDefault();

      const group = target.dataset.group ?? "primary";
      const tab = target.dataset.tab;
      if (!tab) return;

      this.tabGroups[group] = tab;
      await this.render({ force: true });
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

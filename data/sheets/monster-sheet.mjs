import DeepShadowActorSheet from "./actor-sheet.mjs";

const ATTRIBUTE_ORDER = [
  "move",
  "fight",
  "shoot",
  "armor",
  "will",
  "health"
];

const SKILL_ORDER = [
  "acrobatics",
  "ancientLore",
  "armory",
  "climb",
  "leadership",
  "navigation",
  "perception",
  "pickLock",
  "readRunes",
  "stealth",
  "strength",
  "survival",
  "swim",
  "track",
  "traps"
];

export default class DeepShadowMonsterSheet extends DeepShadowActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [...super.defaultOptions.classes, "monster"],
      width: 780,
      height: 760
    });
  }

  get template() {
    return "systems/deepshadow/templates/actors/monster-sheet.hbs";
  }

  get title() {
    return `${this.actor.name} — Monster`;
  }

  async getData(options = {}) {
    const context = await super.getData(options);
    const system = this.actor.system;

    context.attributes = ATTRIBUTE_ORDER.map((key) => ({
      key,
      ...system.attributes[key]
    }));

    context.skillsList = SKILL_ORDER.map((key) => ({
      key,
      ...system.skills[key]
    }));

    context.profile = system.profile;
    context.rewards = system.rewards;
    context.conditions = system.conditions;
    context.note = system.notes;

    context.hasAnySkills = context.skillsList.some((skill) => Number(skill.value ?? 0) !== 0);
    context.hasInventory = context.inventoryItems.length > 0;
    context.hasFeatures = context.featureItems.length > 0;
    context.hasNotes = Boolean(system.notes?.trim());

    context.tags = [
      system.profile.animal ? "Animal" : null,
      system.profile.undead ? "Undead" : null,
      system.profile.large ? "Large" : null,
      system.profile.flying ? "Flying" : null
    ].filter(Boolean);

    return context;
  }
}

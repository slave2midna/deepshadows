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

export default class DeepShadowRangerSheet extends DeepShadowActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [...super.defaultOptions.classes, "ranger"],
      width: 920,
      height: 820
    });
  }

  get template() {
    return "systems/deepshadow/templates/actors/ranger-sheet.hbs";
  }

  get title() {
    return `${this.actor.name} — Ranger`;
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

    context.advancement = system.advancement;
    context.recruitment = system.recruitment;
    context.conditions = system.conditions;
    context.equipment = system.equipment;

    context.note = system.notes;

    context.spellCount = context.spells.length;
    context.heroicCount = context.heroics.length;
    context.inventoryCount = context.inventoryItems.length;
    context.featureCount = context.featureItems.length;

    context.recruitmentPreview = {
      solo: system.getRecruitmentPoints(1),
      twoPlayers: system.getRecruitmentPoints(2),
      threePlayers: system.getRecruitmentPoints(3),
      fourPlayers: system.getRecruitmentPoints(4)
    };

    context.companionLimitPreview = {
      solo: system.getCompanionLimit(1),
      twoPlayers: system.getCompanionLimit(2),
      threePlayers: system.getCompanionLimit(3),
      fourPlayers: system.getCompanionLimit(4)
    };

    return context;
  }
}

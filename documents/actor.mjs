const GEAR_ITEM_TYPES = ["weapon", "armor", "item"];
const FEATURE_ITEM_TYPES = ["spell", "heroic", "skill", "trait"];

/**
 * Custom Actor document for the Deep Shadow system.
 *
 * Keep this class focused on document-level behavior:
 * - shared helpers
 * - roll helpers
 * - item grouping
 * - type checks
 *
 * Do NOT put your type-specific schema here.
 * Ranger / Companion / Monster system data should live in TypeDataModel classes.
 */
export default class DeepShadowActor extends Actor {
  /* -------------------------------------------- */
  /*  Type Helpers                                */
  /* -------------------------------------------- */

  get isRanger() {
    return this.type === "ranger";
  }

  get isCompanion() {
    return this.type === "companion";
  }

  get isMonster() {
    return this.type === "monster";
  }

  /* -------------------------------------------- */
  /*  Item Group Helpers                          */
  /* -------------------------------------------- */

  /**
   * All owned gear items for this actor.
   * Uses Foundry's built-in itemTypes accessor.
   */
  get gear() {
    return GEAR_ITEM_TYPES.flatMap((type) => this.itemTypes[type] ?? []);
  }

  /**
   * All owned feature / ability items for this actor.
   */
  get features() {
    return FEATURE_ITEM_TYPES.flatMap((type) => this.itemTypes[type] ?? []);
  }

  get weapons() {
    return this.itemTypes.weapon ?? [];
  }

  get armor() {
    return this.itemTypes.armor ?? [];
  }

  get itemsList() {
    return this.itemTypes.item ?? [];
  }

  get spells() {
    return this.itemTypes.spell ?? [];
  }

  get heroicAbilities() {
    return this.itemTypes.heroic ?? [];
  }

  get skillsList() {
    return this.itemTypes.skill ?? [];
  }

  get traits() {
    return this.itemTypes.trait ?? [];
  }

  /* -------------------------------------------- */
  /*  Roll Data                                   */
  /* -------------------------------------------- */

  /**
   * Extend roll data for use in Roll formulas.
   *
   * Foundry notes that systems may extend this object, but should take care
   * not to mutate the original data returned by the base implementation.
   */
  getRollData() {
    const rollData = foundry.utils.deepClone(super.getRollData());

    rollData.actor = {
      id: this.id,
      name: this.name,
      type: this.type
    };

    // These aliases assume the upcoming actor data models use:
    // system.attributes.* and system.skills.*
    rollData.attributes = rollData.attributes ?? {};
    rollData.skills = rollData.skills ?? {};

    return rollData;
  }

  /* -------------------------------------------- */
  /*  Roll Helpers                                */
  /* -------------------------------------------- */

  /**
   * Roll a d20 check using an attribute in system.attributes.<key>.value
   * Example future usage: actor.rollAttribute("fight")
   */
  async rollAttribute(key, { label } = {}) {
    const attribute = this.system.attributes?.[key];
    if (!attribute) {
      ui.notifications?.warn(`Attribute "${key}" was not found on ${this.name}.`);
      return null;
    }

    const value = Number(attribute.value ?? 0);
    const rollLabel = label ?? attribute.label ?? key;

    return this._rollD20(value, rollLabel);
  }

  /**
   * Roll a d20 check using a skill in system.skills.<key>.value
   * Example future usage: actor.rollSkill("stealth")
   */
  async rollSkill(key, { label } = {}) {
    const skill = this.system.skills?.[key];
    if (!skill) {
      ui.notifications?.warn(`Skill "${key}" was not found on ${this.name}.`);
      return null;
    }

    const value = Number(skill.value ?? 0);
    const rollLabel = label ?? skill.label ?? key;

    return this._rollD20(value, rollLabel);
  }

  /**
   * Shared d20 roll helper used by sheet buttons later.
   */
  async _rollD20(modifier = 0, label = "Check") {
    const numericModifier = Number(modifier) || 0;
    const sign = numericModifier >= 0 ? "+" : "-";
    const formula = `1d20 ${sign} ${Math.abs(numericModifier)}`;

    const roll = new Roll(formula);
    await roll.evaluate();

    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `${label}: ${formula}`
    });

    return roll;
  }

  /* -------------------------------------------- */
  /*  Lifecycle                                   */
  /* -------------------------------------------- */

  /**
   * Set safe defaults for newly created actors.
   *
   * Foundry's Actor _preCreate docs note that pending changes at this stage
   * should be applied with updateSource().
   */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);

    const update = {};

    if (!this.img) {
      update.img = "icons/svg/mystery-man.svg";
    }

    if (!this.prototypeToken?.name) {
      update.prototypeToken = {
        ...(this.prototypeToken?.toObject?.() ?? {}),
        name: this.name
      };
    }

    if (foundry.utils.isEmpty(update)) return;

    this.updateSource(update);
  }
}

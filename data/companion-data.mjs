const { BooleanField, NumberField, SchemaField, StringField } = foundry.data.fields;

const COMPANION_PROGRESSION_REWARDS = [
  { points: 10, label: "+1 Health" },
  { points: 20, label: "Choose: +1 Fight or +1 Shoot" },
  { points: 30, label: "+4 to one Skill (max +10)" },
  { points: 40, label: "+2 Will" },
  { points: 50, label: "Choose one Heroic Ability" },
  { points: 60, label: "+1 Health" },
  { points: 70, label: "+4 to one Skill (max +10)" },
  { points: 80, label: "+2 Will" },
  { points: 100, label: "Choose one Heroic Ability" }
];

/**
 * Reusable schema for a stat with a base value and a current/effective value.
 * This supports split stats and temporary modifiers cleanly.
 */
function statField(label, abbreviation, initial, { integer = true, min = null } = {}) {
  const numberOptions = { required: true, integer, initial };
  if (min !== null) numberOptions.min = min;

  return new SchemaField({
    label: new StringField({ required: true, blank: false, initial: label }),
    abbreviation: new StringField({ required: true, blank: false, initial: abbreviation }),
    base: new NumberField(numberOptions),
    value: new NumberField(numberOptions)
  });
}

/**
 * Reusable schema for a skill.
 */
function skillField(label, initial = 0) {
  return new SchemaField({
    label: new StringField({ required: true, blank: false, initial: label }),
    base: new NumberField({ required: true, integer: true, initial }),
    value: new NumberField({ required: true, integer: true, initial })
  });
}

export default class DeepShadowCompanionData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      notes: new StringField({ required: true, blank: true, initial: "" }),

      profile: new SchemaField({
        archetype: new StringField({ required: true, blank: true, initial: "" }),
        animal: new BooleanField({ required: true, initial: false }),
        canCarryItems: new BooleanField({ required: true, initial: true }),
        canCarryTreasure: new BooleanField({ required: true, initial: true })
      }),

      recruitment: new SchemaField({
        cost: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
      }),

      progression: new SchemaField({
        points: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
      }),

      equipment: new SchemaField({
        itemSlots: new NumberField({ required: true, integer: true, min: 0, initial: 2 })
      }),

      conditions: new SchemaField({
        poisoned: new BooleanField({ required: true, initial: false }),
        diseased: new BooleanField({ required: true, initial: false }),
        hungerThirst: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
      }),

      attributes: new SchemaField({
        move: statField("Move", "M", 6, { integer: false, min: 0 }),
        fight: statField("Fight", "F", 0),
        shoot: statField("Shoot", "S", 0),
        armor: statField("Armour", "A", 10, { min: 0 }),
        will: statField("Will", "W", 0),
        health: statField("Health", "H", 10, { min: 0 })
      }),

      skills: new SchemaField({
        acrobatics: skillField("Acrobatics"),
        ancientLore: skillField("Ancient Lore"),
        armory: skillField("Armoury"),
        climb: skillField("Climb"),
        leadership: skillField("Leadership"),
        navigation: skillField("Navigation"),
        perception: skillField("Perception"),
        pickLock: skillField("Pick Lock"),
        readRunes: skillField("Read Runes"),
        stealth: skillField("Stealth"),
        strength: skillField("Strength"),
        survival: skillField("Survival"),
        swim: skillField("Swim"),
        track: skillField("Track"),
        traps: skillField("Traps")
      })
    };
  }

  /**
   * Migrate legacy French companion data into the new English v13 schema.
   * This handles old `compagnion` sheet data paths.
   */
  static migrateData(source) {
    if (!source || (typeof source !== "object")) return super.migrateData(source);

    const get = foundry.utils.getProperty;
    const set = foundry.utils.setProperty;

    const toNumber = (value, fallback = 0) => {
      const n = Number(value);
      return Number.isFinite(n) ? n : fallback;
    };

    // Legacy note -> notes
    if (source.note !== undefined && source.notes === undefined) {
      source.notes = source.note;
    }

    // Legacy companion stored recruitment/progression under caracteristique.*
    if (get(source, "recruitment.cost") === undefined && get(source, "caracteristique.pointrecrutement.valeur") !== undefined) {
      set(source, "recruitment.cost", toNumber(get(source, "caracteristique.pointrecrutement.valeur"), 0));
    }

    if (get(source, "progression.points") === undefined && get(source, "caracteristique.pointprogression.valeur") !== undefined) {
      set(source, "progression.points", toNumber(get(source, "caracteristique.pointprogression.valeur"), 0));
    }

    const legacyStats = source.caracteristique ?? {};
    const statMap = {
      mouvement: ["move", 6],
      combat: ["fight", 0],
      tir: ["shoot", 0],
      armure: ["armor", 10],
      volonte: ["will", 0],
      voonte: ["will", 0],
      sante: ["health", 10]
    };

    for (const [legacyKey, [newKey, fallback]] of Object.entries(statMap)) {
      const raw = get(legacyStats, `${legacyKey}.valeur`);
      if (raw === undefined) continue;

      if (get(source, `attributes.${newKey}.base`) === undefined) {
        set(source, `attributes.${newKey}.base`, toNumber(raw, fallback));
      }

      if (get(source, `attributes.${newKey}.value`) === undefined) {
        set(source, `attributes.${newKey}.value`, toNumber(raw, fallback));
      }
    }

    // Legacy current health was stored separately.
    if (get(source, "caracteristique.santeactuelle.valeur") !== undefined) {
      set(
        source,
        "attributes.health.value",
        toNumber(get(source, "caracteristique.santeactuelle.valeur"), get(source, "attributes.health.base") ?? 10)
      );
    }

    const legacySkills = source.competence ?? {};
    const skillMap = {
      acrobaties: "acrobatics",
      arsenal: "armory",
      commandement: "leadership",
      crochetage: "pickLock",
      escalade: "climb",
      force: "strength",
      furtivite: "stealth",
      lecturerune: "readRunes",
      natation: "swim",
      orientation: "navigation",
      perception: "perception",
      piege: "traps",
      pistage: "track",
      savoirancien: "ancientLore",
      survie: "survival"
    };

    for (const [legacyKey, newKey] of Object.entries(skillMap)) {
      const raw = get(legacySkills, `${legacyKey}.valeur`);
      if (raw === undefined) continue;

      if (get(source, `skills.${newKey}.base`) === undefined) {
        set(source, `skills.${newKey}.base`, toNumber(raw, 0));
      }

      if (get(source, `skills.${newKey}.value`) === undefined) {
        set(source, `skills.${newKey}.value`, toNumber(raw, 0));
      }
    }
    return super.migrateData(source);
  }
  get currentHealth() {
    return this.attributes.health.value;
  }
  get maxHealth() {
    return this.attributes.health.base;
  }
  get isWounded() {
    return this.currentHealth < this.maxHealth;
  }
  get isAnimal() {
    return this.profile.animal;
  }
  get canCarryItems() {
    return !this.profile.animal && this.profile.canCarryItems;
  }
  get canCarryTreasure() {
    return !this.profile.animal && this.profile.canCarryTreasure;
  }
  get isSpellcaster() {
    return (this.parent?.itemTypes?.spell?.length ?? 0) > 0;
  }
  get unlockedProgressionRewards() {
    return COMPANION_PROGRESSION_REWARDS.filter((reward) => this.progression.points >= reward.points);
  }
  get nextProgressionReward() {
    return COMPANION_PROGRESSION_REWARDS.find((reward) => this.progression.points < reward.points) ?? null;
  }
}

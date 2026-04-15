const { BooleanField, NumberField, SchemaField, StringField } = foundry.data.fields;

/**
 * Reusable schema for a stat that can have a base value and a current/effective value.
 * This matches Rangers of Shadow Deep's "split stat" idea without forcing it into the sheet yet.
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

export class RangerData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      notes: new StringField({ required: true, blank: true, initial: "" }),

      advancement: new SchemaField({
        level: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        experience: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
      }),

      recruitment: new SchemaField({
        base: new NumberField({ required: true, integer: true, min: 0, initial: 100 })
      }),

      equipment: new SchemaField({
        itemSlots: new NumberField({ required: true, integer: true, min: 0, initial: 6 })
      }),

      conditions: new SchemaField({
        poisoned: new BooleanField({ required: true, initial: false }),
        diseased: new BooleanField({ required: true, initial: false }),
        hungerThirst: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
      }),

      attributes: new SchemaField({
        move: statField("Move", "M", 6, { integer: false, min: 0 }),
        fight: statField("Fight", "F", 2),
        shoot: statField("Shoot", "S", 1),
        armor: statField("Armour", "A", 10, { min: 0 }),
        will: statField("Will", "W", 4),
        health: statField("Health", "H", 18, { min: 0 })
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
   * Migrate legacy French template data into the new English v13 schema.
   * This lets old actors survive the upgrade path.
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

    // Legacy scalar fields
    if (get(source, "advancement.level") === undefined && get(source, "niveau.valeur") !== undefined) {
      set(source, "advancement.level", toNumber(get(source, "niveau.valeur"), 0));
    }

    if (get(source, "advancement.experience") === undefined && get(source, "experience.valeur") !== undefined) {
      set(source, "advancement.experience", toNumber(get(source, "experience.valeur"), 0));
    }

    if (get(source, "recruitment.base") === undefined && get(source, "pointrecrutement.valeur") !== undefined) {
      set(source, "recruitment.base", toNumber(get(source, "pointrecrutement.valeur"), 100));
    }

    const legacyStats = source.caracteristique ?? {};
    const statMap = {
      mouvement: ["move", 6],
      combat: ["fight", 2],
      tir: ["shoot", 1],
      armure: ["armor", 10],
      volonte: ["will", 4],
      sante: ["health", 18]
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

  get isSpellcaster() {
    return (this.parent?.itemTypes?.spell?.length ?? 0) > 0;
  }

  /**
   * Calculate mission Recruitment Points using the rules table.
   * Leadership is added to total RP, not base RP.
   */
  getRecruitmentPoints(playerCount = 1) {
    const base = this.recruitment.base;
    const leadership = this.skills.leadership.value ?? 0;

    switch (Number(playerCount)) {
      case 1:
        return base + leadership;
      case 2:
        return Math.max(0, Math.floor((base * 0.5) - 10 + leadership));
      case 3:
        return Math.max(0, Math.floor((base * 0.3) + leadership));
      case 4:
        return Math.max(0, Math.floor((base * 0.1) + leadership));
      default:
        return base + leadership;
    }
  }

  getCompanionLimit(playerCount = 1) {
    switch (Number(playerCount)) {
      case 1: return 7;
      case 2: return 3;
      case 3: return 2;
      case 4: return 1;
      default: return 7;
    }
  }
}

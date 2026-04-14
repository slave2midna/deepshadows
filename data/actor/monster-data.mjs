const { BooleanField, NumberField, SchemaField, StringField } = foundry.data.fields;

/**
 * Reusable stat schema with base/current values.
 * This keeps split stats and temporary effects possible without redesigning later.
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
 * Optional monster skill schema.
 * Most monsters may leave these at 0, but having them now avoids repainting the dungeon later.
 */
function skillField(label, initial = 0) {
  return new SchemaField({
    label: new StringField({ required: true, blank: false, initial: label }),
    base: new NumberField({ required: true, integer: true, initial }),
    value: new NumberField({ required: true, integer: true, initial })
  });
}

export default class DeepShadowMonsterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      notes: new StringField({ required: true, blank: true, initial: "" }),

      profile: new SchemaField({
        archetype: new StringField({ required: true, blank: true, initial: "" }),
        classification: new StringField({ required: true, blank: true, initial: "" }),
        animal: new BooleanField({ required: true, initial: false }),
        undead: new BooleanField({ required: true, initial: false }),
        large: new BooleanField({ required: true, initial: false }),
        flying: new BooleanField({ required: true, initial: false })
      }),

      rewards: new SchemaField({
        xp: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
      }),

      conditions: new SchemaField({
        poisoned: new BooleanField({ required: true, initial: false }),
        diseased: new BooleanField({ required: true, initial: false })
      }),

      attributes: new SchemaField({
        move: statField("Move", "M", 6, { integer: false, min: 0 }),
        fight: statField("Fight", "F", 2),
        shoot: statField("Shoot", "S", 1),
        armor: statField("Armour", "A", 10, { min: 0 }),
        will: statField("Will", "W", 4),
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
   * Migrate legacy French monster data into the new English v13 schema.
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
      if (Array.isArray(source.note)) source.notes = source.note.join("\n");
      else source.notes = String(source.note ?? "");
    }

    const legacyStats = source.caracteristique ?? {};
    const statMap = {
      mouvement: ["move", 6],
      combat: ["fight", 2],
      tir: ["shoot", 1],
      armure: ["armor", 10],
      volonte: ["will", 4],
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

    // Legacy XP lived inside caracteristique.XP.valeur
    if (get(source, "rewards.xp") === undefined) {
      const rawXp = get(legacyStats, "XP.valeur") ?? get(legacyStats, "xp.valeur");
      if (rawXp !== undefined) {
        set(source, "rewards.xp", toNumber(rawXp, 0));
      }
    }

    // Legacy monsters generally had no explicit skills, but accept migrated values if present.
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
  get isDefeated() {
    return this.currentHealth <= 0;
  }
  get isSpellcaster() {
    return (this.parent?.itemTypes?.spell?.length ?? 0) > 0;
  }
}

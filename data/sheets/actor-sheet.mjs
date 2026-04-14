const INVENTORY_ITEM_TYPES = ["weapon", "armor", "item"];
const FEATURE_ITEM_TYPES = ["spell", "heroic", "skill", "trait"];

/**
 * Shared base sheet for Deep Shadow actors.
 *
 * This is a classic ActorSheet-based implementation for v13 migration work.
 * Ranger / Companion / Monster sheets should extend this class and only
 * override what is type-specific, especially the template path.
 */
export default class DeepShadowActorSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["deepshadow", "sheet", "actor"],
      width: 780,
      height: 720,
      resizable: true,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "stats"
        }
      ]
    });
  }

  get template() {
    throw new Error(
      `${this.constructor.name} must define its own template getter.`
    );
  }

  async getData(options = {}) {
    const context = await super.getData(options);

    context.system = this.actor.system;
    context.owner = this.actor.isOwner;
    context.editable = this.isEditable;

    context.isRanger = this.actor.type === "ranger";
    context.isCompanion = this.actor.type === "companion";
    context.isMonster = this.actor.type === "monster";

    context.weapons = this._sortItems(this.actor.itemTypes.weapon ?? []);
    context.armor = this._sortItems(this.actor.itemTypes.armor ?? []);
    context.items = this._sortItems(this.actor.itemTypes.item ?? []);
    context.spells = this._sortItems(this.actor.itemTypes.spell ?? []);
    context.heroics = this._sortItems(this.actor.itemTypes.heroic ?? []);
    context.skills = this._sortItems(this.actor.itemTypes.skill ?? []);
    context.traits = this._sortItems(this.actor.itemTypes.trait ?? []);

    context.inventoryItems = this._sortItems(
      INVENTORY_ITEM_TYPES.flatMap((type) => this.actor.itemTypes[type] ?? [])
    );

    context.featureItems = this._sortItems(
      FEATURE_ITEM_TYPES.flatMap((type) => this.actor.itemTypes[type] ?? [])
    );

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.on("click", ".rollable", this._onRoll.bind(this));

    if (!this.isEditable) return;

    html.on("click", ".item-create", this._onItemCreate.bind(this));
    html.on("click", ".item-edit", this._onItemEdit.bind(this));
    html.on("click", ".item-delete", this._onItemDelete.bind(this));
  }

  _sortItems(items) {
    return [...items].sort((a, b) => {
      const sortDiff = (a.sort ?? 0) - (b.sort ?? 0);
      if (sortDiff !== 0) return sortDiff;
      return a.name.localeCompare(b.name);
    });
  }

  _getItemFromEvent(event) {
    const itemRow = event.currentTarget.closest("[data-item-id]");
    if (!itemRow) return null;
    return this.actor.items.get(itemRow.dataset.itemId) ?? null;
  }

  _getDefaultItemName(type) {
    const prettyType = type.charAt(0).toUpperCase() + type.slice(1);
    return `New ${prettyType}`;
  }

  async _onItemCreate(event) {
    event.preventDefault();

    const type = event.currentTarget.dataset.itemType;
    if (!type) return;

    const itemData = {
      name: this._getDefaultItemName(type),
      type
    };

    const created = await this.actor.createEmbeddedDocuments("Item", [itemData]);
    created?.[0]?.sheet?.render(true);
  }

  async _onItemEdit(event) {
    event.preventDefault();

    const item = this._getItemFromEvent(event);
    if (!item) return;

    item.sheet.render(true);
  }

  async _onItemDelete(event) {
    event.preventDefault();

    const item = this._getItemFromEvent(event);
    if (!item) return;

    await this.actor.deleteEmbeddedDocuments("Item", [item.id]);
  }

  async _onRoll(event) {
    event.preventDefault();

    const button = event.currentTarget;
    const rollType = button.dataset.rollType;
    const rollKey = button.dataset.rollKey;
    const rollLabel = button.dataset.rollLabel;
    const modifier = Number(button.dataset.rollModifier ?? 0);

    switch (rollType) {
      case "attribute":
        if (!rollKey) return;
        await this.actor.rollAttribute(rollKey, { label: rollLabel });
        break;

      case "skill":
        if (!rollKey) return;
        await this.actor.rollSkill(rollKey, { label: rollLabel });
        break;

      case "flat":
        await this.actor._rollD20(modifier, rollLabel ?? "Check");
        break;

      default:
        console.warn(
          `DeepShadowActorSheet | Unknown roll type "${rollType}" on actor sheet.`
        );
    }
  }
}

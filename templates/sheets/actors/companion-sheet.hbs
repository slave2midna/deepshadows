<form class="{{cssClass}} deepshadow-sheet companion-sheet" autocomplete="off">
  <header class="sheet-header">
    <img
      class="profile-img"
      src="{{actor.img}}"
      data-edit="img"
      title="{{actor.name}}"
      alt="{{actor.name}}"
      height="128"
      width="128"
    />

    <div class="header-fields">
      <h1 class="charname">
        <input name="name" type="text" value="{{actor.name}}" placeholder="Companion Name" />
      </h1>

      <div class="companion-meta-grid">
        <label class="meta-field">
          <span>Recruitment Cost</span>
          <input
            name="system.recruitment.cost"
            type="number"
            value="{{system.recruitment.cost}}"
            min="0"
            step="1"
          />
        </label>

        <label class="meta-field">
          <span>Progression Points</span>
          <input
            name="system.progression.points"
            type="number"
            value="{{system.progression.points}}"
            min="0"
            step="1"
          />
        </label>

        <label class="meta-field">
          <span>Item Slots</span>
          <input
            name="system.equipment.itemSlots"
            type="number"
            value="{{system.equipment.itemSlots}}"
            min="0"
            step="1"
          />
        </label>

        <label class="meta-field">
          <span>Archetype</span>
          <input
            name="system.profile.archetype"
            type="text"
            value="{{system.profile.archetype}}"
            placeholder="Knight, Archer, Hound, Rogue..."
          />
        </label>
      </div>

      <div class="condition-row">
        <label class="checkbox-field">
          <input
            type="checkbox"
            name="system.profile.animal"
            {{checked system.profile.animal}}
          />
          <span>Animal</span>
        </label>

        <label class="checkbox-field">
          <input
            type="checkbox"
            name="system.profile.canCarryItems"
            {{checked system.profile.canCarryItems}}
          />
          <span>Can Carry Items</span>
        </label>

        <label class="checkbox-field">
          <input
            type="checkbox"
            name="system.profile.canCarryTreasure"
            {{checked system.profile.canCarryTreasure}}
          />
          <span>Can Carry Treasure</span>
        </label>

        <label class="checkbox-field">
          <input
            type="checkbox"
            name="system.conditions.poisoned"
            {{checked system.conditions.poisoned}}
          />
          <span>Poisoned</span>
        </label>

        <label class="checkbox-field">
          <input
            type="checkbox"
            name="system.conditions.diseased"
            {{checked system.conditions.diseased}}
          />
          <span>Diseased</span>
        </label>
      </div>
    </div>
  </header>

  <nav class="sheet-tabs tabs" data-group="primary">
    <a class="item" data-tab="stats">Stats</a>
    <a class="item" data-tab="skills">Skills</a>
    <a class="item" data-tab="inventory">Inventory</a>
    <a class="item" data-tab="notes">Notes</a>
  </nav>

  <section class="sheet-body">
    <div class="tab" data-group="primary" data-tab="stats">
      <section class="sheet-panel">
        <h2>Attributes</h2>

        <div class="attribute-grid">
          {{#each attributes as |attribute|}}
            <div class="attribute-card">
              <div class="attribute-header">
                <h3>{{attribute.label}}</h3>
                <a
                  class="rollable"
                  data-roll-type="attribute"
                  data-roll-key="{{attribute.key}}"
                  data-roll-label="{{attribute.label}}"
                  title="Roll {{attribute.label}}"
                >
                  <i class="fas fa-dice-d20"></i>
                </a>
              </div>

              <div class="attribute-values">
                <label>
                  <span>Current</span>
                  <input
                    name="system.attributes.{{attribute.key}}.value"
                    type="number"
                    value="{{attribute.value}}"
                    step="1"
                  />
                </label>

                <label>
                  <span>Base</span>
                  <input
                    name="system.attributes.{{attribute.key}}.base"
                    type="number"
                    value="{{attribute.base}}"
                    step="1"
                  />
                </label>
              </div>
            </div>
          {{/each}}
        </div>
      </section>

      <section class="sheet-panel">
        <h2>Companion Progression</h2>

        <div class="progression-summary">
          <div class="progression-card">
            <h3>Unlocked Rewards</h3>
            <ol class="simple-list">
              {{#each system.unlockedProgressionRewards as |reward|}}
                <li>{{reward.points}} PP — {{reward.label}}</li>
              {{else}}
                <li>No rewards unlocked yet.</li>
              {{/each}}
            </ol>
          </div>

          <div class="progression-card">
            <h3>Next Reward</h3>
            {{#if system.nextProgressionReward}}
              <p>
                <strong>{{system.nextProgressionReward.points}} PP</strong> —
                {{system.nextProgressionReward.label}}
              </p>
            {{else}}
              <p>All listed progression rewards have been unlocked.</p>
            {{/if}}
          </div>
        </div>
      </section>
    </div>

    <div class="tab" data-group="primary" data-tab="skills">
      <section class="sheet-panel">
        <h2>Skills</h2>

        <table class="skills-table">
          <thead>
            <tr>
              <th>Skill</th>
              <th>Current</th>
              <th>Base</th>
              <th>Roll</th>
            </tr>
          </thead>
          <tbody>
            {{#each skillsList as |skill|}}
              <tr>
                <td>{{skill.label}}</td>
                <td>
                  <input
                    name="system.skills.{{skill.key}}.value"
                    type="number"
                    value="{{skill.value}}"
                    step="1"
                  />
                </td>
                <td>
                  <input
                    name="system.skills.{{skill.key}}.base"
                    type="number"
                    value="{{skill.base}}"
                    step="1"
                  />
                </td>
                <td>
                  <a
                    class="rollable"
                    data-roll-type="skill"
                    data-roll-key="{{skill.key}}"
                    data-roll-label="{{skill.label}}"
                    title="Roll {{skill.label}}"
                  >
                    <i class="fas fa-dice-d20"></i>
                  </a>
                </td>
              </tr>
            {{/each}}
          </tbody>
        </table>
      </section>
    </div>

    <div class="tab" data-group="primary" data-tab="inventory">
      <section class="sheet-panel">
        <div class="section-header">
          <h2>Equipment</h2>
          <div class="section-controls">
            <a class="item-create" data-item-type="weapon" title="Create Weapon">
              <i class="fas fa-plus"></i> Weapon
            </a>
            <a class="item-create" data-item-type="armor" title="Create Armor">
              <i class="fas fa-plus"></i> Armor
            </a>
            <a class="item-create" data-item-type="item" title="Create Item">
              <i class="fas fa-plus"></i> Item
            </a>
          </div>
        </div>

        <ol class="item-list">
          {{#each inventoryItems as |item|}}
            <li class="item" data-item-id="{{item.id}}">
              <div class="item-name">
                <img src="{{item.img}}" title="{{item.name}}" alt="{{item.name}}" width="32" height="32" />
                <div class="item-text">
                  <h4>{{item.name}}</h4>
                  <div class="item-type">{{item.type}}</div>
                </div>
              </div>

              <div class="item-summary">
                {{item.system.notes}}
              </div>

              <div class="item-controls">
                <a class="item-edit" title="Edit Item">
                  <i class="fas fa-edit"></i>
                </a>
                <a class="item-delete" title="Delete Item">
                  <i class="fas fa-trash"></i>
                </a>
              </div>
            </li>
          {{else}}
            <li class="item empty">No equipment yet.</li>
          {{/each}}
        </ol>
      </section>

      <section class="sheet-panel">
        <div class="section-header">
          <h2>Abilities & Training</h2>
          <div class="section-controls">
            <a class="item-create" data-item-type="heroic" title="Create Heroic Ability">
              <i class="fas fa-plus"></i> Heroic
            </a>
            <a class="item-create" data-item-type="spell" title="Create Spell">
              <i class="fas fa-plus"></i> Spell
            </a>
            <a class="item-create" data-item-type="skill" title="Create Skill Item">
              <i class="fas fa-plus"></i> Skill
            </a>
            <a class="item-create" data-item-type="trait" title="Create Trait">
              <i class="fas fa-plus"></i> Trait
            </a>
          </div>
        </div>

        <ol class="item-list">
          {{#each featureItems as |item|}}
            <li class="item" data-item-id="{{item.id}}">
              <div class="item-name">
                <img src="{{item.img}}" title="{{item.name}}" alt="{{item.name}}" width="32" height="32" />
                <div class="item-text">
                  <h4>{{item.name}}</h4>
                  <div class="item-type">{{item.type}}</div>
                </div>
              </div>

              <div class="item-summary">
                {{item.system.notes}}
              </div>

              <div class="item-controls">
                <a class="item-edit" title="Edit Feature">
                  <i class="fas fa-edit"></i>
                </a>
                <a class="item-delete" title="Delete Feature">
                  <i class="fas fa-trash"></i>
                </a>
              </div>
            </li>
          {{else}}
            <li class="item empty">No abilities, spells, or traits yet.</li>
          {{/each}}
        </ol>
      </section>
    </div>

    <div class="tab" data-group="primary" data-tab="notes">
      <section class="sheet-panel">
        <h2>Notes</h2>
        <textarea
          name="system.notes"
          rows="18"
          placeholder="Companion notes, injuries, special rules, or campaign history."
        >{{note}}</textarea>
      </section>
    </div>
  </section>
</form>

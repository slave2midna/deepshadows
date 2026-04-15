import { RangerData } from "./data/ranger-data.mjs";
import { CompanionData } from "./data/companion-data.mjs";
import { MonsterData } from "./data/monster-data.mjs";

import { RangerSheet } from "./module/ranger-sheet.mjs";
import { CompanionSheet } from "./module/companion-sheet.mjs";
import { MonsterSheet } from "./module/monster-sheet.mjs";

/**
 * Preload shared Handlebars partials used by actor sheets.
 */
async function preloadDeepShadowTemplates() {
  return foundry.applications.handlebars.loadTemplates({
    actorHeader: "systems/deepshadow/templates/shared/actor-header.hbs"
  });
}

Hooks.once("init", async function () {
  console.log("DeepShadow | Initializing Rangers of Shadow Deep system");

  /**
   * Register Actor system data models.
   * These become actor.system for each matching Actor type.
   */
  CONFIG.Actor.dataModels.ranger = DeepShadowRangerData;
  CONFIG.Actor.dataModels.companion = CompanionData;
  CONFIG.Actor.dataModels.monster = MonsterData;

  /**
   * Register Actor sheets.
   * Each Actor type gets its own sheet class and default sheet.
   */
  foundry.documents.collections.Actors.registerSheet("deepshadow", RangerSheet, {
    types: ["ranger"],
    makeDefault: true,
    label: "Ranger Sheet"
  });

  foundry.documents.collections.Actors.registerSheet("deepshadow", CompanionSheet, {
    types: ["companion"],
    makeDefault: true,
    label: "Companion Sheet"
  });

  foundry.documents.collections.Actors.registerSheet("deepshadow", MonsterSheet, {
    types: ["monster"],
    makeDefault: true,
    label: "Monster Sheet"
  });

  /**
   * Preload shared Handlebars partials.
   */
  await preloadDeepShadowTemplates();
});

Hooks.once("ready", function () {
  console.log("DeepShadow | System ready");
});

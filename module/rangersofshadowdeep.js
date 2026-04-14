import DeepShadowActor from "./documents/actor.mjs";

import DeepShadowRangerData from "./data/actor/ranger-data.mjs";
import DeepShadowCompanionData from "./data/actor/companion-data.mjs";
import DeepShadowMonsterData from "./data/actor/monster-data.mjs";

import DeepShadowRangerSheet from "./sheets/ranger-sheet.mjs";
import DeepShadowCompanionSheet from "./sheets/companion-sheet.mjs";
import DeepShadowMonsterSheet from "./sheets/monster-sheet.mjs";

Hooks.once("init", () => {
  console.log("deepshadow | Initializing Deep Shadow system");

  // Custom Actor document implementation
  CONFIG.Actor.documentClass = DeepShadowActor;

  // Actor type data models
  CONFIG.Actor.dataModels.ranger = DeepShadowRangerData;
  CONFIG.Actor.dataModels.companion = DeepShadowCompanionData;
  CONFIG.Actor.dataModels.monster = DeepShadowMonsterData;

  // Remove core actor sheet and register our type-specific sheets
  Actors.unregisterSheet("core", ActorSheet);

  Actors.registerSheet("deepshadow", DeepShadowRangerSheet, {
    types: ["ranger"],
    makeDefault: true
  });

  Actors.registerSheet("deepshadow", DeepShadowCompanionSheet, {
    types: ["companion"],
    makeDefault: true
  });

  Actors.registerSheet("deepshadow", DeepShadowMonsterSheet, {
    types: ["monster"],
    makeDefault: true
  });

  // Temporary testing choice:
  // Do NOT register a custom Item sheet yet.
  // The old item sheet is still tied to the old system id, old template paths,
  // and old data access patterns, so leave core ItemSheet in place until the
  // new item side is rebuilt.
});

/* global ngapp, xelib, fh */
const signaturesToProcess = [
  "ALCH", "AMMO", "BOOK", "INGR", "MISC", "SCRL", "SLGM", 
  "SPEL", "WEAP"
];

let buildProcessBlock = function(signature) {
  return {
    load: () => { return { signature: signature }; },
    patch: function(record, helpers, settings, locals) {
      let editorId = xelib.GetValue(record, "EDID");
      let recordRules = locals.rules[signature];
      if (recordRules.hasOwnProperty(editorId)) {
        if (!xelib.HasElement(record, "FULL")) return;
        xelib.SetValue(record, "FULL", recordRules[editorId]);
        helpers.logMessage(`Adding ${xelib.LongName(record)}`);
      }
    }
  }
};

registerPatcher({
  info: info,
  gameModes: [xelib.gmTES5, xelib.gmSSE],
  settings: {
    label: "SORT Settings",
    templateUrl: `${patcherUrl}/partials/settings.html`,
    defaultSettings: {
      patchFileName: "SORT.esp"
    }
  },
  execute: {
    initialize: function(patch, helpers, settings, locals) {
      locals.rules = fh.loadJsonFile(`${patcherPath}/rules.json`);
    },
    process: signaturesToProcess.map(buildProcessBlock)
  }
});
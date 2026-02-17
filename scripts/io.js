var IO = (function () {
  var REQUIRED_KEYS = ["id", "description", "amount", "category", "date", "createdAt", "updatedAt"];

  function exportJSON() {
    var blob = new Blob([JSON.stringify(State.getTx(), null, 2)], { type: "application/json" });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement("a");
    a.href     = url;
    a.download = "transactions.json";
    a.click();
    URL.revokeObjectURL(url);
    Helpers.announce("Exported successfully.");
  }

  function importJSON(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      var data;
      try { data = JSON.parse(e.target.result); }
      catch (err) { Helpers.announce("Invalid JSON file.", true); return; }

      if (!Array.isArray(data)) {
        Helpers.announce("File must contain a JSON array.", true);
        return;
      }
      var valid = data.every(function (record) {
        return REQUIRED_KEYS.every(function (key) {
          return Object.prototype.hasOwnProperty.call(record, key);
        });
      });
      if (!valid) {
        Helpers.announce("Some records are missing required fields.", true);
        return;
      }

      var existing  = State.getTx();
      var existIds  = new Set(existing.map(function (x) { return x.id; }));
      var toAdd     = data.filter(function (r) { return !existIds.has(r.id); });
      State.setTx(existing.concat(toAdd));
      Records.render();
      Dashboard.render();
      Helpers.announce("Imported " + toAdd.length + " new records.");
    };
    reader.readAsText(file);
  }

  return { exportJSON: exportJSON, importJSON: importJSON };
}());
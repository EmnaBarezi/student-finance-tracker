var SettingsUI = (function () {

  function load() {
    var cfg = State.getCfg();
    document.getElementById("s-budget").value = cfg.budget  || 500;
    document.getElementById("s-eur").value    = cfg.rateEUR || 0.92;
    document.getElementById("s-gbp").value    = cfg.rateGBP || 0.79;
    renderCategories();
    refreshFilterDropdown();
  }

  function renderCategories() {
    var el   = document.getElementById("cat-list");
    var cats = State.getCfg().categories;
    el.innerHTML = cats.map(function (c) {
      return (
        '<span class="cat-pill">' +
        Helpers.escapeHtml(c) +
        '<button data-cat="' + Helpers.escapeHtml(c) + '" aria-label="Remove ' + Helpers.escapeHtml(c) + '">&times;</button>' +
        "</span>"
      );
    }).join("");

    el.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cfg  = State.getCfg();
        var keep = cfg.categories.filter(function (x) { return x !== btn.dataset.cat; });
        State.updateCfg({ categories: keep });
        renderCategories();
        Form.populateCategories();
        refreshFilterDropdown();
      });
    });
  }

  function refreshFilterDropdown() {
    var sel  = document.getElementById("filter-cat");
    var prev = sel.value;
    var cats = State.getCfg().categories;
    sel.innerHTML =
      '<option value="">All categories</option>' +
      cats.map(function (c) {
        return '<option value="' + Helpers.escapeHtml(c) + '"' + (c === prev ? " selected" : "") + ">" + Helpers.escapeHtml(c) + "</option>";
      }).join("");
  }

  function saveRates() {
    var eur = parseFloat(document.getElementById("s-eur").value);
    var gbp = parseFloat(document.getElementById("s-gbp").value);
    if (isNaN(eur) || eur <= 0 || isNaN(gbp) || gbp <= 0) {
      Helpers.announce("Enter valid rates greater than 0.", true);
      return;
    }
    State.updateCfg({ rateEUR: eur, rateGBP: gbp });
    var sum = State.getTx().reduce(function (a, t) { return a + parseFloat(t.amount); }, 0);
    document.getElementById("rate-preview").textContent =
      "Total " + Helpers.formatUSD(sum) + " = " + Helpers.formatEUR(sum) + " = " + Helpers.formatGBP(sum);
    Helpers.announce("Rates saved.");
    Dashboard.render();
  }

  return {
    load:                 load,
    renderCategories:     renderCategories,
    refreshFilterDropdown: refreshFilterDropdown,
    saveRates:            saveRates
  };
}());
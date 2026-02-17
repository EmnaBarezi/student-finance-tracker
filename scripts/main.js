(function init() {
  var SEED = [
    { id:"txn_0001", description:"Lunch at cafeteria",        amount:"12.50",  category:"Food",          date:"2025-09-25", createdAt:"2025-09-25T12:00:00Z", updatedAt:"2025-09-25T12:00:00Z" },
    { id:"txn_0002", description:"Chemistry textbook",         amount:"89.99",  category:"Books",         date:"2025-09-23", createdAt:"2025-09-23T09:30:00Z", updatedAt:"2025-09-23T09:30:00Z" },
    { id:"txn_0003", description:"Monthly bus pass",           amount:"45.00",  category:"Transport",     date:"2025-09-20", createdAt:"2025-09-20T08:00:00Z", updatedAt:"2025-09-20T08:00:00Z" },
    { id:"txn_0004", description:"Coffee with friends",        amount:"8.75",   category:"Entertainment", date:"2025-09-28", createdAt:"2025-09-28T15:00:00Z", updatedAt:"2025-09-28T15:00:00Z" },
    { id:"txn_0005", description:"Semester registration fees", amount:"320.00", category:"Fees",          date:"2025-09-01", createdAt:"2025-09-01T08:00:00Z", updatedAt:"2025-09-01T08:00:00Z" },
    { id:"txn_0006", description:"Pizza slice",                amount:"0.99",   category:"Food",          date:"2025-09-30", createdAt:"2025-09-30T20:00:00Z", updatedAt:"2025-09-30T20:00:00Z" },
    { id:"txn_0007", description:"Biology lab manual",         amount:"1500.00",category:"Books",         date:"2025-10-01", createdAt:"2025-10-01T10:00:00Z", updatedAt:"2025-10-01T10:00:00Z" },
    { id:"txn_0008", description:"Tea and biscuits",           amount:"3.20",   category:"Food",          date:"2025-10-02", createdAt:"2025-10-02T11:30:00Z", updatedAt:"2025-10-02T11:30:00Z" },
    { id:"txn_0009", description:"Movie night ticket",         amount:"15.50",  category:"Entertainment", date:"2025-10-03", createdAt:"2025-10-03T19:00:00Z", updatedAt:"2025-10-03T19:00:00Z" },
    { id:"txn_0010", description:"Stationery supplies",        amount:"22.30",  category:"Other",         date:"2025-10-04", createdAt:"2025-10-04T13:00:00Z", updatedAt:"2025-10-04T13:00:00Z" },
    { id:"txn_0011", description:"Uber ride to campus",        amount:"37.80",  category:"Transport",     date:"2025-10-05", createdAt:"2025-10-05T06:00:00Z", updatedAt:"2025-10-05T06:00:00Z" },
    { id:"txn_0012", description:"Weekly grocery shopping",    amount:"56.40",  category:"Food",          date:"2025-10-06", createdAt:"2025-10-06T17:00:00Z", updatedAt:"2025-10-06T17:00:00Z" }
  ];

  if (!State.getTx().length) { State.setTx(SEED); }
  document.getElementById("f-date").value = Helpers.today();

  document.querySelectorAll("nav button[data-page]").forEach(function (btn) {
    btn.addEventListener("click", function () { Nav.go(btn.dataset.page); });
    btn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); Nav.go(btn.dataset.page); }
    });
  });

  document.querySelectorAll("#records-table th[data-col]").forEach(function (th) {
    th.addEventListener("click", function () { Records.setSort(th.dataset.col); });
    th.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); Records.setSort(th.dataset.col); }
    });
  });

  var searchInput = document.getElementById("search-input");
  var caseCheck   = document.getElementById("case-check");
  var filterCat   = document.getElementById("filter-cat");
  var searchErr   = document.getElementById("search-error");

  function runSearch() {
    var raw = searchInput.value;
    var re  = null;
    if (raw) {
      if (!Validators.isValidRegex(raw)) {
        searchErr.textContent = "Invalid regex pattern.";
        Records.update(null, filterCat.value);
        return;
      }
      searchErr.textContent = "";
      re = Validators.compileRegex(raw, caseCheck.checked);
    } else {
      searchErr.textContent = "";
    }
    Records.update(re, filterCat.value);
  }

  searchInput.addEventListener("input",  runSearch);
  caseCheck.addEventListener("change",   runSearch);
  filterCat.addEventListener("change",   runSearch);

  document.getElementById("txn-form").addEventListener("submit",  Form.handleSubmit);
  document.getElementById("btn-cancel").addEventListener("click", Form.cancel);

  document.getElementById("modal-confirm").addEventListener("click", Records.confirmDelete);
  document.getElementById("modal-cancel").addEventListener("click",  Records.closeDeleteModal);
  document.getElementById("delete-modal").addEventListener("click", function (e) {
    if (e.target === e.currentTarget) Records.closeDeleteModal();
  });

  document.getElementById("btn-clear").addEventListener("click", function () {
    document.getElementById("clear-modal").classList.add("open");
    document.getElementById("clear-confirm").focus();
  });
  document.getElementById("clear-confirm").addEventListener("click", function () {
    State.setTx([]);
    document.getElementById("clear-modal").classList.remove("open");
    Records.render();
    Dashboard.render();
    Helpers.announce("All data cleared.", true);
  });
  document.getElementById("clear-cancel").addEventListener("click", function () {
    document.getElementById("clear-modal").classList.remove("open");
  });
  document.getElementById("clear-modal").addEventListener("click", function (e) {
    if (e.target === e.currentTarget) document.getElementById("clear-modal").classList.remove("open");
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.getElementById("delete-modal").classList.remove("open");
      document.getElementById("clear-modal").classList.remove("open");
    }
  });

  document.getElementById("btn-export").addEventListener("click", IO.exportJSON);
  document.getElementById("btn-import").addEventListener("click", function () {
    document.getElementById("import-file").click();
  });
  document.getElementById("import-file").addEventListener("change", function (e) {
    IO.importJSON(e.target.files[0]);
    e.target.value = "";
  });

  document.getElementById("btn-save-budget").addEventListener("click", function () {
    var v = parseFloat(document.getElementById("s-budget").value);
    if (isNaN(v) || v <= 0) { Helpers.announce("Enter a valid budget greater than 0.", true); return; }
    State.updateCfg({ budget: v });
    Helpers.announce("Budget cap saved.");
    Dashboard.render();
  });

  document.getElementById("btn-save-rates").addEventListener("click", SettingsUI.saveRates);

  document.getElementById("btn-add-cat").addEventListener("click", function () {
    var input = document.getElementById("new-cat-input");
    var errEl = document.getElementById("new-cat-err");
    var v     = input.value.trim();
    var err   = Validators.categoryName(v);
    if (err) { errEl.textContent = err; errEl.classList.add("visible"); return; }
    errEl.classList.remove("visible");
    var cfg = State.getCfg();
    if (cfg.categories.indexOf(v) !== -1) {
      errEl.textContent = "Category already exists.";
      errEl.classList.add("visible");
      return;
    }
    cfg.categories.push(v);
    State.updateCfg({ categories: cfg.categories });
    SettingsUI.renderCategories();
    Form.populateCategories();
    SettingsUI.refreshFilterDropdown();
    input.value = "";
    Helpers.announce("Category added: " + v);
  });

  document.getElementById("new-cat-input").addEventListener("keydown", function (e) {
    if (e.key === "Enter") { e.preventDefault(); document.getElementById("btn-add-cat").click(); }
  });

  Nav.go("dashboard");
  SettingsUI.refreshFilterDropdown();
}());
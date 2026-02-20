/* =============================================================
   main.js — Student Finance Tracker entry point
   Load order in index.html (all before this file):
     storage.js → state.js → helpers.js → validators.js →
     nav.js → dashboard.js → records.js → form.js →
     settings.js → io.js → main.js
   ============================================================= */

(function () {
  'use strict';

  // ── Boot ────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    bindNav();
    bindSearch();
    bindForm();
    bindRecordsTable();
    bindDeleteModal();
    bindClearData();
    bindSettings();
    bindIO();

    // Land on dashboard by default
    Nav.go('dashboard');
  });

  // ── Navigation ───────────────────────────────────────────────
  function bindNav() {
    document.querySelectorAll('nav button[data-page]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        Nav.go(btn.dataset.page);
      });
    });
  }

  // ── Regex Search & Category Filter (Records page) ────────────
  function bindSearch() {
    var searchInput  = document.getElementById('search-input');
    var caseToggle   = document.getElementById('search-case');
    var filterCat    = document.getElementById('filter-cat');
    var regexStatus  = document.getElementById('regex-status'); // optional el

    function applySearch() {
      var raw  = searchInput ? searchInput.value : '';
      var cs   = caseToggle  ? caseToggle.checked : false;
      var cat  = filterCat   ? filterCat.value    : '';
      var re   = null;

      if (raw) {
        if (!Validators.isValidRegex(raw)) {
          if (regexStatus) regexStatus.textContent = 'Invalid regex.';
          return;
        }
        re = Validators.compileRegex(raw, cs);
      }

      if (regexStatus) regexStatus.textContent = re ? 'Regex active.' : '';
      Records.update(re, cat);
    }

    if (searchInput) searchInput.addEventListener('input', applySearch);
    if (caseToggle)  caseToggle.addEventListener('change', applySearch);
    if (filterCat)   filterCat.addEventListener('change', applySearch);
  }

  // ── Add / Edit Form ──────────────────────────────────────────
  function bindForm() {
    var form      = document.getElementById('txn-form');
    var btnCancel = document.getElementById('btn-cancel');

    if (form)      form.addEventListener('submit', Form.handleSubmit);
    if (btnCancel) btnCancel.addEventListener('click', Form.cancel);

    // Set today's date as default on page load
    var dateInput = document.getElementById('f-date');
    if (dateInput && !dateInput.value) dateInput.value = Helpers.today();
  }

  // ── Records Table — sortable column headers ──────────────────
  function bindRecordsTable() {
    document.querySelectorAll('#records-table th[data-col]').forEach(function (th) {
      th.addEventListener('click', function () {
        Records.setSort(th.dataset.col);
      });
      // Keyboard support
      th.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          Records.setSort(th.dataset.col);
        }
      });
    });
  }

  // ── Delete Confirmation Modal ────────────────────────────────
  function bindDeleteModal() {
    var btnConfirm = document.getElementById('modal-confirm');
    var btnClose   = document.getElementById('modal-close');
    var overlay    = document.getElementById('delete-modal');

    if (btnConfirm) btnConfirm.addEventListener('click', Records.confirmDelete);
    if (btnClose)   btnClose.addEventListener('click',   Records.closeDeleteModal);

    // Close on backdrop click
    if (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) Records.closeDeleteModal();
      });
    }

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') Records.closeDeleteModal();
    });
  }

  // ── Clear All Data (Danger Zone) ─────────────────────────────
  function bindClearData() {
    var btnClear      = document.getElementById('btn-clear-all');
    var clearModal    = document.getElementById('clear-modal');
    var btnClearOk    = document.getElementById('clear-confirm');
    var btnClearClose = document.getElementById('clear-close');

    if (btnClear) {
      btnClear.addEventListener('click', function () {
        if (clearModal) clearModal.classList.add('open');
        if (btnClearOk) btnClearOk.focus();
      });
    }

    function closeModal() {
      if (clearModal) clearModal.classList.remove('open');
    }

    if (btnClearOk) {
      btnClearOk.addEventListener('click', function () {
        State.setTx([]);
        closeModal();
        Records.render();
        Dashboard.render();
        Helpers.announce('All data cleared.');
      });
    }

    if (btnClearClose) btnClearClose.addEventListener('click', closeModal);

    if (clearModal) {
      clearModal.addEventListener('click', function (e) {
        if (e.target === clearModal) closeModal();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  // ── Settings ─────────────────────────────────────────────────
  function bindSettings() {
    // Budget save
    var btnBudget = document.getElementById('btn-save-budget');
    if (btnBudget) {
      btnBudget.addEventListener('click', function () {
        var val = parseFloat(document.getElementById('s-budget').value);
        if (isNaN(val) || val <= 0) {
          Helpers.announce('Enter a valid budget greater than 0.', true);
          return;
        }
        State.updateCfg({ budget: val });
        Dashboard.render();
        Helpers.announce('Budget saved.');
      });
    }

    // Currency rates save
    var btnRates = document.getElementById('btn-save-rates');
    if (btnRates) btnRates.addEventListener('click', SettingsUI.saveRates);

    // Add category
    var btnAddCat  = document.getElementById('btn-add-cat');
    var catInput   = document.getElementById('new-cat');

    if (btnAddCat) {
      btnAddCat.addEventListener('click', function () {
        addCategory();
      });
    }
    if (catInput) {
      catInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); addCategory(); }
      });
    }

    function addCategory() {
      var val = catInput ? catInput.value.trim() : '';
      var err = Validators.categoryName(val);
      if (err) { Helpers.announce(err, true); return; }

      var cfg  = State.getCfg();
      var dupl = cfg.categories.some(function (c) {
        return c.toLowerCase() === val.toLowerCase();
      });
      if (dupl) { Helpers.announce('Category already exists.', true); return; }

      State.updateCfg({ categories: cfg.categories.concat([val]) });
      if (catInput) catInput.value = '';
      SettingsUI.renderCategories();
      Form.populateCategories();
      SettingsUI.refreshFilterDropdown();
      Helpers.announce('Category "' + val + '" added.');
    }
  }

  // ── Export / Import ──────────────────────────────────────────
  function bindIO() {
    var btnExport  = document.getElementById('btn-export');
    var btnImport  = document.getElementById('btn-import');
    var fileInput  = document.getElementById('import-file');

    if (btnExport) btnExport.addEventListener('click', IO.exportJSON);

    if (btnImport) {
      btnImport.addEventListener('click', function () {
        if (fileInput) fileInput.click();
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', function () {
        IO.importJSON(fileInput.files[0]);
        fileInput.value = ''; // reset so same file can be re-imported
      });
    }
  }

}());
var Records = (function () {
  var _sortCol        = "date";
  var _sortDir        = -1;
  var _editingId      = null;
  var _pendingDelId   = null;
  var _activeRegex    = null;
  var _activeCat      = "";

  function getFiltered() {
    var tx = State.getTx();
    if (_activeCat) {
      tx = tx.filter(function (t) { return t.category === _activeCat; });
    }
    if (_activeRegex) {
      tx = tx.filter(function (t) {
        return _activeRegex.test(t.description) || _activeRegex.test(t.category);
      });
    }
    tx.sort(function (a, b) {
      var av = a[_sortCol];
      var bv = b[_sortCol];
      if (_sortCol === "amount") { av = parseFloat(av); bv = parseFloat(bv); }
      if (av < bv) return -_sortDir;
      if (av > bv) return  _sortDir;
      return 0;
    });
    return tx;
  }

  function render() {
    var tx    = getFiltered();
    var tbody = document.getElementById("records-body");
    var count = document.getElementById("record-count");

    document.querySelectorAll("#records-table th[data-col]").forEach(function (th) {
      th.classList.remove("sorted");
      var ind = th.querySelector(".sort-ind");
      if (ind) ind.textContent = "--";
      if (th.dataset.col === _sortCol) {
        th.classList.add("sorted");
        if (ind) ind.textContent = _sortDir === 1 ? "asc" : "desc";
      }
    });

    if (!tx.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="5">No transactions found.</td></tr>';
      count.textContent = "0 records";
      return;
    }

    tbody.innerHTML = tx.map(buildRow).join("");
    count.textContent = tx.length + " record" + (tx.length !== 1 ? "s" : "");

    tbody.querySelectorAll("[data-action='edit']").forEach(function (btn) {
      btn.addEventListener("click", function () { startEdit(btn.dataset.id); });
    });
    tbody.querySelectorAll("[data-action='delete']").forEach(function (btn) {
      btn.addEventListener("click", function () { openDeleteModal(btn.dataset.id); });
    });
    tbody.querySelectorAll("[data-action='save']").forEach(function (btn) {
      btn.addEventListener("click", function () { saveInlineEdit(btn.dataset.id); });
    });
    tbody.querySelectorAll("[data-action='cancel']").forEach(function (btn) {
      btn.addEventListener("click", function () { _editingId = null; render(); });
    });
  }

  function buildRow(t) {
    var editing = t.id === _editingId;
    var esc     = Helpers.escapeHtml;
    var cats    = State.getCfg().categories;
    var catOpts = cats.map(function (c) {
      return '<option value="' + esc(c) + '"' + (c === t.category ? " selected" : "") + ">" + esc(c) + "</option>";
    }).join("");

    var descCell = editing
      ? '<input class="edit-input" data-field="description" value="' + esc(t.description) + '" aria-label="Edit description" />'
      : Helpers.highlight(t.description, _activeRegex);

    var amtCell = editing
      ? '<input class="edit-input" data-field="amount" value="' + t.amount + '" style="max-width:80px" aria-label="Edit amount" />'
      : Helpers.formatUSD(parseFloat(t.amount));

    var dateCell = editing
      ? '<input class="edit-input" data-field="date" value="' + t.date + '" style="max-width:100px" aria-label="Edit date" />'
      : t.date;

    var catCell = editing
      ? '<select class="edit-input" data-field="category" aria-label="Edit category">' + catOpts + "</select>"
      : '<span class="badge ' + Helpers.badgeClass(t.category) + '">' + esc(t.category) + "</span>";

    var actions = editing
      ? '<button class="btn btn-primary btn-sm" data-action="save" data-id="' + t.id + '" aria-label="Save edits">Save</button> ' +
        '<button class="btn btn-secondary btn-sm" data-action="cancel" data-id="' + t.id + '" aria-label="Cancel edit">Cancel</button>'
      : '<button class="btn btn-secondary btn-sm" data-action="edit" data-id="' + t.id + '" aria-label="Edit ' + esc(t.description) + '">Edit</button> ' +
        '<button class="btn btn-danger btn-sm" data-action="delete" data-id="' + t.id + '" aria-label="Delete ' + esc(t.description) + '">Delete</button>';

    return (
      "<tr>" +
      '<td data-label="Description">' + descCell + "</td>" +
      '<td data-label="Amount">' + amtCell + "</td>" +
      '<td data-label="Category">' + catCell + "</td>" +
      '<td data-label="Date">' + dateCell + "</td>" +
      '<td class="actions-cell">' + actions + "</td>" +
      "</tr>"
    );
  }

  function startEdit(id) { _editingId = id; render(); }

  function saveInlineEdit(id) {
    var btn = document.querySelector('[data-action="save"][data-id="' + id + '"]');
    if (!btn) return;
    var tr  = btn.closest("tr");
    var get = function (f) {
      var el = tr.querySelector('[data-field="' + f + '"]');
      return el ? el.value.trim() : "";
    };

    var d  = get("description");
    var a  = get("amount");
    var dt = get("date");
    var c  = get("category");

    var err = Validators.description(d) || Validators.amount(a) || Validators.date(dt);
    if (err) { Helpers.announce(err, true); return; }

    var old = State.getTx().find(function (x) { return x.id === id; });
    State.updateTx(Object.assign({}, old, {
      description: d,
      amount:      parseFloat(a).toFixed(2),
      date:        dt,
      category:    c,
      updatedAt:   new Date().toISOString()
    }));
    _editingId = null;
    render();
    Dashboard.render();
    Helpers.announce("Transaction updated.");
  }

  function openDeleteModal(id) {
    _pendingDelId = id;
    document.getElementById("delete-modal").classList.add("open");
    document.getElementById("modal-confirm").focus();
  }

  function confirmDelete() {
    if (!_pendingDelId) return;
    State.deleteTx(_pendingDelId);
    _pendingDelId = null;
    document.getElementById("delete-modal").classList.remove("open");
    render();
    Dashboard.render();
    Helpers.announce("Transaction deleted.");
  }

  function closeDeleteModal() {
    _pendingDelId = null;
    document.getElementById("delete-modal").classList.remove("open");
  }

  function setSort(col) {
    if (_sortCol === col) { _sortDir *= -1; }
    else { _sortCol = col; _sortDir = -1; }
    render();
  }

  function update(re, cat) {
    _activeRegex = re;
    _activeCat   = cat;
    render();
  }

  return {
    render:          render,
    update:          update,
    setSort:         setSort,
    confirmDelete:   confirmDelete,
    closeDeleteModal: closeDeleteModal
  };
}());
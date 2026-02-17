var Form = (function () {
  var _editId = null;

  function populateCategories() {
    var sel  = document.getElementById("f-cat");
    var cats = State.getCfg().categories;
    sel.innerHTML = cats.map(function (c) {
      return '<option value="' + Helpers.escapeHtml(c) + '">' + Helpers.escapeHtml(c) + "</option>";
    }).join("");
  }

  function setFieldError(fieldId, msg) {
    var el = document.getElementById(fieldId);
    if (!el) return;
    el.textContent = msg || "";
    el.classList.toggle("visible", !!msg);
    var input = el.previousElementSibling;
    if (input && input.tagName !== "SPAN") {
      input.setAttribute("aria-invalid", msg ? "true" : "false");
    }
  }

  function clearErrors() {
    ["f-desc-err", "f-amount-err", "f-date-err", "f-cat-err"].forEach(function (id) {
      setFieldError(id, "");
    });
  }

  function validate() {
    var d  = document.getElementById("f-desc").value;
    var a  = document.getElementById("f-amount").value.trim();
    var dt = document.getElementById("f-date").value.trim();
    var c  = document.getElementById("f-cat").value;

    var ok = true;
    var e1 = Validators.description(d);
    var e2 = Validators.amount(a);
    var e3 = Validators.date(dt);
    var e4 = Validators.category(c);

    if (e1) { setFieldError("f-desc-err",   e1); ok = false; }
    if (e2) { setFieldError("f-amount-err", e2); ok = false; }
    if (e3) { setFieldError("f-date-err",   e3); ok = false; }
    if (e4) { setFieldError("f-cat-err",    e4); ok = false; }
    return ok;
  }

  function handleSubmit(e) {
    e.preventDefault();
    clearErrors();
    if (!validate()) return;

    var now  = new Date().toISOString();
    var desc = document.getElementById("f-desc").value.replace(/\s+/g, " ").trim();
    var amt  = parseFloat(document.getElementById("f-amount").value).toFixed(2);
    var dt   = document.getElementById("f-date").value.trim();
    var cat  = document.getElementById("f-cat").value;

    if (_editId) {
      var old = State.getTx().find(function (x) { return x.id === _editId; });
      State.updateTx(Object.assign({}, old, {
        description: desc, amount: amt, date: dt, category: cat, updatedAt: now
      }));
      resetEditMode();
      showStatus("Transaction updated.", "success");
      Helpers.announce("Transaction updated.");
    } else {
      State.addTx({
        id:          State.genId(),
        description: desc,
        amount:      amt,
        category:    cat,
        date:        dt,
        createdAt:   now,
        updatedAt:   now
      });
      showStatus("Transaction saved.", "success");
      Helpers.announce("Transaction saved.");
    }

    document.getElementById("txn-form").reset();
    document.getElementById("f-date").value = Helpers.today();
    clearErrors();
    Records.render();
    Dashboard.render();
  }

  function loadForEdit(id) {
    var t = State.getTx().find(function (x) { return x.id === id; });
    if (!t) return;
    _editId = id;
    populateCategories();
    document.getElementById("f-desc").value   = t.description;
    document.getElementById("f-amount").value = t.amount;
    document.getElementById("f-date").value   = t.date;
    document.getElementById("f-cat").value    = t.category;
    document.getElementById("add-h").textContent          = "Edit Transaction";
    document.getElementById("btn-submit").textContent     = "Update";
    document.getElementById("btn-cancel").style.display   = "";
    Nav.go("add");
  }

  function cancel() {
    resetEditMode();
    document.getElementById("txn-form").reset();
    document.getElementById("f-date").value = Helpers.today();
    clearErrors();
  }

  function resetEditMode() {
    _editId = null;
    document.getElementById("add-h").textContent        = "Add Transaction";
    document.getElementById("btn-submit").textContent   = "Save";
    document.getElementById("btn-cancel").style.display = "none";
  }

  function showStatus(msg, type) {
    var el = document.getElementById("form-status");
    el.textContent = msg;
    el.className   = "status-msg visible " + (type || "success");
    setTimeout(function () { el.className = "status-msg"; }, 3000);
  }

  return {
    populateCategories: populateCategories,
    handleSubmit:       handleSubmit,
    loadForEdit:        loadForEdit,
    cancel:             cancel
  };
}());
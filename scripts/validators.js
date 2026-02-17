var Validators = (function () {
  var rDesc    = /^\S(?:.*\S)?$|^\S$/;
  var rDupWord = /\b(\w+)\s+\1\b/i;
  var rAmount  = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
  var rDate    = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  var rCatName = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

  function description(v) {
    if (!v || !v.trim()) return "Description is required.";
    if (!rDesc.test(v))  return "No leading or trailing spaces.";
    if (rDupWord.test(v)) return "Duplicate consecutive words detected.";
    return null;
  }

  function amount(v) {
    if (!v) return "Amount is required.";
    if (!rAmount.test(v.trim())) return "Enter a valid number e.g. 12.50";
    if (parseFloat(v) <= 0) return "Amount must be greater than 0.";
    return null;
  }

  function date(v) {
    if (!v) return "Date is required.";
    if (!rDate.test(v)) return "Use YYYY-MM-DD format e.g. 2025-09-25";
    return null;
  }

  function category(v) {
    return v ? null : "Please select a category.";
  }

  function categoryName(v) {
    if (!v) return "Name is required.";
    if (!rCatName.test(v)) return "Letters, single spaces, or hyphens only.";
    return null;
  }

  function compileRegex(str, caseSensitive) {
    try {
      return str ? new RegExp(str, caseSensitive ? "g" : "gi") : null;
    } catch (e) {
      return null;
    }
  }

  function isValidRegex(str) {
    try { new RegExp(str); return true; }
    catch (e) { return false; }
  }

  return {
    description:   description,
    amount:        amount,
    date:          date,
    category:      category,
    categoryName:  categoryName,
    compileRegex:  compileRegex,
    isValidRegex:  isValidRegex
  };
}());
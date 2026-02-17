var Nav = (function () {
  var PAGES = ["about", "dashboard", "records", "add", "settings"];

  function go(page) {
    PAGES.forEach(function (p) {
      var sec = document.getElementById("page-" + p);
      var btn = document.querySelector('nav button[data-page="' + p + '"]');
      if (sec) sec.classList.toggle("active", p === page);
      if (btn) {
        btn.classList.toggle("active", p === page);
        btn.setAttribute("aria-current", p === page ? "page" : "false");
      }
    });

    var main = document.getElementById("main");
    if (main) main.focus();

    if (page === "dashboard") Dashboard.render();
    if (page === "records")   { Records.render(); SettingsUI.refreshFilterDropdown(); }
    if (page === "add")       Form.populateCategories();
    if (page === "settings")  SettingsUI.load();
  }

  return { go: go };
}());
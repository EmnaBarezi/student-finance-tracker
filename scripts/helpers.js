var Helpers = (function () {
  function formatUSD(n) { return "$" + n.toFixed(2); }
  function formatEUR(n) { return "\u20ac" + (n * State.getCfg().rateEUR).toFixed(2); }
  function formatGBP(n) { return "\u00a3" + (n * State.getCfg().rateGBP).toFixed(2); }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function highlight(text, re) {
    if (!re) return escapeHtml(text);
    return escapeHtml(text).replace(re, function (m) {
      return "<mark>" + m + "</mark>";
    });
  }

  function badgeClass(cat) {
    var map = {
      food:          "badge-food",
      books:         "badge-books",
      transport:     "badge-transport",
      entertainment: "badge-entertainment",
      fees:          "badge-fees",
      other:         "badge-other"
    };
    return map[(cat || "").toLowerCase()] || "badge-other";
  }

  function announce(msg, assertive) {
    var el = document.getElementById(assertive ? "live-assertive" : "live-polite");
    el.textContent = "";
    requestAnimationFrame(function () { el.textContent = msg; });
  }

  return {
    formatUSD:  formatUSD,
    formatEUR:  formatEUR,
    formatGBP:  formatGBP,
    today:      today,
    escapeHtml: escapeHtml,
    highlight:  highlight,
    badgeClass: badgeClass,
    announce:   announce
  };
}());
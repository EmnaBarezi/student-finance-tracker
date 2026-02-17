var Dashboard = (function () {

  function render() {
    var tx  = State.getTx();
    var cfg = State.getCfg();
    var total = tx.reduce(function (a, t) { return a + parseFloat(t.amount); }, 0);
    var avg   = tx.length ? total / tx.length : 0;

    var catCount = {};
    tx.forEach(function (t) { catCount[t.category] = (catCount[t.category] || 0) + 1; });
    var topCat = Object.keys(catCount).sort(function (a, b) {
      return catCount[b] - catCount[a];
    })[0] || "--";

    document.getElementById("stat-count").textContent = tx.length;
    document.getElementById("stat-total").textContent = Helpers.formatUSD(total);
    document.getElementById("stat-avg").textContent   = Helpers.formatUSD(avg);
    document.getElementById("stat-top").textContent   = topCat;

    renderBudget(tx, cfg);
    renderChart(tx);
    renderCategoryBreakdown(tx);
  }

  function renderBudget(tx, cfg) {
    var now   = new Date();
    var month = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
    var spent = tx
      .filter(function (t) { return t.date.slice(0, 7) === month; })
      .reduce(function (a, t) { return a + parseFloat(t.amount); }, 0);

    var cap = cfg.budget || 500;
    var pct = Math.min((spent / cap) * 100, 100);

    document.getElementById("cap-display").textContent = Helpers.formatUSD(cap);
    document.getElementById("cap-spent").textContent   = Helpers.formatUSD(spent);
    document.getElementById("cap-bar").setAttribute("aria-valuenow", Math.round(pct));

    var fill = document.getElementById("cap-fill");
    fill.style.width = pct + "%";
    fill.className   = "budget-bar-fill" + (pct >= 100 ? " over" : pct >= 80 ? " warn" : "");

    var statusEl  = document.getElementById("cap-status");
    var remaining = cap - spent;

    if (spent > cap) {
      statusEl.textContent = "Over budget by " + Helpers.formatUSD(Math.abs(remaining)) + ".";
      statusEl.style.color = "var(--danger)";
      Helpers.announce("Warning: over budget by " + Helpers.formatUSD(Math.abs(remaining)) + ".", true);
    } else {
      statusEl.textContent = Helpers.formatUSD(remaining) + " remaining this month.";
      statusEl.style.color = pct >= 80 ? "#7a5500" : "var(--success)";
      if (pct >= 80) {
        Helpers.announce("Budget at " + Math.round(pct) + "%. " + Helpers.formatUSD(remaining) + " remaining.");
      }
    }
  }

  function renderChart(tx) {
    var el   = document.getElementById("week-chart");
    el.innerHTML = "";

    var days = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }

    var totals = days.map(function (day) {
      return tx
        .filter(function (t) { return t.date === day; })
        .reduce(function (a, t) { return a + parseFloat(t.amount); }, 0);
    });

    var max = Math.max.apply(null, totals.concat([1]));

    days.forEach(function (day, i) {
      var col = document.createElement("div");
      col.className = "chart-col";

      var isWeekend = new Date(day + "T12:00:00").getDay() % 6 === 0;

      var bar = document.createElement("div");
      bar.className = "chart-bar" + (isWeekend ? " alt" : "");
      bar.style.height = ((totals[i] / max) * 70 || 2) + "px";
      bar.title = day + ": " + Helpers.formatUSD(totals[i]);
      bar.setAttribute("aria-label", day + ": " + Helpers.formatUSD(totals[i]));

      var lbl = document.createElement("div");
      lbl.className   = "chart-day";
      lbl.textContent = day.slice(5);

      col.appendChild(bar);
      col.appendChild(lbl);
      el.appendChild(col);
    });
  }

  function renderCategoryBreakdown(tx) {
    var el       = document.getElementById("cat-breakdown");
    var catTotals = {};
    tx.forEach(function (t) {
      catTotals[t.category] = (catTotals[t.category] || 0) + parseFloat(t.amount);
    });
    var sum = Object.values(catTotals).reduce(function (a, v) { return a + v; }, 0) || 1;

    el.innerHTML = Object.keys(catTotals)
      .sort(function (a, b) { return catTotals[b] - catTotals[a]; })
      .map(function (cat) {
        var pct = ((catTotals[cat] / sum) * 100).toFixed(0);
        return (
          '<span class="badge ' + Helpers.badgeClass(cat) + '" style="padding:4px 10px;font-size:.8rem">' +
          Helpers.escapeHtml(cat) + ": " + Helpers.formatUSD(catTotals[cat]) + " (" + pct + "%)</span>"
        );
      })
      .join(" ");
  }

  return { render: render };
}());
var Storage = (function () {
  var TX_KEY  = "sft:transactions";
  var CFG_KEY = "sft:config";

  function loadTx() {
    try { return JSON.parse(localStorage.getItem(TX_KEY) || "[]"); }
    catch (e) { return []; }
  }
  function saveTx(data) {
    localStorage.setItem(TX_KEY, JSON.stringify(data));
  }
  function loadCfg() {
    try { return JSON.parse(localStorage.getItem(CFG_KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function saveCfg(cfg) {
    localStorage.setItem(CFG_KEY, JSON.stringify(cfg));
  }

  return { loadTx: loadTx, saveTx: saveTx, loadCfg: loadCfg, saveCfg: saveCfg };
}());
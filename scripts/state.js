var State = (function () {
  var DEFAULT_CFG = {
    budget:     500,
    rateEUR:    0.92,
    rateGBP:    0.79,
    categories: ["Food", "Books", "Transport", "Entertainment", "Fees", "Other"]
  };

  var _tx  = Storage.loadTx();
  var _cfg = Object.assign({}, DEFAULT_CFG, Storage.loadCfg());

  function getTx()  { return _tx.slice(); }
  function getCfg() { return Object.assign({}, _cfg); }

  function addTx(record) {
    _tx.unshift(record);
    Storage.saveTx(_tx);
  }
  function updateTx(record) {
    _tx = _tx.map(function (x) { return x.id === record.id ? record : x; });
    Storage.saveTx(_tx);
  }
  function deleteTx(id) {
    _tx = _tx.filter(function (x) { return x.id !== id; });
    Storage.saveTx(_tx);
  }
  function setTx(arr) {
    _tx = arr;
    Storage.saveTx(_tx);
  }
  function updateCfg(patch) {
    _cfg = Object.assign(_cfg, patch);
    Storage.saveCfg(_cfg);
  }
  function genId() {
    return "txn_" + String(_tx.length + 1).padStart(4, "0") + "_" + Date.now().toString(36);
  }

  return {
    getTx:     getTx,
    getCfg:    getCfg,
    addTx:     addTx,
    updateTx:  updateTx,
    deleteTx:  deleteTx,
    setTx:     setTx,
    updateCfg: updateCfg,
    genId:     genId
  };
}());
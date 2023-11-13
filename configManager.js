const Store = require('electron-store');
const store = new Store();

const getConfig = (key) => {
  return store.get(key);
};

const setConfig = (key, value) => {
  store.set(key, value);
};

const deleteConfig = (key) => {
  store.delete(key);
};

module.exports = {
  getConfig,
  setConfig,
  deleteConfig,
};
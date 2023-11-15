// const Store = require('electron-store');
import Store from 'electron-store'
const store = new Store()

const getConfig = (key) => {
  return store.get(key)
}

const setConfig = (key, value) => {
  store.set(key, value)
}

const deleteConfig = (key) => {
  store.delete(key)
}

export default {
  getConfig,
  setConfig,
  deleteConfig
}

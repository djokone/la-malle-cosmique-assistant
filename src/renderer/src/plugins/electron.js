
export default {
  install: (app) => {
    app.config.globalProperties.$electron = window.electron
  }
};
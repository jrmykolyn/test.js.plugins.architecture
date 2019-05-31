class AbstractPlugin {
  static get DEPENDENCIES() {
    return [];
  }

  resolveSettings(options = {}, defaults = {}) {
    return Object.assign({}, defaults, options);
  }
}

module.exports = AbstractPlugin;

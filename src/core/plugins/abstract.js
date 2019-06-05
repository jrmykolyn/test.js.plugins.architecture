class AbstractPlugin {
  static get DEPENDENCIES() {
    return [];
  }

  static get DEFAULTS() {
    return {};
  }

  constructor(core, opts = {}) {
    this.core = core;
    this.settings = this.resolveSettings(opts, AbstractPlugin.DEFAULTS);
  }

  resolveSettings(options = {}, defaults = {}) {
    return Object.assign({}, defaults, options);
  }
}

module.exports = AbstractPlugin;

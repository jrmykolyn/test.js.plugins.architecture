/**
 * The `AbstractPlugin` class provides the foundation for all plugin-type
 * classes. This class defines default values for a series of class and
 * instance properties, exposes common/shared methods, and specifies default
 * instantiation behaviour via the constructor method.
 */
class AbstractPlugin {
 get DEPENDENCIES() {
    return [];
  }

 get OPTIONAL() {
    return [];
  }

 get DEFAULTS() {
    return {};
  }

  constructor(core, opts = {}) {
    this.core = core;
    this.settings = this.resolveSettings(opts, this.DEFAULTS);
  }

  init(deps = {}) {
    this.deps = deps;
  }

  afterInit() {
    // no-op
  }

  resolveSettings(options = {}, defaults = {}) {
    return Object.assign({}, defaults, options);
  }
}

module.exports = AbstractPlugin;

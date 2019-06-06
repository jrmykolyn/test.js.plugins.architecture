const { PluginTypes } = require('./utils');

/**
 * The Core class is responsible for instantiating plugins,
 * facilitating communication between them, and wrapping select
 * plugin methods such that they may be accessed by sibling
 * plugins.
 */
class Core {
  /**
   * Core exposes a series of static getter properties. The `ORDER`
   * property returns an array of plugin types, which is used to
   * ensure that the plugins are instantiated in the correct order.
   */
  static get ORDER() {
    return [
      PluginTypes.FILTER,
      PluginTypes.DATA_SOURCE,
      PluginTypes.EVENTS,
      PluginTypes.CACHE,
    ];
  }

  /**
   * At instantiation time, Core is provided with an options object
   * that contains all of the data and configuration options that
   * are required for the current session.
   */
  constructor(opts = {}) {
    const { modules = [] } = opts;

    /**
     * The primary role of the constructor function is to instantiate any
     * plugins received via the options object. Core delegates this responsibility
     * to the `instantiateModules()` method, which receives an array of
     * modules as its sole argument. This method returns an array of module
     * instances, which are stored as the `modules` instance property.
     */
    this.modules = this.instantiateModules(modules);

    /**
     * Additionally, the Core instance is responsible for facilitating
     * communication between modules, including the `DATA_SOURCE` and
     * `EVENTS`modules.
     *
     * `DATA_SOURCE` plugins expose a `register()` method, which returns
     * an array of objects, each of which contains an event to 'listen'
     * on, an event to 'emit' on, and a callback to invoke when the former
     * event is 'heard'.
     *
     * `EVENTS` plugins also expose a `register()` method. This method
     * accepts the data returned by the `DATA_SOURCE` plugins' `register()`,
     * and registers a environment-specific event listeners.
     */
    const [eventsModule] = this.getModulesByType(PluginTypes.EVENTS);
    const dataSourceModules = this.getModulesByType(PluginTypes.DATA_SOURCE);
    dataSourceModules.forEach((moduleInstance) => {
      moduleInstance.register().forEach(({ listenOn, emitOn, callback }) => {
        eventsModule.register(listenOn, emitOn, callback);
      });
    });
  }

  /**
   * The `*Cache()` methods are thin wrappers around a `CACHE`-type plugin,
   * each of which checks for the presence of a `CACHE` plugin before
   * invoking the corresponding method.
   */
  hasCache(key) {
    const [cache] = this.getModulesByType(PluginTypes.CACHE);
    if (cache) return cache.has(key);
  }

  getCache(key) {
    const [cache] = this.getModulesByType(PluginTypes.CACHE);
    if (cache) return cache.get(key);
  }

  putCache(key, value) {
    const [cache] = this.getModulesByType(PluginTypes.CACHE);
    if (cache) return cache.put(key, value);
  }

  /**
   * The `applyFilters()` method is responsible for transforming event-related
   * payloads before they are provided as arguments to the corresponding callback
   * functions.
   *
   * In cases where the Core instance contains one or more `FILTER`-type plugins,
   * each plugin's `filter()` method will be invoked with the payload data as its
   * sole argument. In these cases, the `FILTER`-type plugins will be applied in
   * the same order that they were provided at Core instantiation time.
   *
   * If the Core instance does not include any `FILTER`-type plugins, the event
   * payload will not be modified.
   */
  applyFilters(listenOn, emitOn, data) {
    const filters = this.getModulesByType(PluginTypes.FILTER);
    const payload = { listenOn, emitOn, data };
    return filters.length
      ? filters.reduce((acc, filter) => {
        return acc.done ? acc : filter.filter(acc)
      }, payload)
      : payload;
  }

  /**
   * The `instantiateModules()` method is responsible for instantiating each
   * plugin received by Core via the options object. In order to resolve
   * dependencies, plugin classes are sorted prior to instantiation.
   *
   * This method also defines an array of plugin types, which are extracted
   * from the plugin classes themselves. This array is passed to the underlying
   * `instantiateModule()` method.
   */
  instantiateModules(modules) {
    const moduleTypes = this.getModuleTypes(modules);
    return this.sortModulesByType(modules).map((module) => {
      return this.instantiateModule(module, moduleTypes);
    });
  }

  /** The `instantiateModule()` method is responsible for instantiating a
   * single plugin, which it receives alongside an array of valid plugin types.
   */
  instantiateModule(module, types = []) {
    const isArr = Array.isArray(module);
    const mod = isArr ? module[0] : module;
    const modOpts = isArr ? module[1] : undefined;

    const deps = mod.DEPENDENCIES;

    const missing = deps.filter((dep) => types.length && types.indexOf(dep) === -1);
    if (missing.length) throw new Error(`Missing the following dependencies: ${missing.join('; ')}`);

    return new mod(this, modOpts);
  }

  /**
   * The `getModuleTypes()` utility method extracts the plugin type from each plugin
   * provided via the `modules` array.
   */
  getModuleTypes(modules) {
    return modules.map((module) => module.TYPE).filter((type, i, arr) => i === arr.indexOf(type));
  }

  /**
   * The `getModulesByType()` utility method returns all plugins that have been instantiated,
   * and which match the type provided.
   */
  getModulesByType(type) {
    return this.modules.filter((module) => module.constructor.TYPE === type);
  }

  /**
   * The `sortModulesByType()` utility method returns an array of plugins sorted by type.
   * The sorting criteria is defined by the `ORDER` property of the Core class.
   */
  sortModulesByType(modules) {
    return modules.slice(0).sort((a, b) => {
      // TODO: Refactor.
      const aIndex = Core.ORDER.indexOf(a.TYPE);
      const bIndex = Core.ORDER.indexOf(b.TYPE);
      return aIndex - bIndex;
    });
  }
}

module.exports = Core;

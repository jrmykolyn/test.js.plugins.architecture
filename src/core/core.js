const { PluginTypes } = require('./utils');

/**
 * The Core class is responsible for instantiating plugins,
 * facilitating communication between them, and wrapping select
 * plugin methods such that they may be accessed by sibling
 * plugins.
 */
class Core {
  /**
   * At instantiation time, Core is provided with an options object
   * that contains all of the data and configuration options that
   * are required for the current session.
   */
  constructor(opts = {}) {
    const { plugins = [] } = opts;

    /**
     * The primary role of the constructor function is to instantiate any
     * plugins received via the options object. Core delegates this responsibility
     * to the `instantiatePlugins()` method, which receives an array of
     * plugins as its sole argument. This method returns an array of plugin
     * instances, which are stored as the `plugins` instance property.
     */
    this.plugins = this.instantiatePlugins(plugins);

    /**
     * // TODO
     */
    this.initializePlugins(this.plugins);

    /**
     * // TODO
     */
    this.setupPlugins(this.plugins);
  }

  /**
   * The `instantiatePlugins()` method is responsible for instantiating each
   * plugin received by Core via the options object.
   *
   * This method also defines an array of plugin types, which are extracted
   * from the plugin classes themselves. This array is passed to the underlying
   * `instantiatePlugin()` method.
   */
  instantiatePlugins(plugins) {
    const pluginTypes = this.getPluginTypes(plugins);
    return plugins.map((plugin) => {
      return this.instantiatePlugin(plugin, pluginTypes);
    });
  }

  /** The `instantiatePlugin()` method is responsible for instantiating a
   * single plugin, which it receives alongside an array of valid plugin types.
   */
  instantiatePlugin(plugin, types = []) {
    const mod = this.extractPlugin(plugin);
    const modOpts = this.extractPluginOpts(plugin);
    return new mod(this, modOpts);
  }

  initializePlugins(plugins) {
    plugins.forEach((plugin) => this.initializePlugin(plugin));
    return plugins;
  }

  initializePlugin(plugin) {
    const types = this.plugins.map((plugin) => plugin.TYPE);
    const missing = plugin.DEPENDENCIES.filter(({ type }) => types.length && types.indexOf(type) === -1);
    if (missing.length) throw new Error(`Missing the following dependencies: ${missing.join('; ')}`);

    const deps = [...plugin.DEPENDENCIES, ...plugin.OPTIONAL]
        .map((depDesc) => ({
          ...depDesc,
          dep: this.plugins.find((el) => el.TYPE === depDesc.type) || this.mockPlugin(depDesc.key)
        }))
        .reduce((acc, { key, dep }) => ({ ...acc, [key]: dep}), {});

    plugin.init(deps);
    return plugin;
  }

  mockPlugin(key) {
    const fn = () => console.warn(`Whoops, the following plugin does not exist:`, key);
    return new Proxy({}, {
      get(target, name) {
        // TODO: Print `key`.
        return fn;
      }
    })
  }

  setupPlugins(plugins) {
    plugins.forEach((plugin) => this.setupPlugin(plugin));
    return plugins;
  }

  setupPlugin(plugin) {
    plugin.afterInit();
    return plugin;
  }

  extractPlugin(maybePlugin) {
    return Array.isArray(maybePlugin) ? maybePlugin[0] : maybePlugin;
  }

  extractPluginOpts(maybePlugin) {
    return Array.isArray(maybePlugin) ? maybePlugin[1] : undefined;
  }

  /**
   * The `getPluginTypes()` utility method extracts the plugin type from each plugin
   * provided via the `plugins` array.
   */
  getPluginTypes(plugins) {
    return plugins.map((plugin) => plugin.TYPE).filter((type, i, arr) => i === arr.indexOf(type));
  }

  /**
   * The `getPluginsByType()` utility method returns all plugins that have been instantiated,
   * and which match the type provided.
   */
  getPluginsByType(type) {
    return this.plugins.filter((plugin) => plugin.constructor.TYPE === type);
  }
}

module.exports = Core;

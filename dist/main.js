/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/core/core.js":
/*!**************************!*\
  !*** ./src/core/core.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { PluginTypes } = __webpack_require__(/*! ./utils */ \"./src/core/utils.js\");\n\n/**\n * The Core class is responsible for instantiating plugins,\n * facilitating communication between them, and wrapping select\n * plugin methods such that they may be accessed by sibling\n * plugins.\n */\nclass Core {\n  /**\n   * At instantiation time, Core is provided with an options object\n   * that contains all of the data and configuration options that\n   * are required for the current session.\n   */\n  constructor(opts = {}) {\n    const { plugins = [] } = opts;\n\n    /**\n     * The primary role of the constructor function is to instantiate any\n     * plugins received via the options object. Core delegates this responsibility\n     * to the `instantiatePlugins()` method, which receives an array of\n     * plugins as its sole argument. This method returns an array of plugin\n     * instances, which are stored as the `plugins` instance property.\n     */\n    this.plugins = this.instantiatePlugins(plugins);\n\n    /**\n     * // TODO\n     */\n    this.initializePlugins(this.plugins);\n\n    /**\n     * // TODO\n     */\n    this.setupPlugins(this.plugins);\n  }\n\n  /**\n   * The `instantiatePlugins()` method is responsible for instantiating each\n   * plugin received by Core via the options object.\n   *\n   * This method also defines an array of plugin types, which are extracted\n   * from the plugin classes themselves. This array is passed to the underlying\n   * `instantiatePlugin()` method.\n   */\n  instantiatePlugins(plugins) {\n    const pluginTypes = this.getPluginTypes(plugins);\n    return plugins.map((plugin) => {\n      return this.instantiatePlugin(plugin, pluginTypes);\n    });\n  }\n\n  /** The `instantiatePlugin()` method is responsible for instantiating a\n   * single plugin, which it receives alongside an array of valid plugin types.\n   */\n  instantiatePlugin(plugin, types = []) {\n    const mod = this.extractPlugin(plugin);\n    const modOpts = this.extractPluginOpts(plugin);\n    return new mod(this, modOpts);\n  }\n\n  initializePlugins(plugins) {\n    plugins.forEach((plugin) => this.initializePlugin(plugin));\n    return plugins;\n  }\n\n  initializePlugin(plugin) {\n    const types = this.plugins.map((plugin) => plugin.TYPE);\n    const missing = plugin.DEPENDENCIES.filter(({ type }) => types.length && types.indexOf(type) === -1);\n    if (missing.length) throw new Error(`Missing the following dependencies: ${missing.join('; ')}`);\n\n    const deps = [...plugin.DEPENDENCIES, ...plugin.OPTIONAL]\n        .map((depDesc) => ({\n          ...depDesc,\n          dep: this.plugins.find((el) => el.TYPE === depDesc.type) || this.mockPlugin(depDesc.key)\n        }))\n        .reduce((acc, { key, dep }) => ({ ...acc, [key]: dep}), {});\n\n    plugin.init(deps);\n    return plugin;\n  }\n\n  mockPlugin(key) {\n    const fn = () => console.warn(`Whoops, the following plugin does not exist:`, key);\n    return new Proxy({}, {\n      get(target, name) {\n        // TODO: Print `key`.\n        return fn;\n      }\n    })\n  }\n\n  setupPlugins(plugins) {\n    plugins.forEach((plugin) => this.setupPlugin(plugin));\n    return plugins;\n  }\n\n  setupPlugin(plugin) {\n    plugin.afterInit();\n    return plugin;\n  }\n\n  extractPlugin(maybePlugin) {\n    return Array.isArray(maybePlugin) ? maybePlugin[0] : maybePlugin;\n  }\n\n  extractPluginOpts(maybePlugin) {\n    return Array.isArray(maybePlugin) ? maybePlugin[1] : undefined;\n  }\n\n  /**\n   * The `getPluginTypes()` utility method extracts the plugin type from each plugin\n   * provided via the `plugins` array.\n   */\n  getPluginTypes(plugins) {\n    return plugins.map((plugin) => plugin.TYPE).filter((type, i, arr) => i === arr.indexOf(type));\n  }\n\n  /**\n   * The `getPluginsByType()` utility method returns all plugins that have been instantiated,\n   * and which match the type provided.\n   */\n  getPluginsByType(type) {\n    return this.plugins.filter((plugin) => plugin.constructor.TYPE === type);\n  }\n}\n\nmodule.exports = Core;\n\n\n//# sourceURL=webpack:///./src/core/core.js?");

/***/ }),

/***/ "./src/core/index.js":
/*!***************************!*\
  !*** ./src/core/index.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * This file acts as a manifest, in that it makes the contents of\n * the core/ directory importable via a central location.\n *\n * As a result, consumers of the Logic layer may import the Core\n * class in either of the following ways:\n * - `const Core = require('./core/core');`\n * - `const Core = require('./core');`\n */\nmodule.exports = {\n  ...__webpack_require__(/*! ./utils */ \"./src/core/utils.js\"),\n  Core: __webpack_require__(/*! ./core */ \"./src/core/core.js\"),\n  Plugins: __webpack_require__(/*! ./plugins */ \"./src/core/plugins/index.js\"),\n};\n\n\n//# sourceURL=webpack:///./src/core/index.js?");

/***/ }),

/***/ "./src/core/plugins/abstract.js":
/*!**************************************!*\
  !*** ./src/core/plugins/abstract.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * The `AbstractPlugin` class provides the foundation for all plugin-type\n * classes. This class defines default values for a series of class and\n * instance properties, exposes common/shared methods, and specifies default\n * instantiation behaviour via the constructor method.\n */\nclass AbstractPlugin {\n get DEPENDENCIES() {\n    return [];\n  }\n\n get OPTIONAL() {\n    return [];\n  }\n\n get DEFAULTS() {\n    return {};\n  }\n\n  constructor(core, opts = {}) {\n    this.core = core;\n    this.settings = this.resolveSettings(opts, this.DEFAULTS);\n  }\n\n  init(deps = {}) {\n    this.deps = deps;\n  }\n\n  afterInit() {\n    // no-op\n  }\n\n  resolveSettings(options = {}, defaults = {}) {\n    return Object.assign({}, defaults, options);\n  }\n}\n\nmodule.exports = AbstractPlugin;\n\n\n//# sourceURL=webpack:///./src/core/plugins/abstract.js?");

/***/ }),

/***/ "./src/core/plugins/data-source.js":
/*!*****************************************!*\
  !*** ./src/core/plugins/data-source.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { PluginTypes } = __webpack_require__(/*! ../utils */ \"./src/core/utils.js\");\nconst AbstractPlugin = __webpack_require__(/*! ./abstract */ \"./src/core/plugins/abstract.js\");\n\n/**\n * The `AbstractDataSourcePlugin` class provides the foundation for all `DATA_SOURCE`-type\n * plugin classes. This class defines the `TYPE` instance property, as well as a series of\n * utility methods.\n */\nclass AbstractDataSourcePlugin extends AbstractPlugin {\n get TYPE() {\n    return PluginTypes.DATA_SOURCE;\n  }\n\n  constructor(core, opts = {}) {\n    super(core, opts);\n    this.ingestApi(opts);\n  }\n\n  ingestApi(opts = {}) {\n    const { api } = opts;\n    if (!api) throw new Error('Whoops, DATA_SOURCE-type plugins must receive an `api` at instantiation time');\n    this.api = new api();\n  }\n}\n\nmodule.exports = AbstractDataSourcePlugin;\n\n\n//# sourceURL=webpack:///./src/core/plugins/data-source.js?");

/***/ }),

/***/ "./src/core/plugins/filter.js":
/*!************************************!*\
  !*** ./src/core/plugins/filter.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { PluginTypes } = __webpack_require__(/*! ../utils */ \"./src/core/utils.js\");\nconst AbstractPlugin = __webpack_require__(/*! ./abstract */ \"./src/core/plugins/abstract.js\");\n\n/**\n * The `AbstractFilterPlugin` class provides the foundation for all `FILTER`-type\n * plugin classes. This class defines the `TYPE` instance property, and a minimal\n * implementation of the `filter()` method (which is required by all `FILTER`-type\n * plugin classes).\n */\nclass AbstractFilterPlugin extends AbstractPlugin {\n get TYPE() {\n    return PluginTypes.FILTER;\n  }\n\n  filter() {\n    throw new Error('FILTER-type plugins must implement the `#filter()` method.');\n  }\n}\n\nmodule.exports = AbstractFilterPlugin;\n\n\n//# sourceURL=webpack:///./src/core/plugins/filter.js?");

/***/ }),

/***/ "./src/core/plugins/index.js":
/*!***********************************!*\
  !*** ./src/core/plugins/index.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = {\n  AbstractDataSourcePlugin: __webpack_require__(/*! ./data-source */ \"./src/core/plugins/data-source.js\"),\n  AbstractFilterPlugin: __webpack_require__(/*! ./filter */ \"./src/core/plugins/filter.js\"),\n  AbstractPlugin: __webpack_require__(/*! ./abstract */ \"./src/core/plugins/abstract.js\"),\n};\n\n\n//# sourceURL=webpack:///./src/core/plugins/index.js?");

/***/ }),

/***/ "./src/core/utils.js":
/*!***************************!*\
  !*** ./src/core/utils.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * `PluginTypes` is a dictionary of plugin type strings. The dictionary's\n * keys are plain-terms type identifiers. The dictionary's values include\n * a namespace ('sfx'), a 'key type' identifier ('plugin'), and a 'kebab case'\n * version of the corresponding key (eg. 'cache', 'data-source', etc.).\n *\n * This dictionary is imported and used by plugins in order to define their\n * types.\n */\nconst PluginTypes = {\n  CACHE: 'sfx:plugin:cache',\n  DATA_SOURCE: 'sfx:plugin:data-source',\n  EVENTS: 'sfx:plugin:events',\n  FILTER: 'sfx:plugin:filter',\n  FILTER_MANAGER: 'sfx:plugin:filter-manager',\n  LOGGER: 'sfx:plugin:logger',\n};\n\n/**\n * `Events` is a dictionary of event strings. The dictionary's keys\n * are plain-terms event names. The dictionary's values include a\n * namespace ('sfx'), an 'event namespace' (eg. 'products'), and an\n * 'event action' (eg. 'fetch', 'supply').\n *\n * This dictionary is imported and used by both plugins and components.\n */\nconst Events = {\n  PRODUCTS_FETCH: 'sfx:products:fetch',\n  PRODUCTS_SUPPLY: 'sfx:products:supply',\n  SAYT_DISMISS: 'sfx:sayt:dismiss',\n  SAYT_PRODUCTS_FETCH: 'sfx:sayt-products:fetch',\n  SAYT_PRODUCTS_SUPPLY: 'sfx:sayt-products:supply',\n};\n\nmodule.exports = {\n  Events,\n  PluginTypes,\n};\n\n\n//# sourceURL=webpack:///./src/core/utils.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * This file represents the entry point for the Webpack process, the output\n * of which is a JavaScript artifact. This artifact is consumed by the sample/\n * demo application, which lives within the public/ directory.\n */\n\n/**\n * First we import the Core module, as well as a dictionary of event identifiers.\n */\nconst { Core, Events: EventsDict } = __webpack_require__(/*! ./core */ \"./src/core/index.js\");\n\n/**\n * Then we import our plugin classes and related modules, which we'll provide to\n * Core at instantiation time via an options object.\n */\nconst DataSource = __webpack_require__(/*! ./plugins/data-source */ \"./src/plugins/data-source/index.js\");\nconst DataSourceApi = __webpack_require__(/*! ./plugins/data-source/api */ \"./src/plugins/data-source/api.js\");\nconst Events = __webpack_require__(/*! ./plugins/events */ \"./src/plugins/events/index.js\");\nconst FilterManager = __webpack_require__(/*! ./plugins/filter-manager */ \"./src/plugins/filter-manager/index.js\");\nconst Filter = __webpack_require__(/*! ./plugins/filter */ \"./src/plugins/filter/index.js\");\nconst Cache = __webpack_require__(/*! ./plugins/cache */ \"./src/plugins/cache/index.js\");\nconst Logger = __webpack_require__(/*! ./plugins/logger */ \"./src/plugins/logger/index.js\");\n\n/** Our final import is a dictionary of Web Components classes. Since the demo\n * application will be responsible for registering each of the Web Components, we\n * make the classes available by exposing them as property of the `window` object.\n */\nconst { Components }  = __webpack_require__(/*! ./ui */ \"./src/ui/index.js\");\nwindow.__COMPONENTS__ = Components;\n\n/**\n * Finally we create a new instance of the Core class, passing in an options object\n * that contains our plugin classes. We also expose the Core instance via the\n * `__CORE__` property of the `window` object.\n *\n * For cases where a plugin does not require configuration options, providing the\n * plugin class is sufficient.\n *\n * For cases where a plugin either requires (or accepts) configuration options,\n * these may be provided using an array-type structure. In this case, Core expects\n * the first member of the array to be the plugin class, and the second member to\n * be an options object.\n */\nconst core = window.__CORE__ = new Core({\n  plugins: [\n    [\n      DataSource,\n      {\n        api: DataSourceApi,\n        alsoListenOn: [{ listenOn: EventsDict.PRODUCTS_FETCH, emitOn: EventsDict.SAYT_DISMISS , callback: () => true }],\n      },\n    ],\n    Events,\n    FilterManager,\n    Filter,\n    Cache,\n    Logger,\n  ],\n});\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/plugins/cache/index.js":
/*!************************************!*\
  !*** ./src/plugins/cache/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { PluginTypes } = __webpack_require__(/*! ../../core */ \"./src/core/index.js\");\nconst { AbstractPlugin } = __webpack_require__(/*! ../../core/plugins */ \"./src/core/plugins/index.js\");\n\nclass Cache extends AbstractPlugin {\n get TYPE() {\n    return PluginTypes.CACHE;\n  }\n\n get NAME() {\n    return 'Cache';\n  }\n\n  get OPTIONAL() {\n    return [{ type: PluginTypes.LOGGER, key: 'Logger' }];\n  }\n\n  constructor(...args) {\n    super(...args);\n\n    this.cache = {};\n  }\n\n  get(key) {\n    const k = this.normalizeKey(key);\n\n    this.deps.Logger.log(`[${this.NAME}] Retrieving data at key`, k);\n\n    const { payload } = this.cache[k] || {};\n    return payload;\n  }\n\n  put(key, value) {\n    this.deps.Logger.log(`[${this.NAME}] Inserting data at key`, value, key);\n    const k = this.normalizeKey(key);\n    this.cache[k] = { expiresAt: new Date().getTime() + 10000, payload: value };\n  }\n\n  has(key) {\n    const k = this.normalizeKey(key);\n\n    this.deps.Logger.log(`[${this.NAME}] Checking for the presence of data at key`, key);\n\n    return this.cache[k] && this.cache[k].expiresAt >= new Date().getTime();\n  }\n\n  normalizeKey(key) {\n    return JSON.stringify(key);\n  }\n}\n\nmodule.exports = Cache;\n\n\n//# sourceURL=webpack:///./src/plugins/cache/index.js?");

/***/ }),

/***/ "./src/plugins/data-source/adapter.js":
/*!********************************************!*\
  !*** ./src/plugins/data-source/adapter.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { Events, PluginTypes } = __webpack_require__(/*! ../../core */ \"./src/core/index.js\");\nconst { AbstractDataSourcePlugin } = __webpack_require__(/*! ../../core/plugins */ \"./src/core/plugins/index.js\");\nconst { Api } = __webpack_require__(/*! ./api */ \"./src/plugins/data-source/api.js\");\n\nclass DataSource extends AbstractDataSourcePlugin {\n get NAME() {\n    return 'DataSource';\n  }\n\n get DEPENDENCIES() {\n    return [{ type: PluginTypes.EVENTS, key: 'Events' }];\n  }\n\n get DEFAULTS() {\n    return {\n      alsoListenOn: [],\n      onlyListenOn: [],\n    };\n  }\n\n  constructor(core, opts = {}) {\n    super(core, opts);\n  }\n\n  init(deps) {\n    this.deps = deps;\n  }\n\n  afterInit() {\n    this.register().forEach(({ listenOn, emitOn, callback }) => {\n      this.deps.Events.register(listenOn, emitOn, callback);\n    });\n  }\n\n  register() {\n    return this.settings.onlyListenOn.length\n      ? this.settings.onlyListenOn\n      : [\n          { listenOn: Events.PRODUCTS_FETCH, emitOn: Events.PRODUCTS_SUPPLY, callback: { fn: this.fetch, context: this } },\n          { listenOn: Events.SAYT_PRODUCTS_FETCH, emitOn: Events.SAYT_PRODUCTS_SUPPLY, callback: { fn: this.fetchSaytProducts, context: this } },\n          ...this.settings.alsoListenOn,\n      ];\n  }\n\n  fetch(data) {\n    return new Promise((resolve, reject) => {\n      return this.api.fetch(data)\n        .then(resolve, reject);\n    });\n  }\n\n  fetchSaytProducts(data) {\n    // TODO: Update method to return distinct data.\n    return new Promise((resolve, reject) => {\n      return this.api.fetch(data)\n        .then(resolve, reject);\n    });\n  }\n}\n\nmodule.exports = DataSource;\n\n\n//# sourceURL=webpack:///./src/plugins/data-source/adapter.js?");

/***/ }),

/***/ "./src/plugins/data-source/api.js":
/*!****************************************!*\
  !*** ./src/plugins/data-source/api.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class Api {\n  fetch(data) {\n    return window.fetch('https://cvshealth-cors.groupbycloud.com/api/v1/search', {\n      method: 'POST',\n      body: JSON.stringify({\n        ...data,\n        collection: 'productsLeaf',\n      }),\n    })\n      .then((response) => response.json());\n  }\n}\n\nmodule.exports = Api;\n\n\n//# sourceURL=webpack:///./src/plugins/data-source/api.js?");

/***/ }),

/***/ "./src/plugins/data-source/index.js":
/*!******************************************!*\
  !*** ./src/plugins/data-source/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./adapter */ \"./src/plugins/data-source/adapter.js\");\n\n\n//# sourceURL=webpack:///./src/plugins/data-source/index.js?");

/***/ }),

/***/ "./src/plugins/events/index.js":
/*!*************************************!*\
  !*** ./src/plugins/events/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { PluginTypes } = __webpack_require__(/*! ../../core */ \"./src/core/index.js\");\nconst { AbstractPlugin } = __webpack_require__(/*! ../../core/plugins */ \"./src/core/plugins/index.js\");\n\nclass Events extends AbstractPlugin {\n get TYPE() {\n    return PluginTypes.EVENTS;\n  }\n\n get NAME() {\n    return 'Events';\n  }\n\n get OPTIONAL() {\n    return [\n      { type: PluginTypes.CACHE, key: 'Cache' },\n      { type: PluginTypes.LOGGER, key: 'Logger' },\n      { type: PluginTypes.FILTER_MANAGER, key: 'FilterManager' },\n    ];\n  }\n\n  register(listenOn, emitOn, callback) {\n    window.addEventListener(listenOn, (e) => {\n      this.deps.Logger.log(`[${this.NAME}] Handling event`, listenOn)\n      try {\n        const { detail } = e;\n        const key = [listenOn, detail];\n        const result = this.deps.Cache.has(key)\n          ? this.deps.Cache.get(key)\n          : typeof callback === 'function'\n            ? callback(detail)\n            : callback.fn.call(callback.context, detail);\n\n        const fn = (data) => {\n          const filteredData = this.deps.FilterManager.applyFilters(data) || data;\n          this.deps.Cache.put(key, data);\n          this.dispatch({ listenOn, emitOn, data: filteredData });\n        };\n\n        result instanceof Promise\n          ? result.then(fn)\n          : fn(result);\n      } catch (e) {\n        this.deps.Logger.error(`[${this.NAME}] Encountered error`, e);\n        // TODO: Dispatch error-type event.\n      }\n    });\n  }\n\n  dispatch(payload) {\n    const { emitOn, data } = payload;\n    this.deps.Logger.log(`[${this.NAME}] Emitting event with payload`, emitOn, payload);\n    window.dispatchEvent(new window.CustomEvent(emitOn, { detail: payload }));\n  }\n}\n\nmodule.exports = Events;\n\n\n//# sourceURL=webpack:///./src/plugins/events/index.js?");

/***/ }),

/***/ "./src/plugins/filter-manager/index.js":
/*!*********************************************!*\
  !*** ./src/plugins/filter-manager/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { AbstractPlugin } = __webpack_require__(/*! ../../core/plugins */ \"./src/core/plugins/index.js\");\n\nclass FilterManager extends AbstractPlugin {\n  get TYPE() {\n    return 'sfx:plugin:filter-manager';\n  }\n\n  get NAME() {\n    return 'FilterManager';\n  }\n\n  constructor(...args) {\n    super(...args);\n\n    this.filters = [];\n  }\n\n  add(filter) {\n    this.filters.push(filter);\n  }\n\n  remove(filter) {\n    this.filters.filter((f) => f !== filter);\n  }\n\n  applyFilters(data) {\n    if (!this.filters.length) return data;\n    return this.filters.reduce((acc, filter) => filter.filter(data), data);\n  }\n}\n\nmodule.exports = FilterManager;\n\n\n//# sourceURL=webpack:///./src/plugins/filter-manager/index.js?");

/***/ }),

/***/ "./src/plugins/filter/index.js":
/*!*************************************!*\
  !*** ./src/plugins/filter/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { Events, PluginTypes } = __webpack_require__(/*! ../../core */ \"./src/core/index.js\");\nconst { AbstractFilterPlugin } = __webpack_require__(/*! ../../core/plugins */ \"./src/core/plugins/index.js\");\n\nclass Filter extends AbstractFilterPlugin {\n  get NAME() {\n    return 'Filter';\n  }\n\n  get DEPENDENCIES() {\n    return [{ type: PluginTypes.FILTER_MANAGER, key: 'FilterManager' }];\n  }\n\n  afterInit() {\n    this.deps.FilterManager.add(this);\n  }\n\n  filter(data) {\n    if (!data || !data.records) return data;\n    return this.transformResponse(data);\n  }\n\n  transformResponse(data) {\n    const { records, ...rest } = data;\n\n    return {\n      ...rest,\n      records: records.map((record) => ({\n        ...record,\n        allMeta: {\n          ...record.allMeta,\n          title: record.allMeta.title.toUpperCase(),\n        },\n      })),\n    };\n  }\n}\n\nmodule.exports = Filter;\n\n\n//# sourceURL=webpack:///./src/plugins/filter/index.js?");

/***/ }),

/***/ "./src/plugins/logger/index.js":
/*!*************************************!*\
  !*** ./src/plugins/logger/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { PluginTypes } = __webpack_require__(/*! ../../core */ \"./src/core/index.js\");\nconst { AbstractPlugin } = __webpack_require__(/*! ../../core/plugins */ \"./src/core/plugins/index.js\");\n\nclass Logger extends AbstractPlugin {\n  get TYPE() {\n    return PluginTypes.LOGGER;\n  }\n\n  get NAME() {\n    return 'Logger';\n  }\n\n  constructor(core, opts = {}) {\n    super(core, opts);\n\n    this.logger = window.console;\n    this.methods = ['log', 'error'];\n    this.methods.forEach((method, i) => {\n      this[method] = (...args) => {\n        if (i >= this.methods.indexOf(this.settings.mode)) this.logger[method](...args);\n      }\n    });\n  }\n\n}\n\nmodule.exports = Logger;\n\n\n//# sourceURL=webpack:///./src/plugins/logger/index.js?");

/***/ }),

/***/ "./src/ui/components/index.js":
/*!************************************!*\
  !*** ./src/ui/components/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = {\n  Product: __webpack_require__(/*! ./product */ \"./src/ui/components/product/index.js\"),\n  Products: __webpack_require__(/*! ./products */ \"./src/ui/components/products/index.js\"),\n  Sayt: __webpack_require__(/*! ./sayt */ \"./src/ui/components/sayt/index.js\"),\n  Suggestions: __webpack_require__(/*! ./suggestions */ \"./src/ui/components/suggestions/index.js\"),\n  SearchBox: __webpack_require__(/*! ./search-box */ \"./src/ui/components/search-box/index.js\"),\n};\n\n\n//# sourceURL=webpack:///./src/ui/components/index.js?");

/***/ }),

/***/ "./src/ui/components/product/index.js":
/*!********************************************!*\
  !*** ./src/ui/components/product/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { Events } = __webpack_require__(/*! ../../../core */ \"./src/core/index.js\");\nconst { interpolate } = __webpack_require__(/*! ./../utils */ \"./src/ui/components/utils.js\");\n\nconst template = document.createElement('template');\ntemplate.innerHTML = `\n  <style>\n    .view,\n    article {\n      height: 100%;\n    }\n\n    article {\n      min-height: 40rem;\n      background: #fff;\n      box-shadow: 0 0.5rem 3rem -1rem rgba(0, 0, 0, 0.3);\n    }\n\n    article div {\n      padding: 2rem;\n    }\n\n    article h1 {\n      margin: 0;\n      font-size: 2rem;\n      line-height: 1.4;\n    }\n\n    img {\n      max-width: 100%;\n      display: block;\n    }\n  </style>\n  <div class=\"view\"></div>\n`;\nconst tmpl = `\n  <article>\n    <header>\n      <img src=\"{{ src }}\" />\n    </header>\n    <div>\n      <h1>{{ title }}</h1>\n    </div>\n  </article>\n`;\n\nclass Product extends HTMLElement {\n  constructor() {\n    super();\n\n    this.root = this.attachShadow({ mode: 'open' });\n    this.root.appendChild(template.content.cloneNode(true));\n    this.view = this.root.querySelector('.view');\n\n    // TEMP\n    this.state = {};\n\n    // Bind.\n    this.render = this.render.bind(this);\n  }\n\n  connectedCallback() {\n    this.render();\n  }\n\n  disconnectedCallback() {\n    // TODO\n  }\n\n  render() {\n    this.view.innerHTML = '';\n    this.view.innerHTML = interpolate(tmpl, {\n      title: this.state.data.allMeta.title,\n      src: 'https://via.placeholder.com/300x200',\n    });\n  }\n\n  // TODO: Move to base class.\n  set(data = {}) {\n    this.state = { ...this.state, ...data };\n  }\n}\n\nmodule.exports = Product;\n\n\n//# sourceURL=webpack:///./src/ui/components/product/index.js?");

/***/ }),

/***/ "./src/ui/components/products/index.js":
/*!*********************************************!*\
  !*** ./src/ui/components/products/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { Events } = __webpack_require__(/*! ../../../core */ \"./src/core/index.js\");\nconst { interpolate } = __webpack_require__(/*! ./../utils */ \"./src/ui/components/utils.js\");\n\nconst template = document.createElement('template');\ntemplate.innerHTML = `\n  <style>\n    .products__inner {\n      display: flex;\n      flex-direction: row;\n      flex-wrap: wrap;\n      justify-content: flex-start;\n      padding: 2rem 0;\n    }\n\n    .products__inner > * {\n      width: 32%;\n      margin-bottom: 4%;\n      margin-right: 2%;\n    }\n\n    .products__inner > *:nth-child(3n) {\n      margin-right: 0;\n    }\n  </style>\n  <div class=\"view\"></div>\n`;\nconst tmpl = `\n  <section class=\"products\">\n    <div ref=\"products\" class=\"products__inner\"></div>\n  </section>\n`;\n\nclass Products extends HTMLElement {\n  constructor() {\n    super();\n\n    this.root = this.attachShadow({ mode: 'open' });\n    this.root.appendChild(template.content.cloneNode(true));\n    this.view = this.root.querySelector('.view');\n\n    // Bind.\n    this.render = this.render.bind(this);\n    this.updateProducts = this.updateProducts.bind(this);\n  }\n\n  connectedCallback() {\n    this.render();\n\n    window.addEventListener(Events.PRODUCTS_SUPPLY, this.updateProducts);\n  }\n\n  disconnectedCallback() {\n    window.removeEventListener(Events.PRODUCTS_SUPPLY, this.updateProducts);\n  }\n\n  render() {\n    this.view.innerHTML = '';\n    this.view.innerHTML = interpolate(tmpl, {});\n  }\n\n  updateProducts(e) {\n    const target = this.view.querySelector('[ref=\"products\"]');\n    target.innerHTML = '';\n    e.detail.data.records.forEach((product) => {\n      target.appendChild(this.renderProduct(product));\n    });\n  }\n\n  renderProduct(product) {\n    const elem = document.createElement('sfx-product');\n    elem.set({ data: product });\n    return elem;\n  }\n}\n\nmodule.exports = Products;\n\n\n//# sourceURL=webpack:///./src/ui/components/products/index.js?");

/***/ }),

/***/ "./src/ui/components/sayt/index.js":
/*!*****************************************!*\
  !*** ./src/ui/components/sayt/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { Events } = __webpack_require__(/*! ../../../core */ \"./src/core/index.js\");\nconst { interpolate } = __webpack_require__(/*! ./../utils */ \"./src/ui/components/utils.js\");\n\nconst template = document.createElement('template');\ntemplate.innerHTML = `\n  <style>\n    .sayt {\n      position: relative;\n    }\n\n    .sayt__inner {\n      /* TODO */\n    }\n\n    .search-box {\n\n    }\n\n    .search-box__inner {\n\n    }\n\n    .suggestions {\n      width: 100%;\n      height: auto;\n      position: absolute;\n      top: 100%;\n      left: 0;\n    }\n\n    .suggestions__inner {\n\n    }\n  </style>\n  <div class=\"view\"></div>\n`;\nconst tmpl = `\n  <div class=\"sayt\">\n    <div class=\"sayt__inner\">\n      <div class=\"search-box\">\n        <div class=\"search-box__inner\">\n          <slot name=\"search-box\"></slot>\n        </div>\n      </div>\n      <div class=\"suggestions\">\n        <div class=\"suggestions__inner\">\n          <slot name=\"suggestions\"></slot>\n        </div>\n      </div>\n    </div>\n  </div>\n`;\n\nclass Sayt extends HTMLElement {\n  constructor() {\n    super();\n\n    this.root = this.attachShadow({ mode: 'open' });\n    this.root.appendChild(template.content.cloneNode(true));\n    this.view = this.root.querySelector('.view');\n\n    // Bind.\n    this.render = this.render.bind(this);\n  }\n\n  connectedCallback() {\n    this.render();\n  }\n\n  disconnectedCallback() {\n    // TODO\n  }\n\n  render() {\n    this.view.innerHTML = '';\n    this.view.innerHTML = interpolate(tmpl, { foo: 'bar' });\n  }\n\n  renderProduct(product) {\n    const elem = document.createElement('p');\n    elem.innerHTML = product.allMeta.title;\n    return elem;\n  }\n}\n\nmodule.exports = Sayt;\n\n\n//# sourceURL=webpack:///./src/ui/components/sayt/index.js?");

/***/ }),

/***/ "./src/ui/components/search-box/index.js":
/*!***********************************************!*\
  !*** ./src/ui/components/search-box/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { Events } = __webpack_require__(/*! ../../../core */ \"./src/core/index.js\");\nconst { interpolate } = __webpack_require__(/*! ./../utils */ \"./src/ui/components/utils.js\");\n\nconst template = document.createElement('template');\ntemplate.innerHTML = `\n  <style>\n    input {\n      /* TEMP */\n      width: 1000rem;\n      max-width: 30rem;\n      background: transparent;\n      padding: 1rem;\n      border: solid 0.1rem #ddd;\n    }\n\n  </style>\n  <div class=\"view\"></div>\n`;\nconst tmpl = `\n  <div class=\"search-box\">\n    <div class=\"search-box__inner\">\n      <input type=\"text\" />\n    </div>\n  </div>\n`;\n\nclass SearchBox extends HTMLElement {\n  constructor() {\n    super();\n\n    this.root = this.attachShadow({ mode: 'open' });\n    this.root.appendChild(template.content.cloneNode(true));\n    this.view = this.root.querySelector('.view');\n\n    // Bind.\n    this.render = this.render.bind(this);\n    this.search = this.search.bind(this);\n  }\n\n  connectedCallback() {\n    this.render();\n    this.view.querySelector('input').addEventListener('keyup', this.search);\n  }\n\n  disconnectedCallback() {\n    this.view.querySelector('input').removeEventListener('keyup', this.search);\n  }\n\n  render() {\n    this.view.innerHTML = '';\n    this.view.innerHTML = interpolate(tmpl);\n  }\n\n  search(e) {\n    const query = this.view.querySelector('input').value;\n\n    switch (+e.keyCode) {\n      case 13:\n        window.dispatchEvent(new CustomEvent(Events.PRODUCTS_FETCH, { detail: { query } }));\n        break;\n      default:\n        if (!query || query.length < 3) return;\n        window.dispatchEvent(new CustomEvent(Events.SAYT_PRODUCTS_FETCH, { detail: { query } }));\n    }\n  }\n}\n\nmodule.exports = SearchBox;\n\n\n//# sourceURL=webpack:///./src/ui/components/search-box/index.js?");

/***/ }),

/***/ "./src/ui/components/suggestions/index.js":
/*!************************************************!*\
  !*** ./src/ui/components/suggestions/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { Events } = __webpack_require__(/*! ../../../core */ \"./src/core/index.js\");\nconst { interpolate } = __webpack_require__(/*! ./../utils */ \"./src/ui/components/utils.js\");\n\nconst template = document.createElement('template');\ntemplate.innerHTML = `\n  <style>\n    .suggestions {\n      background: #fff;\n      box-shadow: 0 0.3rem 3rem -1rem rgba(0, 0, 0, 0.3);\n    }\n\n    .suggestions__inner:not(:empty) {\n      padding-top: 1rem;\n      padding-bottom: 1rem;\n    }\n\n    a {\n      display: block;\n      color: #444;\n      padding: 1rem 2rem;\n    }\n  </style>\n  <div class=\"view\"></div>\n`;\nconst tmpl = `\n  <div class=\"suggestions\">\n    <div ref=\"suggestions\" class=\"suggestions__inner\"></div>\n  </div>\n`;\n\nclass Suggestions extends HTMLElement {\n  constructor() {\n    super();\n\n    this.root = this.attachShadow({ mode: 'open' });\n    this.root.appendChild(template.content.cloneNode(true));\n    this.view = this.root.querySelector('.view');\n\n    // Bind.\n    this.render = this.render.bind(this);\n    this.updateProducts = this.updateProducts.bind(this);\n    this.dismissSayt = this.dismissSayt.bind(this);\n  }\n\n  connectedCallback() {\n    this.render();\n\n    window.addEventListener(Events.SAYT_PRODUCTS_SUPPLY, this.updateProducts);\n    window.addEventListener(Events.SAYT_DISMISS, this.dismissSayt);\n  }\n\n  disconnectedCallback() {\n    window.removeEventListener(Events.SAYT_PRODUCTS_SUPPLY, this.updateProducts);\n    window.removeEventListener(Events.SAYT_DISMISS, this.dismissSayt);\n  }\n\n  render() {\n    this.view.innerHTML = '';\n    this.view.innerHTML = interpolate(tmpl, {});\n  }\n\n  updateProducts(e) {\n    this.render();\n\n    // TEMP: Implement `getRefs()` or similar.\n    const elem = this.view.querySelector('[ref=\"suggestions\"]');\n\n    e.detail.data.records.forEach((product) => {\n      elem.appendChild(this.renderProduct(product));\n    });\n  }\n\n  renderProduct(product) {\n    const elem = document.createElement('a');\n    const fn = (e) => {\n      switch (+e.keyCode) {\n        case 13:\n          window.dispatchEvent(new CustomEvent(Events.PRODUCTS_FETCH, { detail: { query: e.target.innerHTML } }));\n          break;\n        default: return;\n      }\n    };\n\n    elem.href = '#';\n    elem.innerHTML = product.allMeta.title;\n    // TODO: Remove node-specific event handler when component is unmounted or re-rendered.\n    elem.addEventListener('keyup', fn);\n    return elem;\n  }\n\n  dismissSayt() {\n    // Re-render component to clear product data.\n    this.render();\n  }\n}\n\nmodule.exports = Suggestions;\n\n\n//# sourceURL=webpack:///./src/ui/components/suggestions/index.js?");

/***/ }),

/***/ "./src/ui/components/utils.js":
/*!************************************!*\
  !*** ./src/ui/components/utils.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const interpolate = (tmpl, data = {}) => {\n  return Object.keys(data).reduce((str, key) => {\n    const pattern = new RegExp(`{{ ${key} }}`, 'gmi');\n    return str.replace(pattern, data[key]);\n  }, tmpl);\n};\n\nmodule.exports = {\n  interpolate,\n};\n\n\n//# sourceURL=webpack:///./src/ui/components/utils.js?");

/***/ }),

/***/ "./src/ui/index.js":
/*!*************************!*\
  !*** ./src/ui/index.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = {\n  Components: __webpack_require__(/*! ./components */ \"./src/ui/components/index.js\"),\n};\n\n\n//# sourceURL=webpack:///./src/ui/index.js?");

/***/ })

/******/ });
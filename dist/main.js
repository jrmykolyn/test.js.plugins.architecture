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

eval("const { PluginTypes } = __webpack_require__(/*! ./utils */ \"./src/core/utils.js\");\n\n/**\n * The Core class is responsible for instantiating plugins,\n * facilitating communication between them, and wrapping select\n * plugin methods such that they may be accessed by sibling\n * plugins.\n */\nclass Core {\n  /**\n   * Core exposes a series of static getter properties. The `ORDER`\n   * property returns an array of plugin types, which is used to\n   * ensure that the plugins are instantiated in the correct order.\n   */\n  static get ORDER() {\n    return [\n      PluginTypes.FILTER,\n      PluginTypes.DATA_SOURCE,\n      PluginTypes.EVENTS,\n      PluginTypes.CACHE,\n    ];\n  }\n\n  /**\n   * At instantiation time, Core is provided with an options object\n   * that contains all of the data and configuration options that\n   * are required for the current session.\n   */\n  constructor(opts = {}) {\n    const { plugins = [] } = opts;\n\n    /**\n     * The primary role of the constructor function is to instantiate any\n     * plugins received via the options object. Core delegates this responsibility\n     * to the `instantiatePlugins()` method, which receives an array of\n     * plugins as its sole argument. This method returns an array of plugin\n     * instances, which are stored as the `plugins` instance property.\n     */\n    this.plugins = this.instantiatePlugins(plugins);\n\n    /**\n     * Additionally, the Core instance is responsible for facilitating\n     * communication between plugins, including the `DATA_SOURCE` and\n     * `EVENTS`plugins.\n     *\n     * `DATA_SOURCE` plugins expose a `register()` method, which returns\n     * an array of objects, each of which contains an event to 'listen'\n     * on, an event to 'emit' on, and a callback to invoke when the former\n     * event is 'heard'.\n     *\n     * `EVENTS` plugins also expose a `register()` method. This method\n     * accepts the data returned by the `DATA_SOURCE` plugins' `register()`,\n     * and registers a environment-specific event listeners.\n     */\n    const [eventsplugin] = this.getPluginsByType(PluginTypes.EVENTS);\n    const dataSourceplugins = this.getPluginsByType(PluginTypes.DATA_SOURCE);\n    dataSourceplugins.forEach((pluginInstance) => {\n      pluginInstance.register().forEach(({ listenOn, emitOn, callback }) => {\n        eventsplugin.register(listenOn, emitOn, callback);\n      });\n    });\n  }\n\n  /**\n   * The `applyFilters()` method is responsible for transforming event-related\n   * payloads before they are provided as arguments to the corresponding callback\n   * functions.\n   *\n   * In cases where the Core instance contains one or more `FILTER`-type plugins,\n   * each plugin's `filter()` method will be invoked with the payload data as its\n   * sole argument. In these cases, the `FILTER`-type plugins will be applied in\n   * the same order that they were provided at Core instantiation time.\n   *\n   * If the Core instance does not include any `FILTER`-type plugins, the event\n   * payload will not be modified.\n   */\n  applyFilters(listenOn, emitOn, data) {\n    const filters = this.getPluginsByType(PluginTypes.FILTER);\n    const payload = { listenOn, emitOn, data };\n    return filters.length\n      ? filters.reduce((acc, filter) => {\n        return acc.done ? acc : filter.filter(acc)\n      }, payload)\n      : payload;\n  }\n\n  /**\n   * The `instantiatePlugins()` method is responsible for instantiating each\n   * plugin received by Core via the options object. In order to resolve\n   * dependencies, plugin classes are sorted prior to instantiation.\n   *\n   * This method also defines an array of plugin types, which are extracted\n   * from the plugin classes themselves. This array is passed to the underlying\n   * `instantiatePlugin()` method.\n   */\n  instantiatePlugins(plugins) {\n    const pluginTypes = this.getPluginTypes(plugins);\n    return this.sortPluginsByType(plugins).map((plugin) => {\n      return this.instantiatePlugin(plugin, pluginTypes);\n    });\n  }\n\n  /** The `instantiatePlugin()` method is responsible for instantiating a\n   * single plugin, which it receives alongside an array of valid plugin types.\n   */\n  instantiatePlugin(plugin, types = []) {\n    const isArr = Array.isArray(plugin);\n    const mod = isArr ? plugin[0] : plugin;\n    const modOpts = isArr ? plugin[1] : undefined;\n\n    const deps = mod.DEPENDENCIES;\n\n    const missing = deps.filter((dep) => types.length && types.indexOf(dep) === -1);\n    if (missing.length) throw new Error(`Missing the following dependencies: ${missing.join('; ')}`);\n\n    return new mod(this, modOpts);\n  }\n\n  /**\n   * The `getPluginTypes()` utility method extracts the plugin type from each plugin\n   * provided via the `plugins` array.\n   */\n  getPluginTypes(plugins) {\n    return plugins.map((plugin) => plugin.TYPE).filter((type, i, arr) => i === arr.indexOf(type));\n  }\n\n  /**\n   * The `getPluginsByType()` utility method returns all plugins that have been instantiated,\n   * and which match the type provided.\n   */\n  getPluginsByType(type) {\n    return this.plugins.filter((plugin) => plugin.constructor.TYPE === type);\n  }\n\n  /**\n   * The `sortPluginsByType()` utility method returns an array of plugins sorted by type.\n   * The sorting criteria is defined by the `ORDER` property of the Core class.\n   */\n  sortPluginsByType(plugins) {\n    return plugins.slice(0).sort((a, b) => {\n      // TODO: Refactor.\n      const aIndex = Core.ORDER.indexOf(a.TYPE);\n      const bIndex = Core.ORDER.indexOf(b.TYPE);\n      return aIndex - bIndex;\n    });\n  }\n}\n\nmodule.exports = Core;\n\n\n//# sourceURL=webpack:///./src/core/core.js?");

/***/ }),

/***/ "./src/core/index.js":
/*!***************************!*\
  !*** ./src/core/index.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = {\n  ...__webpack_require__(/*! ./utils */ \"./src/core/utils.js\"),\n  Core: __webpack_require__(/*! ./core */ \"./src/core/core.js\"),\n  Plugins: __webpack_require__(/*! ./plugins */ \"./src/core/plugins/index.js\"),\n};\n\n\n//# sourceURL=webpack:///./src/core/index.js?");

/***/ }),

/***/ "./src/core/plugins/abstract.js":
/*!**************************************!*\
  !*** ./src/core/plugins/abstract.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * The `AbstractPlugin` class provides the foundation for all plugin-type\n * classes. This class defines default values for a series of class and\n * instance properties, exposes common/shared methods, and specifies default\n * instantiation behaviour via the constructor method.\n */\nclass AbstractPlugin {\n  static get DEPENDENCIES() {\n    return [];\n  }\n\n  static get DEFAULTS() {\n    return {};\n  }\n\n  constructor(core, opts = {}) {\n    this.core = core;\n    this.settings = this.resolveSettings(opts, AbstractPlugin.DEFAULTS);\n  }\n\n  resolveSettings(options = {}, defaults = {}) {\n    return Object.assign({}, defaults, options);\n  }\n}\n\nmodule.exports = AbstractPlugin;\n\n\n//# sourceURL=webpack:///./src/core/plugins/abstract.js?");

/***/ }),

/***/ "./src/core/plugins/filter.js":
/*!************************************!*\
  !*** ./src/core/plugins/filter.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { PluginTypes } = __webpack_require__(/*! ../utils */ \"./src/core/utils.js\");\nconst AbstractPlugin = __webpack_require__(/*! ./abstract */ \"./src/core/plugins/abstract.js\");\n\n/**\n * The `AbstractFilterPlugin` class provides the foundation for all `FILTER`-type\n * plugin classes. This class defines the `TYPE` static method, and a minimal\n * implementation of the `filter()` method (which is required by all `FILTER`-type\n * plugin classes).\n */\nclass AbstractFilterPlugin extends AbstractPlugin {\n  static get TYPE() {\n    return PluginTypes.FILTER;\n  }\n\n  filter() {\n    throw new Error('FILTER-type plugins must implement the `#filter()` method.');\n  }\n}\n\nmodule.exports = AbstractFilterPlugin;\n\n\n//# sourceURL=webpack:///./src/core/plugins/filter.js?");

/***/ }),

/***/ "./src/core/plugins/index.js":
/*!***********************************!*\
  !*** ./src/core/plugins/index.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = {\n  AbstractFilterPlugin: __webpack_require__(/*! ./filter */ \"./src/core/plugins/filter.js\"),\n  AbstractPlugin: __webpack_require__(/*! ./abstract */ \"./src/core/plugins/abstract.js\"),\n};\n\n\n//# sourceURL=webpack:///./src/core/plugins/index.js?");

/***/ }),

/***/ "./src/core/utils.js":
/*!***************************!*\
  !*** ./src/core/utils.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * `PluginTypes` is a dictionary of plugin type strings. The dictionary's\n * keys are plain-terms type identifiers. The dictionary's values include\n * a namespace ('sfx'), a 'key type' identifier ('plugin'), and a 'kebab case'\n * version of the corresponding key (eg. 'cache', 'data-source', etc.).\n *\n * This dictionary is imported and used by plugins in order to define their\n * types.\n */\nconst PluginTypes = {\n  CACHE: 'sfx:plugin:cache',\n  DATA_SOURCE: 'sfx:plugin:data-source',\n  EVENTS: 'sfx:plugin:events',\n  FILTER: 'sfx:plugin:filter',\n};\n\n/**\n * `Events` is a dictionary of event strings. The dictionary's keys\n * are plain-terms event names. The dictionary's values include a\n * namespace ('sfx'), an 'event namespace' (eg. 'products'), and an\n * 'event action' (eg. 'fetch', 'supply').\n *\n * This dictionary is imported and used by both plugins and components.\n */\nconst Events = {\n  PRODUCTS_FETCH: 'sfx:products:fetch',\n  PRODUCTS_SUPPLY: 'sfx:products:supply',\n};\n\nmodule.exports = {\n  Events,\n  PluginTypes,\n};\n\n\n//# sourceURL=webpack:///./src/core/utils.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * This file represents the entry point for the Webpack process, the output\n * of which is a JavaScript artifact that is loaded via a <script> tag.\n */\n\n/**\n * First we import the Core module, the plugins, and our dictionary of\n * Web Component classes.\n */\nconst { Core } = __webpack_require__(/*! ./core */ \"./src/core/index.js\");\nconst DataSource = __webpack_require__(/*! ./plugins/data-source */ \"./src/plugins/data-source/index.js\");\nconst Events = __webpack_require__(/*! ./plugins/events */ \"./src/plugins/events/index.js\");\nconst Filter = __webpack_require__(/*! ./plugins/filter */ \"./src/plugins/filter/index.js\");\nconst Cache = __webpack_require__(/*! ./plugins/cache */ \"./src/plugins/cache/index.js\");\nconst { Components }  = __webpack_require__(/*! ./ui */ \"./src/ui/index.js\");\n\n/**\n * Since the demo page will be responsible for registering each of the\n * Web Components, we expose the dictionary as a property of the `window`\n * object.\n */\nwindow.__COMPONENTS__ = Components;\n\n/**\n * Here we create a new instance of the Core class, passing in an options object,\n * that contains our plugin classes. We also expose the Core instance via the\n * `__CORE__` property of the `window` object.\n *\n * For plugins that do not require configuration options, the plugin class is\n * sufficient. In cases where a plugin either requires or accepts configuration\n * options, these may be provided using an array-types structure. In this case,\n * Core expects the first member of the array to be the plugin class, and the\n * second member to be an options object.\n */\nconst core = window.__CORE__ = new Core({\n  plugins: [\n    [\n      DataSource,\n      {\n        alsoListenOn: [{ listenOn: 'bar', emitOn: 'baz', callback: () => 'quux' }],\n      },\n    ],\n    Events,\n    Filter,\n    Cache,\n  ],\n});\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/plugins/cache/index.js":
/*!************************************!*\
  !*** ./src/plugins/cache/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { PluginTypes } = __webpack_require__(/*! ../../core */ \"./src/core/index.js\");\nconst { AbstractPlugin } = __webpack_require__(/*! ../../core/plugins */ \"./src/core/plugins/index.js\");\n\nclass Cache extends AbstractPlugin {\n  static get TYPE() {\n    return PluginTypes.CACHE;\n  }\n\n  constructor(...args) {\n    super(...args);\n\n    this.cache = {};\n  }\n\n  get(key) {\n    const k = this.normalizeKey(key);\n    const { payload } = this.cache[k] || {};\n    return payload;\n  }\n\n  put(key, value) {\n    const k = this.normalizeKey(key);\n    this.cache[k] = { expiresAt: new Date().getTime() + 10000, payload: value };\n  }\n\n  has(key) {\n    const k = this.normalizeKey(key);\n    return this.cache[k] && this.cache[k].expiresAt >= new Date().getTime();\n  }\n\n  normalizeKey(key) {\n    return JSON.stringify(key);\n  }\n}\n\nmodule.exports = Cache;\n\n\n//# sourceURL=webpack:///./src/plugins/cache/index.js?");

/***/ }),

/***/ "./src/plugins/data-source/index.js":
/*!******************************************!*\
  !*** ./src/plugins/data-source/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { Events, PluginTypes } = __webpack_require__(/*! ../../core */ \"./src/core/index.js\");\nconst { AbstractPlugin } = __webpack_require__(/*! ../../core/plugins */ \"./src/core/plugins/index.js\");\n\nclass Api {\n  fetch(data) {\n    return window.fetch('https://cvshealth-cors.groupbycloud.com/api/v1/search', {\n      method: 'POST',\n      body: JSON.stringify({\n        ...data,\n        collection: 'productsLeaf',\n      }),\n    })\n      .then((response) => response.json());\n  }\n}\n\nclass DataSource extends AbstractPlugin {\n  static get TYPE() {\n    return PluginTypes.DATA_SOURCE;\n  }\n\n  static get DEPENDENCIES() {\n    return [PluginTypes.EVENTS];\n  }\n\n  static get DEFAULTS() {\n    return {\n      alsoListenOn: [],\n      onlyListenOn: [],\n    };\n  }\n\n  constructor(core, opts = {}) {\n    super(core, opts);\n\n    this.settings = this.resolveSettings(opts, DataSource.DEFAULTS);\n    this.api = new Api();\n  }\n\n  register() {\n    return this.settings.onlyListenOn.length\n      ? this.settings.onlyListenOn\n      : [\n          { listenOn: Events.PRODUCTS_FETCH, emitOn: Events.PRODUCTS_SUPPLY, callback: { fn: this.fetch, context: this } },\n          ...this.settings.alsoListenOn,\n      ];\n  }\n\n  fetch(data) {\n    return new Promise((resolve, reject) => {\n      return this.api.fetch(data)\n        .then(resolve, reject);\n    });\n  }\n}\n\nmodule.exports = DataSource;\n\n\n//# sourceURL=webpack:///./src/plugins/data-source/index.js?");

/***/ }),

/***/ "./src/plugins/events/index.js":
/*!*************************************!*\
  !*** ./src/plugins/events/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { PluginTypes } = __webpack_require__(/*! ../../core */ \"./src/core/index.js\");\nconst { AbstractPlugin } = __webpack_require__(/*! ../../core/plugins */ \"./src/core/plugins/index.js\");\n\nclass Events extends AbstractPlugin {\n  static get TYPE() {\n    return PluginTypes.EVENTS;\n  }\n\n  register(listenOn, emitOn, callback) {\n    const [cache] = this.core.getPluginsByType(PluginTypes.CACHE);\n\n    window.addEventListener(listenOn, (e) => {\n      try {\n        const { detail } = e;\n        const key = [listenOn, detail];\n        const result = cache && cache.has(key)\n          ? cache.get(key)\n          : typeof callback === 'function'\n            ? callback(detail)\n            : callback.fn.call(callback.context, detail);\n\n        const fn = (data) => {\n          const filteredData = this.core.applyFilters(listenOn, emitOn, data);\n          (cache && cache.put(key, data));\n          this.dispatch(filteredData);\n        };\n\n        result instanceof Promise\n          ? result.then(fn)\n          : fn(result);\n      } catch (e) {\n        // TODO: Dispatch error-type event.\n        console.error(e);\n      }\n    });\n  }\n\n  dispatch(payload) {\n    const { emitOn, data } = payload;\n    window.dispatchEvent(new window.CustomEvent(emitOn, { detail: payload }));\n  }\n}\n\nmodule.exports = Events;\n\n\n//# sourceURL=webpack:///./src/plugins/events/index.js?");

/***/ }),

/***/ "./src/plugins/filter/index.js":
/*!*************************************!*\
  !*** ./src/plugins/filter/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { Events } = __webpack_require__(/*! ../../core */ \"./src/core/index.js\");\nconst { AbstractFilterPlugin } = __webpack_require__(/*! ../../core/plugins */ \"./src/core/plugins/index.js\");\n\nclass Filter extends AbstractFilterPlugin {\n  filter(payload) {\n    const { emitOn, data } = payload;\n\n    switch (emitOn) {\n      case Events.PRODUCTS_SUPPLY: return { ...payload, data: this.transformResponse(data) };\n      default: return payload;\n    }\n  }\n\n  transformResponse(data) {\n    return {\n      ...data,\n      records: data.records.map((record) => {\n        return {\n          ...record,\n          allMeta: {\n            ...record.allMeta,\n            title: record.allMeta.title.toUpperCase(),\n          },\n        };\n      }),\n    };\n  }\n}\n\nmodule.exports = Filter;\n\n\n//# sourceURL=webpack:///./src/plugins/filter/index.js?");

/***/ }),

/***/ "./src/ui/components/index.js":
/*!************************************!*\
  !*** ./src/ui/components/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = {\n  Products: __webpack_require__(/*! ./products */ \"./src/ui/components/products/index.js\"),\n  SearchBox: __webpack_require__(/*! ./search-box */ \"./src/ui/components/search-box/index.js\"),\n};\n\n\n//# sourceURL=webpack:///./src/ui/components/index.js?");

/***/ }),

/***/ "./src/ui/components/products/index.js":
/*!*********************************************!*\
  !*** ./src/ui/components/products/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { Events } = __webpack_require__(/*! ../../../core */ \"./src/core/index.js\");\n\nconst template = document.createElement('template');\ntemplate.innerHTML = `\n  <section></section>\n`;\n\nclass Products extends HTMLElement {\n  constructor() {\n    super();\n\n    this.root = this.attachShadow({ mode: 'open' });\n    this.root.appendChild(template.content.cloneNode(true));\n\n    // Bind.\n    this.updateProducts = this.updateProducts.bind(this);\n  }\n\n  connectedCallback() {\n    window.addEventListener(Events.PRODUCTS_SUPPLY, this.updateProducts);\n  }\n\n  disconnectedCallback() {\n    window.removeEventListener(Events.PRODUCTS_SUPPLY, this.updateProducts);\n  }\n\n  updateProducts(e) {\n    const target = this.root.querySelector('section');\n    target.innerHTML = '';\n    e.detail.data.records.forEach((product) => {\n      target.appendChild(this.renderProduct(product));\n    });\n  }\n\n  renderProduct(product) {\n    const elem = document.createElement('p');\n    elem.innerHTML = product.allMeta.title;\n    return elem;\n  }\n}\n\nmodule.exports = Products;\n\n\n//# sourceURL=webpack:///./src/ui/components/products/index.js?");

/***/ }),

/***/ "./src/ui/components/search-box/index.js":
/*!***********************************************!*\
  !*** ./src/ui/components/search-box/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { Events } = __webpack_require__(/*! ../../../core */ \"./src/core/index.js\");\n\nconst template = document.createElement('template');\ntemplate.innerHTML = `\n  <input type=\"text\" />\n`;\n\nclass SearchBox extends HTMLElement {\n  constructor() {\n    super();\n\n    this.root = this.attachShadow({ mode: 'open' });\n    this.root.appendChild(template.content.cloneNode(true));\n\n    // Bind.\n    this.search = this.search.bind(this);\n  }\n\n  connectedCallback() {\n    this.root.querySelector('input').addEventListener('keyup', this.search);\n  }\n\n  disconnectedCallback() {\n    this.root.querySelector('input').removeEventListener('keyup', this.search);\n  }\n\n  search() {\n    const query = this.root.querySelector('input').value;\n    if (query && query.length >= 3) window.dispatchEvent(new CustomEvent(Events.PRODUCTS_FETCH, { detail: { query } }));\n  }\n}\n\nmodule.exports = SearchBox;\n\n\n//# sourceURL=webpack:///./src/ui/components/search-box/index.js?");

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
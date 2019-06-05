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

eval("const { PluginTypes } = __webpack_require__(/*! ./utils */ \"./src/core/utils.js\");\n\nclass Core {\n  static get ORDER() {\n    return [\n      'FILTER',\n      'DATA_SOURCE',\n      'EVENTS',\n    ];\n  }\n\n  constructor(opts = {}) {\n    const { modules = [] } = opts;\n\n    // Instantiate modules.\n    this.modules = this.instantiateModules(modules);\n\n    // Register event listeners.\n    const [eventsModules] = this.getModulesByType(PluginTypes.EVENTS);\n    const dataSourceModules = this.getModulesByType(PluginTypes.DATA_SOURCE);\n    dataSourceModules.forEach((moduleInstance) => {\n      moduleInstance.register().forEach(({ listenOn, emitOn, callback }) => {\n        eventsModules.register(listenOn, emitOn, callback);\n      });\n    });\n  }\n\n  hasCache(key) {\n    const [cache] = this.getModulesByType(PluginTypes.CACHE);\n    if (cache) return cache.has(key);\n  }\n\n  getCache(key) {\n    const [cache] = this.getModulesByType(PluginTypes.CACHE);\n    if (cache) return cache.get(key);\n  }\n\n  putCache(key, value) {\n    const [cache] = this.getModulesByType(PluginTypes.CACHE);\n    if (cache) return cache.put(key, value);\n  }\n\n  applyFilters(listenOn, emitOn, data) {\n    const filters = this.getModulesByType(PluginTypes.FILTER);\n    const payload = { listenOn, emitOn, data };\n    return filters.length\n      ? filters.reduce((acc, filter) => {\n        return acc.done ? acc : filter.filter(acc)\n      }, payload)\n      : payload;\n  }\n\n  instantiateModules(modules) {\n    const moduleTypes = this.getModuleTypes(modules);\n    return this.sortModulesByType(modules).map((module) => {\n      return this.instantiateModule(module, moduleTypes);\n    });\n  }\n\n  instantiateModule(module, types = []) {\n    const isArr = Array.isArray(module);\n    const mod = isArr ? module[0] : module;\n    const modOpts = isArr ? module[1] : undefined;\n\n    const deps = mod.DEPENDENCIES;\n\n    const missing = deps.filter((dep) => types.length && types.indexOf(dep) === -1);\n    if (missing.length) throw new Error(`Missing the following dependencies: ${missing.join('; ')}`);\n\n    return new mod(this, modOpts);\n  }\n\n  getModuleTypes(modules) {\n    return modules.map((module) => module.TYPE).filter((type, i, arr) => i === arr.indexOf(type));\n  }\n\n  getModulesByType(type) {\n    return this.modules.filter((module) => module.constructor.TYPE === type);\n  }\n\n  sortModulesByType(modules) {\n    return modules.slice(0).sort((a, b) => {\n      // TODO: Refactor.\n      const aIndex = Core.ORDER.indexOf(a.TYPE);\n      const bIndex = Core.ORDER.indexOf(b.TYPE);\n      return aIndex - bIndex;\n    });\n  }\n}\n\nmodule.exports = Core;\n\n\n//# sourceURL=webpack:///./src/core/core.js?");

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

eval("class AbstractPlugin {\n  static get DEPENDENCIES() {\n    return [];\n  }\n\n  static get DEFAULTS() {\n    return {};\n  }\n\n  constructor(core, opts = {}) {\n    this.core = core;\n    this.settings = this.resolveSettings(opts, AbstractPlugin.DEFAULTS);\n  }\n\n  resolveSettings(options = {}, defaults = {}) {\n    return Object.assign({}, defaults, options);\n  }\n}\n\nmodule.exports = AbstractPlugin;\n\n\n//# sourceURL=webpack:///./src/core/plugins/abstract.js?");

/***/ }),

/***/ "./src/core/plugins/filter.js":
/*!************************************!*\
  !*** ./src/core/plugins/filter.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { PluginTypes } = __webpack_require__(/*! ../utils */ \"./src/core/utils.js\");\nconst AbstractPlugin = __webpack_require__(/*! ./abstract */ \"./src/core/plugins/abstract.js\");\n\nclass AbstractFilterPlugin extends AbstractPlugin {\n  static get TYPE() {\n    return PluginTypes.FILTER;\n  }\n\n  filter() {\n    throw new Error('FILTER-type plugins must implement the `#filter()` method.');\n  }\n}\n\nmodule.exports = AbstractFilterPlugin;\n\n\n//# sourceURL=webpack:///./src/core/plugins/filter.js?");

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

eval("const PluginTypes = {\n  CACHE: 'sfx:plugin:cache',\n  DATA_SOURCE: 'sfx:plugin:data-source',\n  EVENTS: 'sfx:plugin:events',\n  FILTER: 'sfx:plugin:filter',\n};\n\nconst Events = {\n  PRODUCTS_FETCH: 'sfx:products:fetch',\n  PRODUCTS_SUPPLY: 'sfx:products:supply',\n};\n\nmodule.exports = {\n  Events,\n  PluginTypes,\n};\n\n\n//# sourceURL=webpack:///./src/core/utils.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * First we import the Core and plugin-type modules.\n */\nconst { Core } = __webpack_require__(/*! ./core */ \"./src/core/index.js\");\nconst DataSource = __webpack_require__(/*! ./plugins/data-source */ \"./src/plugins/data-source/index.js\");\nconst Events = __webpack_require__(/*! ./plugins/events */ \"./src/plugins/events/index.js\");\nconst Filter = __webpack_require__(/*! ./plugins/filter */ \"./src/plugins/filter/index.js\");\nconst Cache = __webpack_require__(/*! ./plugins/cache */ \"./src/plugins/cache/index.js\");\n\n/**\n * Then we import and expose our dictionary of Web Components.\n */\nconst Components = window.__COMPONENTS__ = __webpack_require__(/*! ./ui */ \"./src/ui/index.js\").Components;\n\n/**\n * After importing our plugin classes, we create a new instance of the Core class,\n * passing in an options object that contains the DataSource, Events, Filter,\n * and Cache plugins.\n *\n * We also expose the Core instance via the `__CORE__` property of the `window`\n * object.\n */\nconst core = window.__CORE__ = new Core({\n  modules: [\n    [\n      DataSource,\n      {\n        alsoListenOn: [{ listenOn: 'bar', emitOn: 'baz', callback: () => 'quux' }],\n      },\n    ],\n    Events,\n    Filter,\n    Cache,\n  ],\n});\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/plugins/cache/index.js":
/*!************************************!*\
  !*** ./src/plugins/cache/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { PluginTypes } = __webpack_require__(/*! ../../core */ \"./src/core/index.js\");\nconst { AbstractPlugin } = __webpack_require__(/*! ../../core/plugins */ \"./src/core/plugins/index.js\");\n\nclass Cache extends AbstractPlugin {\n  static get TYPE() {\n    return PluginTypes.CACHE;\n  }\n\n  constructor(...args) {\n    super(...args);\n\n    this.cache = {};\n  }\n\n  get(key) {\n    const { payload } = this.cache[key] || {};\n    return payload;\n  }\n\n  put(key, value) {\n    this.cache[key] = { expiresAt: new Date().getTime() + 10000, payload: value };\n  }\n\n  has(key) {\n    return this.cache[key] && this.cache[key].expiresAt >= new Date().getTime();\n  }\n}\n\nmodule.exports = Cache;\n\n\n//# sourceURL=webpack:///./src/plugins/cache/index.js?");

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

eval("const { PluginTypes } = __webpack_require__(/*! ../../core */ \"./src/core/index.js\");\nconst { AbstractPlugin } = __webpack_require__(/*! ../../core/plugins */ \"./src/core/plugins/index.js\");\n\nclass Events extends AbstractPlugin {\n  static get TYPE() {\n    return PluginTypes.EVENTS;\n  }\n\n  register(listenOn, emitOn, callback) {\n    window.addEventListener(listenOn, (e) => {\n      try {\n        const { detail } = e;\n        const result = this.core.hasCache(listenOn)\n          ? this.core.getCache(listenOn)\n          : typeof callback === 'function'\n            ? callback(detail)\n            : callback.fn.call(callback.context, detail);\n\n        result instanceof Promise\n          ? result.then((data) => this.dispatch(this.core.applyFilters(listenOn, emitOn, data)))\n          : this.dispatch(this.core.applyFilters(listenOn, emitOn, result));\n      } catch (e) {\n        // TODO: Dispatch error-type event.\n        console.error(e);\n      }\n    });\n  }\n\n  dispatch(payload) {\n    const { listenOn, emitOn, data } = payload;\n    this.core.putCache(listenOn, data);\n    window.dispatchEvent(new window.CustomEvent(emitOn, { detail: payload }));\n  }\n}\n\nmodule.exports = Events;\n\n\n//# sourceURL=webpack:///./src/plugins/events/index.js?");

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
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

/***/ "./src/core/index.js":
/*!***************************!*\
  !*** ./src/core/index.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class Core {\n  static get ORDER() {\n    return [\n      'FILTER',\n      'DATA_SOURCE',\n      'EVENTS',\n    ];\n  }\n\n  constructor(opts = {}) {\n    const { modules = [] } = opts;\n\n    // Instantiate modules.\n    this.modules = this.instantiateModules(modules);\n\n    // Register event listeners.\n    const [eventsModules] = this.getModulesByType('EVENTS');\n    const dataSourceModules = this.getModulesByType('DATA_SOURCE');\n    dataSourceModules.forEach((moduleInstance) => {\n      moduleInstance.register().forEach(({ listenOn, emitOn, callback }) => {\n        eventsModules.register(listenOn, emitOn, callback);\n      });\n    });\n  }\n\n  hasCache(key) {\n    const [cache] = this.getModulesByType('CACHE');\n    if (cache) return cache.has(key);\n  }\n\n  getCache(key) {\n    const [cache] = this.getModulesByType('CACHE');\n    if (cache) return cache.get(key);\n  }\n\n  putCache(key, value) {\n    const [cache] = this.getModulesByType('CACHE');\n    if (cache) return cache.put(key, value);\n  }\n\n  applyFilters(listenOn, emitOn, data) {\n    const filters = this.getModulesByType('FILTER');\n    const payload = { listenOn, emitOn, data };\n    return filters.length\n      ? filters.reduce((acc, filter) => {\n        return acc.done ? acc : filter.filter(acc)\n      }, payload)\n      : payload;\n  }\n\n  instantiateModules(modules) {\n    const moduleTypes = this.getModuleTypes(modules);\n    return this.sortModulesByType(modules).map((module) => {\n      return this.instantiateModule(module, moduleTypes);\n    });\n  }\n\n  instantiateModule(module, types = []) {\n    const isArr = Array.isArray(module);\n    const mod = isArr ? module[0] : module;\n    const modOpts = isArr ? module[1] : undefined;\n\n    const deps = mod.DEPENDENCIES;\n\n    const missing = deps.filter((dep) => types.length && types.indexOf(dep) === -1);\n    if (missing.length) throw new Error(`Missing the following dependencies: ${missing.join('; ')}`);\n\n    return new mod(this, modOpts);\n  }\n\n  getModuleTypes(modules) {\n    return modules.map((module) => module.TYPE).filter((type, i, arr) => i === arr.indexOf(type));\n  }\n\n  getModulesByType(type) {\n    return this.modules.filter((module) => module.constructor.TYPE === type);\n  }\n\n  sortModulesByType(modules) {\n    return modules.slice(0).sort((a, b) => {\n      // TODO: Refactor.\n      const aIndex = Core.ORDER.indexOf(a.TYPE);\n      const bIndex = Core.ORDER.indexOf(b.TYPE);\n      return aIndex - bIndex;\n    });\n  }\n}\n\nmodule.exports = Core;\n\n\n//# sourceURL=webpack:///./src/core/index.js?");

/***/ }),

/***/ "./src/core/plugins/filter.js":
/*!************************************!*\
  !*** ./src/core/plugins/filter.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const AbstractPlugin = __webpack_require__(/*! . */ \"./src/core/plugins/index.js\");\n\nclass AbstractFilterPlugin extends AbstractPlugin {\n  static get TYPE() {\n    return 'FILTER';\n  }\n\n  filter() {\n    throw new Error('FILTER-type plugins must implement the `#filter()` method.');\n  }\n}\n\nmodule.exports = AbstractFilterPlugin;\n\n\n//# sourceURL=webpack:///./src/core/plugins/filter.js?");

/***/ }),

/***/ "./src/core/plugins/index.js":
/*!***********************************!*\
  !*** ./src/core/plugins/index.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class AbstractPlugin {\n  static get DEPENDENCIES() {\n    return [];\n  }\n\n  static get DEFAULTS() {\n    return {};\n  }\n\n  constructor(core, opts = {}) {\n    this.core = core;\n    this.settings = this.resolveSettings(opts, AbstractPlugin.DEFAULTS);\n  }\n\n  resolveSettings(options = {}, defaults = {}) {\n    return Object.assign({}, defaults, options);\n  }\n}\n\nmodule.exports = AbstractPlugin;\n\n\n//# sourceURL=webpack:///./src/core/plugins/index.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * First we import the Core and plugin-type modules.\n */\nconst Core = __webpack_require__(/*! ./core */ \"./src/core/index.js\");\nconst DataSource = __webpack_require__(/*! ./plugins/data-source */ \"./src/plugins/data-source/index.js\");\nconst Events = __webpack_require__(/*! ./plugins/events */ \"./src/plugins/events/index.js\");\nconst Filter = __webpack_require__(/*! ./plugins/filter */ \"./src/plugins/filter/index.js\");\nconst Cache = __webpack_require__(/*! ./plugins/cache */ \"./src/plugins/cache/index.js\");\n\n/**\n * After importing our plugin classes, we create a new instance of the Core class,\n * passing in an options object that contains the DataSource, Events, Filter,\n * and Cache plugins.\n *\n * We also expose the Core instance via the `__CORE__` property of the `window`\n * object.\n */\nconst core = window.__CORE__ = new Core({\n  modules: [\n    [\n      DataSource,\n      {\n        alsoListenOn: [{ listenOn: 'bar', emitOn: 'baz', callback: () => 'quux' }],\n      },\n    ],\n    Events,\n    Filter,\n    Cache,\n  ],\n});\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/plugins/cache/index.js":
/*!************************************!*\
  !*** ./src/plugins/cache/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const AbstractPlugin = __webpack_require__(/*! ../../core/plugins */ \"./src/core/plugins/index.js\");\n\nclass Cache extends AbstractPlugin {\n  static get TYPE() {\n    return 'CACHE';\n  }\n\n  constructor(...args) {\n    super(...args);\n\n    this.cache = {};\n  }\n\n  get(key) {\n    const { payload } = this.cache[key] || {};\n    return payload;\n  }\n\n  put(key, value) {\n    this.cache[key] = { expiresAt: new Date().getTime() + 10000, payload: value };\n  }\n\n  has(key) {\n    return this.cache[key] && this.cache[key].expiresAt >= new Date().getTime();\n  }\n}\n\nmodule.exports = Cache;\n\n\n//# sourceURL=webpack:///./src/plugins/cache/index.js?");

/***/ }),

/***/ "./src/plugins/data-source/index.js":
/*!******************************************!*\
  !*** ./src/plugins/data-source/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const AbstractPlugin = __webpack_require__(/*! ../../core/plugins */ \"./src/core/plugins/index.js\");\n\nclass Api {\n  fetch(data) {\n    // TEMP\n    return window.fetch('https://cvshealth-cors.groupbycloud.com/api/v1/search', {\n      method: 'POST',\n      body: JSON.stringify({\n        collection: 'productsLeaf',\n      }),\n    })\n      .then((response) => response.json());\n  }\n}\n\nclass DataSource extends AbstractPlugin {\n  static get TYPE() {\n    return 'DATA_SOURCE';\n  }\n\n  static get DEPENDENCIES() {\n    return ['EVENTS'];\n  }\n\n  static get DEFAULTS() {\n    return {\n      alsoListenOn: [],\n      onlyListenOn: [],\n    };\n  }\n\n  constructor(core, opts = {}) {\n    super(core, opts);\n\n    this.settings = this.resolveSettings(opts, DataSource.DEFAULTS);\n    this.api = new Api();\n  }\n\n  register() {\n    return this.settings.onlyListenOn.length\n      ? this.settings.onlyListenOn\n      : [\n          { listenOn: 'products:fetch', emitOn: 'products:supply', callback: { fn: this.fetch, context: this } },\n          ...this.settings.alsoListenOn,\n      ];\n  }\n\n  fetch(data) {\n    return new Promise((resolve, reject) => {\n      return this.api.fetch(data)\n        .then(resolve, reject);\n    });\n  }\n}\n\nmodule.exports = DataSource;\n\n\n//# sourceURL=webpack:///./src/plugins/data-source/index.js?");

/***/ }),

/***/ "./src/plugins/events/index.js":
/*!*************************************!*\
  !*** ./src/plugins/events/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const AbstractPlugin = __webpack_require__(/*! ../../core/plugins */ \"./src/core/plugins/index.js\");\n\nclass Events extends AbstractPlugin {\n  static get TYPE() {\n    return 'EVENTS';\n  }\n\n  register(listenOn, emitOn, callback) {\n    window.addEventListener(listenOn, (e) => {\n      try {\n        const { detail } = e;\n        const result = this.core.hasCache(listenOn)\n          ? this.core.getCache(listenOn)\n          : typeof callback === 'function'\n            ? callback(detail)\n            : callback.fn.call(callback.context, detail);\n\n        result instanceof Promise\n          ? result.then((data) => this.dispatch(this.core.applyFilters(listenOn, emitOn, data)))\n          : this.dispatch(this.core.applyFilters(listenOn, emitOn, result));\n      } catch (e) {\n        // TODO: Dispatch error-type event.\n        console.error(e);\n      }\n    });\n  }\n\n  dispatch(payload) {\n    const { listenOn, emitOn, data } = payload;\n    this.core.putCache(listenOn, data);\n    window.dispatchEvent(new window.CustomEvent(emitOn, { detail: payload }));\n  }\n}\n\nmodule.exports = Events;\n\n\n//# sourceURL=webpack:///./src/plugins/events/index.js?");

/***/ }),

/***/ "./src/plugins/filter/index.js":
/*!*************************************!*\
  !*** ./src/plugins/filter/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const AbstractFilterPlugin = __webpack_require__(/*! ../../core/plugins/filter */ \"./src/core/plugins/filter.js\");\n\nclass Filter extends AbstractFilterPlugin {\n  filter(payload) {\n    const { emitOn, data } = payload;\n    return emitOn === 'quux'\n      ? { ...payload, data: data.toUpperCase() }\n      : payload;\n  }\n}\n\nmodule.exports = Filter;\n\n\n//# sourceURL=webpack:///./src/plugins/filter/index.js?");

/***/ })

/******/ });
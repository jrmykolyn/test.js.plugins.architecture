/**
 * This file represents the entry point for the Webpack process, the output
 * of which is a JavaScript artifact that is loaded via a <script> tag.
 */

/**
 * First we import the Core module, the plugins, and our dictionary of
 * Web Component classes.
 */
const { Core, Events: EventsDict } = require('./core');
const DataSource = require('./plugins/data-source');
const Events = require('./plugins/events');
const Filter = require('./plugins/filter');
const Cache = require('./plugins/cache');
const { Components }  = require('./ui');

/**
 * Since the demo page will be responsible for registering each of the
 * Web Components, we expose the dictionary as a property of the `window`
 * object.
 */
window.__COMPONENTS__ = Components;

/**
 * Here we create a new instance of the Core class, passing in an options object,
 * that contains our plugin classes. We also expose the Core instance via the
 * `__CORE__` property of the `window` object.
 *
 * For plugins that do not require configuration options, the plugin class is
 * sufficient. In cases where a plugin either requires or accepts configuration
 * options, these may be provided using an array-types structure. In this case,
 * Core expects the first member of the array to be the plugin class, and the
 * second member to be an options object.
 */
const core = window.__CORE__ = new Core({
  plugins: [
    [
      DataSource,
      {
        alsoListenOn: [{ listenOn: EventsDict.PRODUCTS_FETCH, emitOn: EventsDict.SAYT_DISMISS , callback: () => true }],
      },
    ],
    Events,
    Filter,
    Cache,
  ],
});

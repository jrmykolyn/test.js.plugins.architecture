/**
 * This file represents the entry point for the Webpack process, the output
 * of which is a JavaScript artifact. This artifact is consumed by the sample/
 * demo application, which lives within the public/ directory.
 */

/**
 * First we import the Core module, as well as a dictionary of event identifiers.
 */
const { Core, Events: EventsDict } = require('./core');

/**
 * Then we import our plugin classes, which we'll provide to Core at instantiation
 * time via an options object.
 */
const DataSource = require('./plugins/data-source');
const Events = require('./plugins/events');
const Filter = require('./plugins/filter');
const Cache = require('./plugins/cache');
const Logger = require('./plugins/logger');

/** Our final import is a dictionary of Web Components classes. Since the demo
 * application will be responsible for registering each of the Web Components, we
 * make the classes available by exposing them as property of the `window` object.
 */
const { Components }  = require('./ui');
window.__COMPONENTS__ = Components;

/**
 * Finally we create a new instance of the Core class, passing in an options object
 * that contains our plugin classes. We also expose the Core instance via the
 * `__CORE__` property of the `window` object.
 *
 * For cases where a plugin does not require configuration options, providing the
 * plugin class is sufficient.
 *
 * For cases where a plugin either requires (or accepts) configuration options,
 * these may be provided using an array-type structure. In this case, Core expects
 * the first member of the array to be the plugin class, and the second member to
 * be an options object.
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
    Logger,
  ],
});

/**
 * First we import the Core and plugin-type modules.
 */
const Core = require('./core');
const DataSource = require('./plugins/data-source');
const Events = require('./plugins/events');
const Filter = require('./plugins/filter');
const Cache = require('./plugins/cache');

/**
 * Then we import and expose our dictionary of Web Components.
 */
const Components = window.__COMPONENTS__ = require('./ui').Components;

/**
 * After importing our plugin classes, we create a new instance of the Core class,
 * passing in an options object that contains the DataSource, Events, Filter,
 * and Cache plugins.
 *
 * We also expose the Core instance via the `__CORE__` property of the `window`
 * object.
 */
const core = window.__CORE__ = new Core({
  modules: [
    [
      DataSource,
      {
        alsoListenOn: [{ listenOn: 'bar', emitOn: 'baz', callback: () => 'quux' }],
      },
    ],
    Events,
    Filter,
    Cache,
  ],
});

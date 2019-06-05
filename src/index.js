/**
 * Here we mock the event-related `window` methods so that we can listen on
 * and dispatch events on the server.
 */
global.window = {
  __lib__: {},
  addEventListener: (eventName, callback) => {
    global.window.__lib__[eventName] = global.window.__lib__[eventName] || [];
    global.window.__lib__[eventName].push(callback);
  },
  dispatchEvent: (eventName, data) => {
    global.window.__lib__[eventName] = global.window.__lib__[eventName] || [];
    global.window.__lib__[eventName].forEach((callback) => callback(data));
  },
  CustomEvent: function(data = {}) {
    return data;
  },
};

/**
 * Then we import the Core and plugin-type modules.
 */
const Core = require('./core');
const DataSource = require('./plugins/data-source');
const Events = require('./plugins/events');
const Filter = require('./plugins/filter');
const Cache = require('./plugins/cache');

/**
 * After importing our plugin classes, we create a new instance of the Core class,
 * passing in an options object that contains the DataSource, Events, Filter,
 * and Cache plugins.
 */
const core = new Core({
  modules: [
    [
      DataSource,
      {
        alsoListenOn: [{ listenOn: 'bar', emitOn: 'baz', callback: () => 'quux' }],
        onlyListenOn: [{ listenOn: 'baz', emitOn: 'quux', callback: () => 'Hello, world!' }],
      },
    ],
    Events,
    Filter,
    Cache,
  ],
});

/**
 * `PluginTypes` is a dictionary of plugin type strings. The dictionary's
 * keys are plain-terms type identifiers. The dictionary's values include
 * a namespace ('sfx'), a 'key type' identifier ('plugin'), and a 'kebab case'
 * version of the corresponding key (eg. 'cache', 'data-source', etc.).
 *
 * This dictionary is imported and used by plugins in order to define their
 * types.
 */
const PluginTypes = {
  CACHE: 'sfx:plugin:cache',
  DATA_SOURCE: 'sfx:plugin:data-source',
  EVENTS: 'sfx:plugin:events',
  FILTER: 'sfx:plugin:filter',
};

/**
 * `Events` is a dictionary of event strings. The dictionary's keys
 * are plain-terms event names. The dictionary's values include a
 * namespace ('sfx'), an 'event namespace' (eg. 'products'), and an
 * 'event action' (eg. 'fetch', 'supply').
 *
 * This dictionary is imported and used by both plugins and components.
 */
const Events = {
  PRODUCTS_FETCH: 'sfx:products:fetch',
  PRODUCTS_SUPPLY: 'sfx:products:supply',
  SAYT_DISMISS: 'sfx:sayt:dismiss',
  SAYT_PRODUCTS_FETCH: 'sfx:sayt-products:fetch',
  SAYT_PRODUCTS_SUPPLY: 'sfx:sayt-products:supply',
};

module.exports = {
  Events,
  PluginTypes,
};

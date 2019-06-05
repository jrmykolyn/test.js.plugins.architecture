const PluginTypes = {
  CACHE: 'sfx:plugin:cache',
  DATA_SOURCE: 'sfx:plugin:data-source',
  EVENTS: 'sfx:plugin:events',
  FILTER: 'sfx:plugin:filter',
};

const Events = {
  PRODUCTS_FETCH: 'sfx:products:fetch',
  PRODUCTS_SUPPLY: 'sfx:products:supply',
};

module.exports = {
  Events,
  PluginTypes,
};

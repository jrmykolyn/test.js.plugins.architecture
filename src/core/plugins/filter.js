const { PluginTypes } = require('../utils');
const AbstractPlugin = require('./abstract');

class AbstractFilterPlugin extends AbstractPlugin {
  static get TYPE() {
    return PluginTypes.FILTER;
  }

  filter() {
    throw new Error('FILTER-type plugins must implement the `#filter()` method.');
  }
}

module.exports = AbstractFilterPlugin;

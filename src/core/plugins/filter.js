const { PluginTypes } = require('../utils');
const AbstractPlugin = require('./abstract');

/**
 * The `AbstractFilterPlugin` class provides the foundation for all `FILTER`-type
 * plugin classes. This class defines the `TYPE` static method, and a minimal
 * implementation of the `filter()` method (which is required by all `FILTER`-type
 * plugin classes).
 */
class AbstractFilterPlugin extends AbstractPlugin {
 get TYPE() {
    return PluginTypes.FILTER;
  }

  filter() {
    throw new Error('FILTER-type plugins must implement the `#filter()` method.');
  }
}

module.exports = AbstractFilterPlugin;

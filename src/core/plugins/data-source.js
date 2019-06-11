const { PluginTypes } = require('../utils');
const AbstractPlugin = require('./abstract');

/**
 * The `AbstractDataSourcePlugin` class provides the foundation for all `DATA_SOURCE`-type
 * plugin classes. This class defines the `TYPE` instance property, as well as a series of
 * utility methods.
 */
class AbstractDataSourcePlugin extends AbstractPlugin {
 get TYPE() {
    return PluginTypes.DATA_SOURCE;
  }

  constructor(core, opts = {}) {
    super(core, opts);
    this.ingestApi(opts);
  }

  ingestApi(opts = {}) {
    const { api } = opts;
    if (!api) throw new Error('Whoops, DATA_SOURCE-type plugins must receive an `api` at instantiation time');
    this.api = new api();
  }
}

module.exports = AbstractDataSourcePlugin;

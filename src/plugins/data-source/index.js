const AbstractPlugin = require('../../core/plugin');

class DataSource extends AbstractPlugin {
  static get TYPE() {
    return 'DATA_SOURCE';
  }
}

module.exports = DataSource;

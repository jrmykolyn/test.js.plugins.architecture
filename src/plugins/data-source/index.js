const AbstractPlugin = require('../../core/plugin');

class DataSource extends AbstractPlugin {
  static get TYPE() {
    return 'DATA_SOURCE';
  }

  static get DEPENDENCIES() {
    return ['EVENTS'];
  }
}

module.exports = DataSource;

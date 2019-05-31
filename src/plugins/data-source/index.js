const AbstractPlugin = require('../../core/plugin');

class DataSource extends AbstractPlugin {
  static get TYPE() {
    return 'DATA_SOURCE';
  }

  static get DEPENDENCIES() {
    return ['EVENTS'];
  }

  constructor(opts = {}) {
    super();

    this.opts = opts;
  }

  register() {
    return [
      { listenOn: 'foo', emitOn: 'bar', callback: this.fetch },
    ];
  }

  fetch() {
    // TODO
  }
}

module.exports = DataSource;

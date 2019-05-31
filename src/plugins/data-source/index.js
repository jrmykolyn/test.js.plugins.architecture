const AbstractPlugin = require('../../core/plugin');

class DataSource extends AbstractPlugin {
  static get TYPE() {
    return 'DATA_SOURCE';
  }

  static get DEPENDENCIES() {
    return ['EVENTS'];
  }

  static get DEFAULTS() {
    return {
      alsoListenOn: [],
    };
  }

  constructor(opts = {}) {
    super();

    this.settings = this.resolveSettings(opts, DataSource.DEFAULTS);
  }

  register() {
    return [
      { listenOn: 'foo', emitOn: 'bar', callback: this.fetch },
      ...this.settings.alsoListenOn,
    ];
  }

  fetch() {
    // TODO
  }
}

module.exports = DataSource;

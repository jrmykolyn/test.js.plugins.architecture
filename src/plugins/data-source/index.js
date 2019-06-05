const AbstractPlugin = require('../../core/plugins');

class Api {
  fetch() {
    // TEMP
    return window.fetch('https://cvshealth-cors.groupbycloud.com/api/v1/search', {
      method: 'POST',
      body: JSON.stringify({
        collection: 'productsLeaf',
      }),
    })
      .then((response) => response.json());
  }
}

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
      onlyListenOn: [],
    };
  }

  constructor(core, opts = {}) {
    super(core, opts);

    this.settings = this.resolveSettings(opts, DataSource.DEFAULTS);
    this.api = new Api();
  }

  register() {
    return this.settings.onlyListenOn.length
      ? this.settings.onlyListenOn
      : [{ listenOn: 'foo', emitOn: 'bar', callback: this.fetch }, ...this.settings.alsoListenOn];
  }

  fetch() {
    return new Promise((resolve, reject) => {
      return this.api.fetch()
        .then(resolve, reject);
    });
  }
}

module.exports = DataSource;

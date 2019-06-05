const AbstractPlugin = require('../../core/plugins');

class Api {
  fetch(data) {
    return window.fetch('https://cvshealth-cors.groupbycloud.com/api/v1/search', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
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
      : [
          { listenOn: 'products:fetch', emitOn: 'products:supply', callback: { fn: this.fetch, context: this } },
          ...this.settings.alsoListenOn,
      ];
  }

  fetch(data) {
    return new Promise((resolve, reject) => {
      return this.api.fetch(data)
        .then(resolve, reject);
    });
  }
}

module.exports = DataSource;

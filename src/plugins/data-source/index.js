const { Events, PluginTypes } = require('../../core');
const { AbstractPlugin } = require('../../core/plugins');

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
 get TYPE() {
    return PluginTypes.DATA_SOURCE;
  }

 get NAME() {
    return 'DataSource';
  }

 get DEPENDENCIES() {
    return [{ type: PluginTypes.EVENTS, key: 'Events' }];
  }

 get DEFAULTS() {
    return {
      alsoListenOn: [],
      onlyListenOn: [],
    };
  }

  constructor(core, opts = {}) {
    super(core, opts);

    this.api = new Api();
  }

  init(deps) {
    this.deps = deps;
  }

  afterInit() {
    this.register().forEach(({ listenOn, emitOn, callback }) => {
      this.deps.Events.register(listenOn, emitOn, callback);
    });
  }

  register() {
    return this.settings.onlyListenOn.length
      ? this.settings.onlyListenOn
      : [
          { listenOn: Events.PRODUCTS_FETCH, emitOn: Events.PRODUCTS_SUPPLY, callback: { fn: this.fetch, context: this } },
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

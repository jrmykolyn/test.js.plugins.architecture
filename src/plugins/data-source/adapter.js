const { Events, PluginTypes } = require('../../core');
const { AbstractDataSourcePlugin } = require('../../core/plugins');
const { Api } = require('./api');

class DataSource extends AbstractDataSourcePlugin {
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
          { listenOn: Events.PAGE_SET, emitOn: Events.PRODUCTS_SUPPLY, callback: { fn: this.fetch, context: this } },
          { listenOn: Events.PRODUCTS_FETCH, emitOn: Events.PRODUCTS_SUPPLY, callback: { fn: this.fetch, context: this } },
          { listenOn: Events.SAYT_PRODUCTS_FETCH, emitOn: Events.SAYT_PRODUCTS_SUPPLY, callback: { fn: this.fetchSaytProducts, context: this } },
          ...this.settings.alsoListenOn,
      ];
  }

  fetch(data) {
    // TEMP: Hard-code `pageSize`.
    const pageSize = 20;
    const { page = 1, ...rest } = data;
    const payload = { ...rest, pageSize, skip: pageSize * (page - 1) };
    return new Promise((resolve, reject) => {
      return this.api.fetch(payload)
        .then(resolve, reject);
    });
  }

  fetchSaytProducts(data) {
    // TODO: Update method to return distinct data.
    return new Promise((resolve, reject) => {
      return this.api.fetch(data)
        .then(resolve, reject);
    });
  }
}

module.exports = DataSource;

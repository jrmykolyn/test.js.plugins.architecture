const { PluginTypes } = require('../../core');
const { AbstractPlugin } = require('../../core/plugins');

class Cache extends AbstractPlugin {
 get TYPE() {
    return PluginTypes.CACHE;
  }

 get NAME() {
    return 'Cache';
  }

  get OPTIONAL() {
    return [{ type: PluginTypes.LOGGER, key: 'Logger' }];
  }

  constructor(...args) {
    super(...args);

    this.cache = {};
  }

  get(key) {
    const k = this.normalizeKey(key);

    this.deps.Logger.log(`[${this.NAME}] Retrieving data at key`, k);

    const { payload } = this.cache[k] || {};
    return payload;
  }

  put(key, value) {
    this.deps.Logger.log(`[${this.NAME}] Inserting data at key`, value, key);
    const k = this.normalizeKey(key);
    this.cache[k] = { expiresAt: new Date().getTime() + 10000, payload: value };
  }

  has(key) {
    const k = this.normalizeKey(key);

    this.deps.Logger.log(`[${this.NAME}] Checking for the presence of data at key`, key);

    return this.cache[k] && this.cache[k].expiresAt >= new Date().getTime();
  }

  normalizeKey(key) {
    return JSON.stringify(key);
  }
}

module.exports = Cache;

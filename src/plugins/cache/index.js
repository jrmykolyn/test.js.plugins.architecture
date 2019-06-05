const { PluginTypes } = require('../../core');
const { AbstractPlugin } = require('../../core/plugins');

class Cache extends AbstractPlugin {
  static get TYPE() {
    return PluginTypes.CACHE;
  }

  constructor(...args) {
    super(...args);

    this.cache = {};
  }

  get(key) {
    const k = this.normalizeKey(key);
    const { payload } = this.cache[k] || {};
    return payload;
  }

  put(key, value) {
    const k = this.normalizeKey(key);
    this.cache[k] = { expiresAt: new Date().getTime() + 10000, payload: value };
  }

  has(key) {
    const k = this.normalizeKey(key);
    return this.cache[k] && this.cache[k].expiresAt >= new Date().getTime();
  }

  normalizeKey(key) {
    return JSON.stringify(key);
  }
}

module.exports = Cache;

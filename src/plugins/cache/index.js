const { AbstractPlugin } = require('../../core/plugins');

class Cache extends AbstractPlugin {
  static get TYPE() {
    return 'CACHE';
  }

  constructor(...args) {
    super(...args);

    this.cache = {};
  }

  get(key) {
    const { payload } = this.cache[key] || {};
    return payload;
  }

  put(key, value) {
    this.cache[key] = { expiresAt: new Date().getTime() + 10000, payload: value };
  }

  has(key) {
    return this.cache[key] && this.cache[key].expiresAt >= new Date().getTime();
  }
}

module.exports = Cache;

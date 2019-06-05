const AbstractPlugin = require('../../core/plugins');

class Cache extends AbstractPlugin {
  static get TYPE() {
    return 'CACHE';
  }

  constructor(...args) {
    super(...args);

    this.cache = {};
  }

  get(payload) {
    const { listenOn, data } = payload;

    if (!this.has(payload)) this.put(payload);

    return this.cache[listenOn].payload;
  }

  put(payload) {
    const { listenOn } = payload;
    this.cache[listenOn] = { expiresAt: new Date().getTime() + 10000, payload };
  }

  has(payload) {
    const { listenOn } = payload;
    return !this.cache[listenOn] || this.cache[listenOn].expiresAt < new Date().getTime();
  }
}

module.exports = Cache;

const { PluginTypes } = require('../../core');
const { AbstractPlugin } = require('../../core/plugins');

class Events extends AbstractPlugin {
  static get TYPE() {
    return PluginTypes.EVENTS;
  }

  register(listenOn, emitOn, callback) {
    const [cache] = this.core.getPluginsByType(PluginTypes.CACHE);

    window.addEventListener(listenOn, (e) => {
      try {
        const { detail } = e;
        const key = [listenOn, detail];
        const result = cache && cache.has(key)
          ? cache.get(key)
          : typeof callback === 'function'
            ? callback(detail)
            : callback.fn.call(callback.context, detail);

        const fn = (data) => {
          const filteredData = this.core.applyFilters(listenOn, emitOn, data);
          (cache && cache.put(key, data));
          this.dispatch(filteredData);
        };

        result instanceof Promise
          ? result.then(fn)
          : fn(result);
      } catch (e) {
        // TODO: Dispatch error-type event.
        console.error(e);
      }
    });
  }

  dispatch(payload) {
    const { emitOn, data } = payload;
    window.dispatchEvent(new window.CustomEvent(emitOn, { detail: payload }));
  }
}

module.exports = Events;

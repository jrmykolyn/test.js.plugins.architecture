const { PluginTypes } = require('../../core');
const { AbstractPlugin } = require('../../core/plugins');

class Events extends AbstractPlugin {
 get TYPE() {
    return PluginTypes.EVENTS;
  }

 get NAME() {
    return 'Events';
  }

 get OPTIONAL() {
    return [{ type: PluginTypes.CACHE, key: 'Cache' }];
  }

  register(listenOn, emitOn, callback) {
    window.addEventListener(listenOn, (e) => {
      try {
        const { detail } = e;
        const key = [listenOn, detail];
        const result = this.deps.Cache.has(key)
          ? this.deps.Cache.get(key)
          : typeof callback === 'function'
            ? callback(detail)
            : callback.fn.call(callback.context, detail);

        const fn = (data) => {
          const filteredData = this.core.applyFilters(listenOn, emitOn, data);
          this.deps.Cache.put(key, data);
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

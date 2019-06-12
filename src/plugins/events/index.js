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
    return [
      { type: PluginTypes.CACHE, key: 'Cache' },
      { type: PluginTypes.LOGGER, key: 'Logger' },
      { type: PluginTypes.FILTER_MANAGER, key: 'FilterManager' },
    ];
  }

  register(listenOn, emitOn, callback) {
    window.addEventListener(listenOn, (e) => {
      this.deps.Logger.log(`[${this.NAME}] Handling event`, listenOn)
      try {
        const { detail } = e;
        const key = [listenOn, detail];
        const result = this.deps.Cache.has(key)
          ? this.deps.Cache.get(key)
          : typeof callback === 'function'
            ? callback(detail)
            : callback.fn.call(callback.context, detail);

        const fn = (data) => {
          const filteredData = this.deps.FilterManager.applyFilters(data) || data;
          this.deps.Cache.put(key, data);
          this.dispatch({ listenOn, emitOn, data: filteredData });
        };

        result instanceof Promise
          ? result.then(fn)
          : fn(result);
      } catch (e) {
        this.deps.Logger.error(`[${this.NAME}] Encountered error`, e);
        // TODO: Dispatch error-type event.
      }
    });
  }

  dispatch(payload) {
    const { emitOn, data } = payload;
    this.deps.Logger.log(`[${this.NAME}] Emitting event with payload`, emitOn, payload);
    window.dispatchEvent(new window.CustomEvent(emitOn, { detail: payload }));
  }
}

module.exports = Events;

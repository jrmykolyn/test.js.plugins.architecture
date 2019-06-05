const AbstractPlugin = require('../../core/plugins');

class Events extends AbstractPlugin {
  static get TYPE() {
    return 'EVENTS';
  }

  register(listenOn, emitOn, callback) {
    window.addEventListener(listenOn, () => {
      try {
        const result = this.core.hasCache(listenOn)
          ? this.core.getCache(listenOn)
          : typeof callback === 'function'
            ? callback()
            : callback.fn.call(callback.context);

        result instanceof Promise
          ? result.then((data) => this.dispatch(this.core.applyFilters(listenOn, emitOn, data)))
          : this.dispatch(this.core.applyFilters(listenOn, emitOn, result));
      } catch (e) {
        // TODO: Dispatch error-type event.
        console.error(e);
      }
    });
  }

  dispatch(payload) {
    const { listenOn, emitOn, data } = payload;
    this.core.putCache(listenOn, data);
    window.dispatchEvent(new window.CustomEvent(emitOn, { detail: payload }));
  }
}

module.exports = Events;

const AbstractPlugin = require('../../core/plugins');

class Events extends AbstractPlugin {
  static get TYPE() {
    return 'EVENTS';
  }

  register(listenOn, emitOn, callback) {
    window.addEventListener(listenOn, () => {
      try {
        const result = callback();
        result instanceof Promise
          ? result.then((data) => this.dispatch(emitOn, this.core.applyFilters(listenOn, emitOn, result)))
          : this.dispatch(emitOn, this.core.applyFilters(listenOn, emitOn, result));
      } catch (e) {
        // TODO: Dispatch error-type event.
      }
    });
  }

  dispatch(eventName, payload) {
    window.dispatchEvent(eventName, new window.CustomEvent({ detail: payload }));
  }
}

module.exports = Events;

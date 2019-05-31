const AbstractPlugin = require('../../core/plugin');

class Events extends AbstractPlugin {
  static get TYPE() {
    return 'EVENTS';
  }

  register(listenOn, emitOn, callback) {
    window.addEventListener(listenOn, () => {
      try {
        const result = callback();
        result instanceof Promsise
          ? result.then((data) => this.dispatch(emitOn, result))
          : this.dispatch(emitOn, result);
      } catch (e) {
        // TODO: Dispatch error-type event.
      }
    });
  }

  dispatch(eventName, payload) {
    window.dispatchEvent(eventName, new CustomEvent({ detail: payload }));
  }
}

module.exports = Events;

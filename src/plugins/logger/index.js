const { PluginTypes } = require('../../core');
const { AbstractPlugin } = require('../../core/plugins');

class Logger extends AbstractPlugin {
  get TYPE() {
    return PluginTypes.LOGGER;
  }

  get NAME() {
    return 'Logger';
  }

  constructor(core, opts = {}) {
    super(core, opts);

    this.logger = window.console;
    this.methods = ['log'];
    this.methods.forEach((method) => {
      this[method] = (...args) => this.logger[method](...args);
    });
  }

}

module.exports = Logger;

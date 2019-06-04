const AbstractFilterPlugin = require('../../core/plugins/filter');

class Filter extends AbstractFilterPlugin {
  filter(payload) {
    const { emitOn, data } = payload;
    return emitOn === 'quux'
      ? { ...payload, data: data.toUpperCase(), done: true }
      : payload;
  }
}

module.exports = Filter;
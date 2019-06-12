const { AbstractPlugin } = require('../../core/plugins');

class FilterManager extends AbstractPlugin {
  get TYPE() {
    return 'sfx:plugin:filter-manager';
  }

  get NAME() {
    return 'FilterManager';
  }

  constructor(...args) {
    super(...args);

    this.filters = [];
  }

  add(filter) {
    this.filters.push(filter);
  }

  remove(filter) {
    this.filters.filter((f) => f !== filter);
  }

  applyFilters(data) {
    if (!this.filters.length) return data;
    return this.filters.reduce((acc, filter) => filter.filter(data), data);
  }
}

module.exports = FilterManager;

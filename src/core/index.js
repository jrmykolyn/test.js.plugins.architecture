class Core {
  static get ORDER() {
    return [
      'DATA_SOURCE',
      'EVENTS',
    ];
  }

  constructor(opts = {}) {
    const { modules = [] } = opts;

    // Instantiate modules.
    this.modules = this.instantiateModules(modules);

    // Register event listeners.
    const [eventsModules] = this.getModulesByType('EVENTS');
    eventsModules.register('foo', 'bar', () => {
      return 'baz';
    });
  }

  instantiateModules(modules) {
    return this.sortModulesByType(modules).map((module) => {
      return new module();
    });
  }

  getModulesByType(type) {
    return this.modules.filter((module) => module.constructor.TYPE === type);
  }

  sortModulesByType(modules) {
    return modules.slice(0).sort((a, b) => {
      // TODO: Refactor.
      const aIndex = Core.ORDER.indexOf(a.TYPE);
      const bIndex = Core.ORDER.indexOf(b.TYPE);
      return aIndex - bIndex;
    });
  }
}

module.exports = Core;

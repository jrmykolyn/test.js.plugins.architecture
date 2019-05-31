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
    const moduleTypes = this.getModuleTypes(modules);
    return this.sortModulesByType(modules).map((module) => {
      const deps = module.DEPENDENCIES;

      const missing = deps.filter((dep) => moduleTypes.indexOf(dep) === -1);

      if (missing.length) throw new Error(`Missing the following dependencies: ${missing.join('; ')}`);

      return new module();
    });
  }

  getModuleTypes(modules) {
    return modules.map((module) => module.TYPE).filter((type, i, arr) => i === arr.indexOf(type));
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

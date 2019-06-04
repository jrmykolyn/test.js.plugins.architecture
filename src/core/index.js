class Core {
  static get ORDER() {
    return [
      'FILTER',
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
    const dataSourceModules = this.getModulesByType('DATA_SOURCE');
    dataSourceModules.forEach((moduleInstance) => {
      moduleInstance.register().forEach(({ listenOn, emitOn, callback }) => {
        eventsModules.register(listenOn, emitOn, callback);
      });
    });
  }

  applyFilters(listenOn, emitOn, data) {
    const filters = this.getModulesByType('FILTER');
    const payload = { listenOn, emitOn, data };
    return filters.length
      ? filters.reduce((acc, filter) => {
        return acc.done ? acc : filter.filter(acc)
      }, payload)
      : payload;
  }

  instantiateModules(modules) {
    const moduleTypes = this.getModuleTypes(modules);
    return this.sortModulesByType(modules).map((module) => {
      return this.instantiateModule(module, moduleTypes);
    });
  }

  instantiateModule(module, types = []) {
    const isArr = Array.isArray(module);
    const mod = isArr ? module[0] : module;
    const modOpts = isArr ? module[1] : undefined;

    const deps = mod.DEPENDENCIES;

    const missing = deps.filter((dep) => types.length && types.indexOf(dep) === -1);
    if (missing.length) throw new Error(`Missing the following dependencies: ${missing.join('; ')}`);

    return new mod(this, modOpts);
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

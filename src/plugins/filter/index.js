const { Events, PluginTypes } = require('../../core');
const { AbstractFilterPlugin } = require('../../core/plugins');

class Filter extends AbstractFilterPlugin {
  get NAME() {
    return 'Filter';
  }

  get DEPENDENCIES() {
    return [{ type: PluginTypes.FILTER_MANAGER, key: 'FilterManager' }];
  }

  afterInit() {
    this.deps.FilterManager.add(this);
  }

  filter(data) {
    if (!data || !data.records) return data;
    return this.transformResponse(data);
  }

  transformResponse(data) {
    const { records, ...rest } = data;

    return {
      ...rest,
      records: records.map((record) => ({
        ...record,
        allMeta: {
          ...record.allMeta,
          title: record.allMeta.title.toUpperCase(),
        },
      })),
    };
  }
}

module.exports = Filter;

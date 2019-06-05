const { Events } = require('../../core');
const { AbstractFilterPlugin } = require('../../core/plugins');

class Filter extends AbstractFilterPlugin {
  filter(payload) {
    const { emitOn, data } = payload;

    switch (emitOn) {
      case Events.PRODUCTS_SUPPLY: return { ...payload, data: this.transformResponse(data) };
      default: return payload;
    }
  }

  transformResponse(data) {
    return {
      ...data,
      records: data.records.map((record) => {
        return {
          ...record,
          allMeta: {
            ...record.allMeta,
            title: record.allMeta.title.toUpperCase(),
          },
        };
      }),
    };
  }
}

module.exports = Filter;

const interpolate = (tmpl, data = {}) => {
  return Object.keys(data).reduce((str, key) => {
    const pattern = new RegExp(`{{ ${key} }}`, 'gmi');
    return str.replace(pattern, data[key]);
  }, tmpl);
};

module.exports = {
  interpolate,
};

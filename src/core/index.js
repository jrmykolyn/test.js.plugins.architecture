/**
 * This file acts as a manifest, in that it makes the contents of
 * the core/ directory importable via a central location.
 *
 * As a result, consumers of the Logic layer may import the Core
 * class in either of the following ways:
 * - `const Core = require('./core/core');`
 * - `const Core = require('./core');`
 */
module.exports = {
  ...require('./utils'),
  Core: require('./core'),
  Plugins: require('./plugins'),
};

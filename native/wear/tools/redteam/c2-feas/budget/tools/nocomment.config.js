// Wraps Huawei's lite webpack config; only change: babel-loader drops comments (comments: false).
const base = require(process.env.XACE + '/webpack.lite.config.js');
module.exports = (env) => {
  const cfg = base(env);
  for (const r of cfg.module.rules) for (const u of [].concat(r.use || [])) {
    if (u && u.options && u.options.presets) u.options.comments = false;
  }
  return cfg;
};

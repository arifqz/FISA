const sveltePreprocess = require('svelte-preprocess');

module.exports = {
  preprocess: sveltePreprocess(),
  compilerOptions: {
    customElement: true
  },
  emitCss: true,
  onwarn: (warning, handler) => {
    const { code } = warning;
    if (code === "a11y-missing-attribute") return;
    handler(warning);
  }
};
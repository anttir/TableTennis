module.exports = {
  plugins: [
    { src: "~/plugins/paho-mqtt.js", ssr: false },
    { src: "~plugins/ga.js", ssr: false }
  ],
  modules: [
    { src: "bootstrap-vue/nuxt" },
    // // Or if you have custom bootstrap CSS...
    // ['bootstrap-vue/nuxt', { css: false }],
  ]
};

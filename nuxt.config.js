module.exports = {
    plugins: [{
            src: '~/plugins/paho-mqtt.js',
            ssr: false
        }
    ],
    modules: [
        'bootstrap-vue/nuxt',
        // // Or if you have custom bootstrap CSS...
        // ['bootstrap-vue/nuxt', { css: false }],
      ]
};
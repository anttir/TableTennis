module.exports = {
    plugins: [{
            src: '~/plugins/paho-mqtt.js',
            ssr: false
        },
        {
            src: '~/plugins/vue-notifications',
            ssr: false
        }
    ]
};
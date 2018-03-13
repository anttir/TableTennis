// Paho MQTT documentation: http://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
import Vue from 'vue'
require('paho-mqtt');
console.log(window.Paho)
const Paho = window.Paho

const config = {
  broker: "m23.cloudmqtt.com",
  port: 38577
}

Paho.install = (vue) => {}
Vue.use(Paho)

export default ({ app }, inject) => {
  app.mqtt = Paho.MQTT
  app.mqtt.config = config
}

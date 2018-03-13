<template>
  <div class="mqttlog" :id="this.id">
      <p v-for="(text, i) in this.texts" :key="i">
            <span class="topic">{{text.topic}}</span>
            <span class="message">{{text.message}}</span>
      </p>
      </div>
</template>
<script>
export default {
  props: {
    texts: {
      type: Array,
      default: () => [{ topic: "-", message: "MQTT log" }]
    }
  },
  data() {
    return {
      id: "i" + Math.random() * 10000
    };
  },

  methods: {
    addText(topic, message) {
      this.texts.push({ topic: topic, message: message });
      var container = this.$el.querySelector("#" + this.id);
      //      container.scrollTop = container.scrollHeight;
      container.animate(
        {
          scrollTop: container.scrollHeight
        },
        200
      );
    },
    clear() {
      this.text = "";
    }
  }

  // $("#mqttlog").append("<p>" + message.destinationName + ":" + message.payloadString + "</p>");
  // $("#mqttlog").animate({
  //     scrollTop: $('#mqttlog').prop("scrollHeight")
  // }, 200);
};
</script>
<style scoped>
.mqttlog {
  height: 200px;
  overflow: auto;
  background-color: beige;
  border: 1px solid burlywood;
}
.mqttlog .topic {
  color: cornflowerblue;
  padding-right: 2em;
}
.mqttlog .message {
  color: blueviolet;
}
.mqttlog p {
  margin: 0.1em;
  font-family: monospace;
  font-size: smaller;
  color: darkslateblue;
}
</style>



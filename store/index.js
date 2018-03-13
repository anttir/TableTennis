import {
  Person,
  Remote,
  Match,
  Player,
  Point,
  guidGenerator
} from "../helpers";

import Vuex from "vuex";

export const state = () => ({
  counter: 0
});

export const mutations = {
  increment(state) {
    state.counter++;
  }
};
/*

export const state = () => ({
    // matches: [],
    // persons: [
    //     new Person(1, "Antti", "red"),
    //     new Person(2, "Toinen", "blue"),
    //     new Person(3, "Kolmas", "green")
    // ],
    // remotes: [new Remote("A", [12890956]), new Remote("B", [12890948])],
})
*/
export const actions = {
  initClient({ dispatch }) {
    /* ---------- Alusta kanta ---------- */
    [
      new Person(1, "Antti", "red", "http://soundbible.com/mp3/Air Plane Ding-SoundBible.com-496729130.mp3"),
      new Person(2, "Toinen", "blue", "http://soundbible.com/mp3/Elevator Ding-SoundBible.com-685385892.mp3"),
      new Person(3, "Kolmas", "green")
    ].forEach(person => {
      this.app.store.commit("people/add", person);
    });
    [new Remote("A", [12890956]), new Remote("B", [12890948])].forEach(
      remote => {
        this.app.store.commit("remotes/add", remote);
      }
    );
    var match = new Match();
    this.app.store.commit("matches/add", match);
    [
      new Player(this.state.people.list[0], this.state.remotes.list[0]),
      new Player(this.state.people.list[1], this.state.remotes.list[1])
    ].forEach(p => {
      this.app.store.commit("matches/addPlayerToMatch", {
        match: match,
        player: p
      });
    });

    /* ---------- Viritä MQTT kuntoon ---------- */
    //console.log(this.app)
    // Create a client instance
    const client = new this.app.mqtt.Client(
      this.app.mqtt.config.broker,
      this.app.mqtt.config.port,
      "web_" + parseInt(Math.random() * 100, 10)
    );

    // set callback handlers
    //client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    var options = {
      useSSL: true,
      userName: "ezbvjyrv",
      password: "hS5ElErtR3eD",
      onSuccess() {
        // Once a connection has been made, make a subscription and send a message.
        console.log("onSuccess");
        client.subscribe("tabletennis/433toMQTT");
        client.send("tabletennis", "Hello CloudMQTT", 0, true);
      },
      onFailure(e) {
        console.log(e);
      }
    };

    // connect the client
    client.connect(options);

    // called when the client loses its connection
    function onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:", responseObject.errorMessage);
      }
    }

    // called when a message arrives
    function onMessageArrived(message) {
      window.$nuxt.$store.dispatch("matches/addPoint", message.payloadString);
      console.log(
        "onMessageArrived:" +
          message.destinationName +
          ":" +
          message.payloadString
      );
      // $("#mqttlog").append("<p>" + message.destinationName + ":" + message.payloadString + "</p>");
      // $("#mqttlog").animate({
      //     scrollTop: $('#mqttlog').prop("scrollHeight")
      // }, 200);

      // dispatch('addPoint', message.payloadString);
    }

    function sendPoint(name, points) {
      client.send(
        "tabletennis",
        JSON.stringify({
          name: name,
          points: points
        }),
        0,
        true
      );
    }
  }
  // addPoint({
  //     commit, state
  // }, RFID) {
  //     RFID = parseInt(RFID);
  //     var tplayer = state.matches[state.matches.length - 1].players.filter(p =>
  //         p.remote.buttonIDs.includes(RFID)
  //     );
  //     if (tplayer.length) {
  //         state.matches[state.matches.length - 1].addPoint(tplayer[0].person.ID);
  //         this.latestPoint = new Date();
  //     }
  // },
  // addMatch({ commit }) {
  //     state.matches.push(new Match());
  // },
  // addPlayer({ commit, state }, player) {
  //     state.matches[state.matches.length - 1].addPlayer(player);
  //     //$('#flipPoints' + player.person.ID).bFlipText({text: '01', css: my_style});
  // },
};

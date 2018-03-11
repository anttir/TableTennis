import {
    Person,
    Remote,
    Match,
    Player,
    Point,
    guidGenerator
} from "../helpers";

import Vuex from 'vuex';

export const state = () => ({
    counter: 0
  });
  
  export const mutations = {
    increment (state) {
      state.counter++;
    }
  }
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
    initClient({
        dispatch
    }) {
        /* ---------- Alusta kanta ---------- */
        this.app.store.commit("matches/add", new Match());


        /* ---------- Viritä MQTT kuntoon ---------- */
        //console.log(this.app)
        // Create a client instance
        const client = new this.app.mqtt.Client(this.app.mqtt.config.broker, this.app.mqtt.config.port, "web_" + parseInt(Math.random() * 100, 10));

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
                client.send('tabletennis', "Hello CloudMQTT", 0, true);
            },
            onFailure(e) {
                console.log(e);
            }
        }

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
            console.log("onMessageArrived:" + message.destinationName + ":" + message.payloadString);
            // $("#mqttlog").append("<p>" + message.destinationName + ":" + message.payloadString + "</p>");
            // $("#mqttlog").animate({
            //     scrollTop: $('#mqttlog').prop("scrollHeight")
            // }, 200);

            // dispatch('addPoint', message.payloadString);
        }

        function sendPoint(name, points) {
            client.send('tabletennis', JSON.stringify({
                name: name,
                points: points
            }), 0, true);
        }
    },
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

}

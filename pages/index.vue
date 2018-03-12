<template>
  <div>
      <b-tabs >
        <b-tab id="topmenu" title="Home" disabled>
          <template slot="title">
            <font-awesome-icon :icon="['fas', 'table-tennis']" style="color:green" size="1x" />
            <span class="title p-3">Table Tennis Scoring</span>
          </template>
        </b-tab>
        <b-tab title="Current match" active>
          <div v-if="currentMatch" class="currentMatch match">
            <div class="row">
              <!-- <div class="col legend">Start time:</div> -->
              <div class="col text-right startTime"><span class="legend">Start time:</span> {{currentMatch.startTime | moment}}</div>
            </div>
            <div class="row players">
                <div class="col player m-3" v-for="(player, i) in currentMatch.players" :key="i">
                    <div>
                        <div class="legend namelegend">Name:</div>
                        <div class="personName text-center" :style="{ color: player.person.color}">{{player.person.name}}</div>
                        <div class="remoteName" v-b-tooltip.hover title="Remote name">{{player.remote.name}}</div>
                    </div>
                    <div class="text-center">
                      <font-awesome-icon icon="minus" class="pointsbutton " size="3x"  v-on:click="addPointToCurrentMatch({rfcode:player.remote.buttonIDs[0], points:-1})" />
                      <b-fliptext :id="'flipPoints' + player.person.ID" :text="player.points.length" style="display: inline-block; vertical-align: middle;" />
                      <font-awesome-icon icon="plus" class="pointsbutton " size="3x" v-on:click="addPointToCurrentMatch({rfcode:player.remote.buttonIDs[0], points:1})" />
                    </div>
                </div>
            </div>
            <div class="text-center">
              <d3__chart
                :layout="layout"
                :chartdata="chartData"
                :axes="axes" />
            </div>
          </div>
          <div v-else>-- No matches -- </div>
        </b-tab>
        <b-tab title="Matches" ><matches /></b-tab>
        <b-tab title="People" ><people /></b-tab>
        <b-tab title="Remotes" ><remotes /></b-tab>
        <b-tab title="Logger"><logger/></b-tab>
      </b-tabs>
 </div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import fontawesome from "@fortawesome/fontawesome";
import faSolids from "@fortawesome/fontawesome-free-solid";
fontawesome.library.add(faSolids);

import moment from "moment";
moment.locale("fi");
import { mapActions, mapGetters, mapMutations } from "vuex";

import * as d3 from "d3";
import d3__chart from "~/components/d3__chart";

import BFliptext from "~/components/b-fliptext";
import Logger from "~/components/logger";
import People from "~/components/people";
import Remotes from "~/components/remotes";
import Matches from "~/components/matches";

import { Person, Remote, Match, Player, Point } from "../helpers";

export default {
  components: {
    d3__chart,
    BFliptext,
    Logger,
    People,
    Matches,
    Remotes,
    FontAwesomeIcon
  },

  data() {
    return {
      layout: {
        width: 800,
        height: 250,
        marginTop: 45,
        marginRight: 50,
        marginBottom: 50,
        marginLeft: 50
      },
      axes: ["left", "bottom", "right"],
      datachart_debug: JSON.parse(`{"players" : [{
        "person": { "ID": 1, "name": "Antti", "color": "red" },
        "points": [ { "timestamp": "2018-03-12T21:07:35.352Z", "playerID": 1, "currPlayerTotal": 1 }, { "timestamp": "2018-03-12T21:08:25.838Z", "playerID": 1, "currPlayerTotal": 2 }, { "timestamp": "2018-03-12T21:08:27.733Z", "playerID": 1, "currPlayerTotal": 3 }, { "timestamp": "2018-03-12T21:08:28.632Z", "playerID": 1, "currPlayerTotal": 4 }, { "timestamp": "2018-03-12T21:08:32.482Z", "playerID": 1, "currPlayerTotal": 5 } ]
        },
        {
        "person": { "ID": 2, "name": "Toinen", "color": "blue" },
        "points": [ { "timestamp": "2018-03-12T21:07:34.346Z", "playerID": 2, "currPlayerTotal": 1 }, { "timestamp": "2018-03-12T21:07:53.344Z", "playerID": 2, "currPlayerTotal": 2 }, { "timestamp": "2018-03-12T21:08:24.973Z", "playerID": 2, "currPlayerTotal": 3 }, { "timestamp": "2018-03-12T21:08:30.184Z", "playerID": 2, "currPlayerTotal": 4 } ]
      }]}`),
      chartData_example: [
        {
          id: "Previous",
          values: [
            { timestamp: 1488319200000, value: 1 },
            { timestamp: 1488405600000, value: 2 },
            { timestamp: 1488492000000, value: 2 },
            { timestamp: 1488578400000, value: 2 },
            { timestamp: 1488664800000, value: 2 },
            { timestamp: 1488751200000, value: 4 },
            { timestamp: 1488837600000, value: 9 },
            { timestamp: 1488924000000, value: 18 },
            { timestamp: 1489010400000, value: 23 },
            { timestamp: 1489096800000, value: 24 },
            { timestamp: 1489183200000, value: 24 },
            { timestamp: 1489269600000, value: 24 },
            { timestamp: 1489356000000, value: 25 },
            { timestamp: 1489442400000, value: 26 },
            { timestamp: 1489528800000, value: 30 },
            { timestamp: 1489615200000, value: 32 },
            { timestamp: 1489701600000, value: 32 },
            { timestamp: 1489788000000, value: 32 },
            { timestamp: 1489874400000, value: 32 },
            { timestamp: 1489960800000, value: 32 },
            { timestamp: 1490047200000, value: 32 },
            { timestamp: 1490133600000, value: 32 },
            { timestamp: 1490220000000, value: 32 },
            { timestamp: 1490306400000, value: 32 },
            { timestamp: 1490392800000, value: 32 },
            { timestamp: 1490479200000, value: 32 },
            { timestamp: 1490562000000, value: 32 },
            { timestamp: 1490648400000, value: 35 },
            { timestamp: 1490734800000, value: 35 },
            { timestamp: 1490821200000, value: 35 },
            { timestamp: 1490907600000, value: 35 }
          ]
        },
        {
          id: "Current",
          values: [
            { timestamp: 1488319200000, value: 3 },
            { timestamp: 1488405600000, value: 6 },
            { timestamp: 1488492000000, value: 6 },
            { timestamp: 1488578400000, value: 6 },
            { timestamp: 1488664800000, value: 6 },
            { timestamp: 1488751200000, value: 6 },
            { timestamp: 1488837600000, value: 7 },
            { timestamp: 1488924000000, value: 14 },
            { timestamp: 1489010400000, value: 16 },
            { timestamp: 1489096800000, value: 16 },
            { timestamp: 1489183200000, value: 16 },
            { timestamp: 1489269600000, value: 16 },
            { timestamp: 1489356000000, value: 18 },
            { timestamp: 1489442400000, value: 19 },
            { timestamp: 1489528800000, value: 21 },
            { timestamp: 1489615200000, value: 23 },
            { timestamp: 1489701600000, value: 23 },
            { timestamp: 1489788000000, value: 23 },
            { timestamp: 1489874400000, value: 23 },
            { timestamp: 1489960800000, value: 23 },
            { timestamp: 1490047200000, value: 25 },
            { timestamp: 1490133600000, value: 26 },
            { timestamp: 1490220000000, value: 28 },
            { timestamp: 1490306400000, value: 29 },
            { timestamp: 1490392800000, value: 29 },
            { timestamp: 1490479200000, value: 29 },
            { timestamp: 1490562000000, value: 29 },
            { timestamp: 1490648400000, value: 29 },
            { timestamp: 1490734800000, value: 29 },
            { timestamp: 1490821200000, value: null },
            { timestamp: 1490907600000, value: null }
          ]
        }
      ]
    };
  },
  computed: {
    matches() {
      return this.$store.state.matches.list;
    },
    people() {
      return this.$store.state.people.list;
    },
    remotes() {
      return this.$store.state.remotes.list;
    },
    chartData() {
      // console.log(this.currentMatch);
      // console.log(this.datachart_debug);
      return this.currentMatch.players.map(player => {
        return {
          id: player.person.name,
          values: [
            {
              timestamp: this.currentMatch.startTime,
              value: 0
            }
          ].concat(
            player.points.map(point => {
              return {
                timestamp: new Date(point.timestamp),
                value: point.currPlayerTotal
              };
            })
          )
        };
      });
    },
    ...mapGetters({ currentMatch: "matches/currentMatch" })
  },
  methods: {
    ...mapActions(["initClient"]),
    ...mapMutations({ addMatch: "matches/add" }),
    ...mapMutations({
      addPointToCurrentMatch: "matches/addPointToCurrentMatch"
    })
  },
  filters: {
    moment: function(date) {
      return moment(date).format("L, LT");
    }
  },
  created: function() {},
  mounted() {
    this.initClient(); // luo kantaan täytettä ja käynnistää MQTT:n
  }
};
</script>

<style scoped>
ul.matches {
  list-style-type: none;
}

.currentMatch .legend {
  font-size: 80%;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  color: rgb(226, 226, 226);
  display: inline;
}
.currentMatch .namelegend {
  position: absolute;
}
.currentMatch .startTime,
.currentMatch .remote {
  display: inline;
}
.currentMatch .player .personName {
  font-family: "Mina", sans-serif;
  font-weight: bold;
  font-size: 10vh;
}
.currentMatch .remoteName {
  /* border: 5px solid #f9f9f9; */
  border-radius: 50%;
  font-weight: bold;
  background-color: whitesmoke;
  padding: 0 0.5em;
  top: 0;
  right: 0%;
  position: absolute;
  text-align: center;
}

li.player {
  cursor: copy;
}

.pointsbutton {
  background-color: whitesmoke;
  border-radius: 50%;
  border: 1px solid lightgrey;
  padding: 0.2em;
  margin: 0 0.5em;
  vertical-align: middle;
}

.chart {
  margin: auto;
}
</style>



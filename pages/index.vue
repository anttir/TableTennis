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
              <div class="col"><span class="legend">Mute: </span><input type="checkbox" id="checkboxMuted" v-model="mute"></div>
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
                      <font-awesome-icon icon="minus" class="pointsbutton " size="3x"  v-on:click="addPoint({rfcode:player.remote.buttonIDs[0], points:-1})" />
                      <b-fliptext :id="'flipPoints' + player.person.ID" :text="player.points.length" style="display: inline-block; vertical-align: middle;" />
                      <font-awesome-icon icon="plus" class="pointsbutton " size="3x" v-on:click="addPoint({rfcode:player.remote.buttonIDs[0], points:1})" />
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
        marginLeft: 35
      },
      axes: ["bottom", "right"],
      mute: true
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
      return this.currentMatch.players.map(player => {
        return {
          id: player.person.name,
          color: player.person.color,
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
    ...mapGetters({ currentMatch: "matches/currentMatch" }),
    ...mapGetters({ latestPoint: "matches/latestPoint" }),
  },
  methods: {
    ...mapActions(["initClient"]),
    ...mapActions({ addPoint: "matches/addPoint" }),
    ...mapMutations({ addMatch: "matches/add" }),
    playSound(sound) {
      if (sound) {
        var audio = new Audio(sound);
        audio.play();
      }
    }
  },
  watch: {
    latestPoint: function dataChanged(newData, oldData) {
      if (!this.mute &&  this.currentMatch.players.length && newData && newData.personID) {
        // muuttujia ei välttämättä ole vielä alustettu
        var sound = this.currentMatch.players.filter(x => x.person.ID == newData.personID)[0]
          .person.sound;
        if (sound) {
          this.playSound(sound);
        }
      }
    }
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



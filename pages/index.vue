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
              <line-chart class="chart":id="'lineChart_' + currentMatch.ID" :match="currentMatch" :ceil="3" />
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

import LineChart from "~/components/linechart";
import BFliptext from "~/components/b-fliptext";
import Logger from "~/components/logger";
import People from "~/components/people";
import Remotes from "~/components/remotes";
import Matches from "~/components/matches";

import { Person, Remote, Match, Player, Point } from "../helpers";

export default {
  components: {
    LineChart,
    BFliptext,
    Logger,
    People,
    Matches,
    Remotes,
    FontAwesomeIcon
  },

  data: function() {
    return {};
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
  margin:auto;
}
</style>



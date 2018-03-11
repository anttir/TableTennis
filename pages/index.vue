<template>
  <div>
      <b-tabs>
        <b-tab title="Current match" active>
          <div class="currentMatch match">
            <div class="row">
              <div class="col legend">Start time:</div>
              <div class="col text-right startTime">{{currentMatch.startTime | moment}}</div>
            </div>
            <div class="row players">
                <div class="col player" v-for="(player, i) in currentMatch.players" :key="i">
                    <div class="personName">
                        <div class="legend namelegend">Name:</div>
                        <div class="name text-center" :style="{ color: player.person.color}">{{player.person.name}}</div>
                    </div>
                    <div class="legend">Remote:</div>
                    <div class="remote">{{player.remote.name}}</div>
                    <div class="text-center">
                      <b-fliptext :id="'flipPoints' + player.person.ID" :text="player.points.length"></b-fliptext>
                    </div>
                    <button v-on:click="addPoint(player.remote.buttonIDs[0])">+</button>
                </div>
            </div>
            <line-chart :id="'lineChart_' + currentMatch.ID" :match="currentMatch" :latestpoint="currentMatch.latestPoint" :currpoints="currentMatch.playerScores"
                :ceil="3"></line-chart>
          </div>
        </b-tab>
        <b-tab title="Matches" >
                <button @click="$store.commit('increment')">{{ $store.state.counter }}</button>

          <ul class="matches">
              <li v-for="(match, i) in matches" :key="i">
                  <ul class="match">
                      <li>Date: {{ match.startTime | moment }}</li>
                      <li>Players: {{ match.playerCount }}</li>
                      <li>Enough players : {{match.enoughPlayers ? "Yes" : "No"}}</li>
                      <li>Players
                          <ul>
                              <li v-for="(player,i) in match.players" :key="i">
                                  <div class="person">{{ player.person }}</div>
                                  <div class="remote">{{ player.remote }}</div>
                                  <div class="remote">{{ player.points }}</div>
                              </li>
                          </ul>
                      </li>
                      <li>Points {{ match.playerScores }} latest: {{ match.latestPoint }}</li>
                      <li>
                          <line-chart :id="'lineChart_' + match.ID" :match="match" :latestpoint="match.latestPoint" :currpoints="match.playerScores"
                              :ceil="3"></line-chart>
                          <!-- <areachart :id="'areaChart_' + match.ID" :data="match.playerScores" :ceil="3"></areachart> -->
                      </li>
                  </ul>
              </li>
          </ul>
          <button v-on:click="addMatch">Add match</button>
          <br>
          <select class="people" v-model="selectedPerson">
              <option v-for="(person, i) in people" :value="person" :key="i">
                  Name: {{ person.name }}
              </option>
          </select>
          <select class="remotes" v-model="selectedRemote">
              <option v-for="(remote, i) in remotes" :value="remote" :key="i">
                  ID: {{ remote.buttonIDs[0] }}
              </option>
          </select>
          <button v-on:click="addSelectedPlayerWithRadio()">Add player</button>
          <br>
          <!-- <button class="btnPoint" data-player="antti" data-points="1">+1</button>
          <button class="btnPoint" data-player="antti" data-points="-1">-1</button> -->        </b-tab>
        <b-tab title="People" >
          <people />
        </b-tab>
        <b-tab title="Remotes" >
          <remotes />
        </b-tab>
        <b-tab title="Logger">
          <logger/>
        </b-tab>
      </b-tabs>
 </div>
</template>

<script>
import moment from "moment";
moment.locale("fi");
import { mapActions } from "vuex";

import LineChart from "~/components/linechart";
import BFliptext from "~/components/b-fliptext";
import Logger from "~/components/logger";
import People from "~/components/people";
import Remotes from "~/components/remotes";

import {
  Person,
  Remote,
  Match,
  Player,
  Point,
  guidGenerator
} from "../helpers";

export default {
  components: { LineChart, BFliptext, Logger, People, Remotes },
  data: function() {
    return {
      matches: [],
      selectedPerson: {}, // uuden henkilön lisäämiseen
      selectedRemote: {}, // uuden henkilön lisäämiseen,
      error: ""
    };
  },
  computed: {
    currentMatch: function() {
      return this.matches[this.matches.length - 1];
    },
    people() {
      return this.$store.state.people.list;
    },
    remotes() {
      return this.$store.state.remotes.list;
    }
  },
  methods: {
    ...mapActions(["initClient"]),
    moment: () => moment(),
    guidGenerator: function() {
      return guidGenerator();
    },
    addMatch: function() {
      this.matches.push(new Match());
    },
    addPlayer: function(player) {
      this.currentMatch.addPlayer(player);
      //$('#flipPoints' + player.person.ID).bFlipText({text: '01', css: my_style});
    },
    addSelectedPlayerWithRadio: function() {
      this.currentMatch.addPlayer(
        new Player(this.selectedPerson, this.selectedRemote)
      );
    },
    addPoint: function(RFID) {
      RFID = parseInt(RFID);
      var tplayer = this.currentMatch.players.filter(p =>
        p.remote.buttonIDs.includes(RFID)
      );
      if (tplayer.length) {
        this.currentMatch.addPoint(tplayer[0].person.ID);
        this.latestPoint = new Date();
      }
    }
  },
  filters: {
    moment: function(date) {
      return moment(date).format("L, LT");
    }
  },
  created: function() {
    this.addMatch();
    this.addPlayer(new Player(this.people[0], this.remotes[0]));
    this.addPlayer(new Player(this.people[1], this.remotes[1]));
  },
  mounted() {
    this.initClient();
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
  color: lightgray;
  display: inline;
}
.currentMatch .namelegend{
  position: absolute;
}
.currentMatch .startTime,
.currentMatch .remote {
  display: inline;
}
/*
.currentMatch .players {
  display: flex;
}

.currentMatch .player {
  flex-grow: 1;
}
*/
.currentMatch .player .personName .name {
  font-family: "Mina", sans-serif;
  font-weight: bold;
  font-size: 10vh;
}

li.player {
  cursor: copy;
}
</style>

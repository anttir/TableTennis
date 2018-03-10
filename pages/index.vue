<template>
  <div>
      <button @click="$store.commit('increment')">{{ $store.state.counter }}</button>
      <ul>
        <li><a href="people/">people</a></li>
        <li><a href="remotes/">remotes</a></li>
        </ul>

        <div id="my_flip"></div>
        <div class="currentMatch match">
            <div class="legend">Start time:</div>
            <div class="startTime">{{currentMatch.startTime | moment}}</div>
            <div class="players">
                <div class="player" v-for="(player, i) in currentMatch.players" :key="i">
                    <div class="personName">
                            <div class="legend">Name:</div>
                        <div class="name" :style="{ color: player.person.color}">{{player.person.name}}</div>
                    </div>
                    <div class="legend">Remote:</div>
                    <div class="remote">{{player.remote.name}}</div>
                    <b-fliptext :id="'flipPoints' + player.person.ID" :text="player.points.length"></b-fliptext>
                    <button v-on:click="addPoint(player.remote.buttonIDs[0])">+</button>
                </div>
            </div>
            <line-chart :id="'lineChart_' + currentMatch.ID" :match="currentMatch" :latestpoint="currentMatch.latestPoint" :currpoints="currentMatch.playerScores"
                :ceil="3"></line-chart>

        </div>
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
        <select class="persons" v-model="selectedPerson">
            <option v-for="(person, i) in persons" :value="person" :key="i">
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
        <button class="btnPoint" data-player="antti" data-points="-1">-1</button> -->
        <logger></logger>

    </div>
</template>

<script>
import moment from "moment";
moment.locale("fi");
import { mapActions } from "vuex";

import LineChart from "~/components/linechart";
import BFliptext from "~/components/b-fliptext";
import Logger from "~/components/logger";

import {
  Person,
  Remote,
  Match,
  Player,
  Point,
  guidGenerator
} from "../helpers";

export default {
  components: { LineChart, BFliptext, Logger },
  data: function() {
    return {
      matches: [],
      persons: [
        new Person(1, "Antti", "red"),
        new Person(2, "Toinen", "blue"),
        new Person(3, "Kolmas", "green")
      ],
      remotes: [new Remote("A", [12890956]), new Remote("B", [12890948])],
      selectedPerson: {}, // uuden henkilön lisäämiseen
      selectedRemote: {}, // uuden henkilön lisäämiseen,
      error: ""
    };
  },
  computed: {
    currentMatch: function() {
      return this.matches[this.matches.length - 1];
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
    this.addPlayer(new Player(this.persons[0], this.remotes[0]));
    this.addPlayer(new Player(this.persons[1], this.remotes[1]));
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

.currentMatch .startTime,
.currentMatch .remote {
  display: inline;
}

.currentMatch .players {
  display: flex;
}

.currentMatch .player {
  flex-grow: 1;
  /* display: inline-block;
            width: 49%; */
}

.currentMatch .player .personName .name {
  font-family: "Mina", sans-serif;
  font-weight: bold;
  font-size: 10vh;
}

li.player {
  cursor: copy;
}
</style>

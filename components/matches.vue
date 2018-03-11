<template>
  <div>
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
                      <!-- <line-chart :id="'lineChart_' + match.ID" :match="match" :latestpoint="match.latestPoint" :currpoints="match.playerScores"
                          :ceil="3"></line-chart> -->
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
      <button class="btnPoint" data-player="antti" data-points="-1">-1</button> -->        
  </div>
</template>
<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import fontawesome from "@fortawesome/fontawesome";
import faSolids from "@fortawesome/fontawesome-free-solid";
fontawesome.library.add(faSolids);

import moment from "moment";
moment.locale("fi");

import { mapActions } from "vuex";
import { mapGetters } from "vuex";

import { Player, Match } from "../helpers/index";

import LineChart from "~/components/linechart";

export default {
  components: {
    LineChart,
    FontAwesomeIcon
  },
  data() {
    return {
      selectedPerson: {}, // uuden henkilön lisäämiseen
      selectedRemote: {}, // uuden henkilön lisäämiseen,
      newPersonName: ""
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
    }
  },
  methods: {
    //moment: () => moment(),
    addMatch() {
      this.$store.commit("matches/add", new Match());
    },
    addSelectedPlayerWithRadio: function() {
      this.$store.commit(
        "matches/addPlayerToCurrent",
        new Player(this.selectedPerson, this.selectedRemote)
      );
    }
  },
  filters: {
    moment: function(date) {
      return moment(date).format("L, LT");
    }
  }
};
</script>
<style scoped>

</style>


<template>
  <div>
      <!-- <button @click="$store.commit('increment')">{{ $store.state.counter }}</button> -->
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
                    <span class="text-danger">LINECHART EI TOIMI TÄSSÄ!</span>
                    <!-- <line-chart :id="'lineChart_' + match.ID" :match="match" :ceil="3" /> -->
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
  </div>
</template>
<script>

import moment from "moment";
moment.locale("fi");

import { mapActions } from "vuex";
import { mapGetters } from "vuex";

import { Player, Match } from "../helpers/index";

import LineChart from "~/components/linechart";

export default {
  components: {
    LineChart,
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


<template>
  <div>
      <!-- <button @click="$store.commit('increment')">{{ $store.state.counter }}</button> -->
      <ul class="matches">
          <li v-for="(match, i) in matches" :key="i">
              <ul class="match">
                  <li>Start time: {{ match.startTime | moment }} <span v-if="match.latestPoint"> - latest point: {{ match.latestPoint.timestamp | moment }}</span></li>
                  <!-- <li>Players: {{ match.playerCount }}</li> -->
                  <!-- <li>Enough players : {{match.enoughPlayers ? "Yes" : "No"}}</li> -->
                  <li>Players
                      <ul>
                          <li v-for="(player,i) in match.players" :key="i">
                              <span class="person">{{ player.person ? player.person.name : "-" }}</span>: 
                              <span class="points">{{ player.points.length }}</span>
                              <!-- <div class="remote">{{ player.remote }}</div>
                              <div class="remote">{{ player.points }}</div> -->
                          </li>
                      </ul>
                  </li>
                  <!-- <li>Points {{ match.playerScores }} latest: {{ match.latestPoint.timestamp | moment }}</li> -->
                  <!-- <li>
                    <d3__chart
                      layout="{ width: 800,        height: 250,        marginTop: 45,        marginRight: 50,        marginBottom: 50,        marginLeft: 35      }"
                      :chartdata="chartData"
                      axes="['bottom', 'right']"
                      xlinear="true" /> 
                  </li> -->
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

import * as d3 from "d3";
import d3__chart from "~/components/d3__chart";

import { mapActions } from "vuex";
import { mapGetters } from "vuex";

import { Player, Match } from "~/helpers/models";

export default {
  components: {
    d3__chart
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
      this.$store.commit("matches/addPlayerToCurrent", {
        player: new Player(this.selectedPerson, this.selectedRemote)
      });
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


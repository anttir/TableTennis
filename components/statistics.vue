<template>
    <div>
        <div v-if='recordsState === "loaded"' >
          <div>
            <label>Formula/data for chart:</label>
            <select v-model="valueToChart">
              <option value="gamesPlayed">gamesPlayed</option>
              <option value="winlose">winlose</option>
              <option value="stealFromLoser">stealFromLoser</option>
              <option value="winCount">winCount</option>
              <option value="looseCount">looseCount</option>
              <option value="winPercentage">winPercentage</option>
              <option value="loosePercentage">loosePercentage</option>
              <option value="pairSum">pairSum</option>
              <option value="pointsTotal">pointsTotal</option>
              <option value="goldenSetsWon">goldenSetsWon</option>
              <option value="goldenSetsLost">goldenSetsLost</option>
            </select>
            <span v-if="valueToChart == 'stealFromLoser'" class="m-2">
              <label>Part of points to steal: </label>
              <input type="number" v-model="settings.percentageTakenFromLoser" size=2 min="0" max="1" step="0.05"  />
            </span>
            <span v-if="valueToChart == 'pairSum'"  class="m-2">
              <label>Max matches included for scoring: </label>
              <input type="number" v-model="settings.maxMatchesIncluded" size=2 min="1" max="100" step="1"  />
                 <label>Old matches with lower weight: </label>
              <select v-model="settings.useMultiplier">
                  <option value="true">true</option>
                  <option value="false">false</option>
              </select>
            </span>
          </div>
          <div>
            <label for="startDate">Start date: </label> <datepicker class="datePicker" v-model="settings.startDate"  :highlighted="{dates:[new Date()], disabled:{from: new Date()}}"  :calendar-button="false" calendar-button-icon="fa fa-calendar-alt" :monday-first="true" />
            <label for="endDate">End date: </label> <datepicker class="datePicker" v-model="settings.endDate" :highlighted="{dates:[new Date()], disabled:{from: new Date()}}" :calendar-button="false" calendar-button-icon="fa fa-calendar-alt"  :monday-first="true"/>
          </div>
          <statistics_pairs :data="stats" :people="people" :scoreField="valueToChart" />
          <!-- {{stats}} -->
          <!-- {{people}}<br> -->
          <!-- {{resulthistory}}, -->
          <!-- {{chartData}} -->
          <!-- {{counter}} -->
          <d3__chart
              :layout="layout"
              :chartdata="chartData"
              :axes="axes"
              :xlinear="xlinear"
              :seriestypes="seriestypes" />
          <b-table v-if='recordsState === "loaded"' striped hover outlined small :items="filteredMathces"  :fields="fields(columns, 5)" @row-clicked="showStats">
            <template slot="start_time" slot-scope="row">
                {{row.item.startTime | moment}}
                <!-- <b-button size="sm" @click.stop="row.toggleDetails" class="mr-2">
                  {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
                </b-button> -->
            </template>
            <template slot="player_1" slot-scope="row">
              <span :class="{'font-weight-bold': row.item.players[0].points.length > row.item.players[1].points.length}">
                {{row.item.players[0].person.name}}
              </span>
            </template>
            <template slot="player_1_score" slot-scope="row">
              <span :class="{'font-weight-bold': row.item.players[0].points.length > row.item.players[1].points.length}">
                {{row.item.players[0].points.length}}
              </span>
            </template>
            <template slot="player_2" slot-scope="row">
              <span :class="{'font-weight-bold': row.item.players[1].points.length > row.item.players[0].points.length}">
                {{row.item.players[1].person.name}}
              </span>
            </template>
            <template slot="player_2_score" slot-scope="row">
              <span :class="{'font-weight-bold': row.item.players[1].points.length > row.item.players[0].points.length}">
                {{row.item.players[1].points.length}}
              </span>
            </template>
            <!-- <template slot="row-details" slot-scope="row">
              <b-card>
                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right"><b>Age:</b></b-col>
                  <b-col>{{ JSON.stringify(row.item) }}</b-col>
                </b-row>
                <b-button size="sm" @click="row.toggleDetails">Hide Details</b-button>
              </b-card>
            </template> -->
          </b-table>
        </div>
    </div>  
</template>
<script>
import { Person, Remote, Match, Player, Point } from "~/helpers/models";
import { mapActions, mapGetters, mapMutations } from "vuex";
import statistics_pairs from "~/components/statistics_pairs";
import d3__chart from "~/components/d3__chart";
import moment from "moment";
import Datepicker from "vuejs-datepicker";
moment.locale("fi");

export default {
  components: {
    d3__chart,
    statistics_pairs,
    Datepicker
  },
  props: {
    matches: { type: Array, default: () => [] },
    recordsState: { type: String, default: "" }
  },
  data() {
    return {
      resulthistory: [],
      counter: 0,
      stats: {},
      settings: {
        maxMatchesIncluded: 10,
        matchIcludedPeriod: 1000 * 60 * 60 * 24 * 30, // 1 kuukausi
        useMultiplier: "true",
        percentageTakenFromLoser: 0.1,
        startDate: moment()
          .add("months", -1)
          .toDate(),
        endDate: moment()
          .add("days", 1)
          .toDate()
      },
      layout: {
        width: 800,
        height: 200,
        marginTop: 45,
        marginRight: 50,
        marginBottom: 50,
        marginLeft: 35
      },
      seriestypes: ["line"], // , 'scatter'
      axes: ["bottom", "right"],
      xlinear: true,
      valueToChart: "pairSum",
      columns: [
        "Start Time",
        "Player 1",
        "Player 1 Score",
        "Player 2",
        "Player 2 Score"
      ]
    };
  },
  methods: {
    showStats(row, index) {
      console.log(row);
    },
    fields(columns, count) {
      if (count) {
        columns = columns.filter((x, i) => i < count);
      }
      return columns.map(c => {
        return {
          key: c.replace(/ /g, "_").toLowerCase(),
          label: c,
          sortable: true
        };
      });
    },
    ...mapActions(["initClient"]),
    updateStats() {
      this.resulthistory = []; //this.resulthistory.splice(0, this.resulthistory.length);
      this.getStats();
    },
    addhistory(value) {
      this.resulthistory.push(value);
    },
    updatePair(accumulator, curr, player1, player2, winlose) {
      if (!accumulator[player1].pairResults[player2])
        accumulator[player1].pairResults[player2] = {};
      if (!accumulator[player1].pairResults[player2].array)
        accumulator[player1].pairResults[player2].array = [];
      var array = accumulator[player1].pairResults[player2].array;
      array.push({
        start: curr.start,
        winlose: winlose
      });
      array = array.slice(-this.settings.maxMatchesIncluded); // vain viimeisimmät mukaan
      for (let i = array.length - 1; (i = 0); i--) {
        if (array[i].start < curr.start - this.settings.matchIcludedPeriod) {
          array.slice(i);
          break;
        }
      }
      var multiplierTotal = 0;
      accumulator[player1].pairResults[player2].array = array;
      var sum = array.reduce((prev, curr, i, array) => {
        var multiplier = 1;
        if (
          this.settings.useMultiplier &&
          this.settings.useMultiplier == "true"
        ) {
          multiplier =
            (this.settings.maxMatchesIncluded - array.length + i + 1) /
            this.settings.maxMatchesIncluded;
        }
        multiplierTotal = multiplierTotal + multiplier;
        if (
          (player1 == "Antti" || player2 == "Antti") &&
          (player1 == "Aapo" || player2 == "Aapo")
        ) {
        }
        return prev + curr.winlose * multiplier;
      }, 0);
      accumulator[player1].pairResults[player2].sum = sum / multiplierTotal;
      return accumulator;
    },
    getpairSum(player) {
      var sumTotal = 0;
      for (var pair in player.pairResults) {
        if (player.pairResults.hasOwnProperty(pair)) {
          sumTotal = sumTotal + player.pairResults[pair].sum;
        }
      }
      return sumTotal;
    },
    getStats() {
      if (!this.people.length) {
        console.log("not ready");
        return;
      }
      var res;
      var initialValue = {};
      this.people.forEach(p => {
        initialValue[p.name] = {};
        initialValue[p.name].gamesPlayed = 0;
        initialValue[p.name].winlose = 0;
        initialValue[p.name].stealFromLoser = 100;
        initialValue[p.name].winCount = 0;
        initialValue[p.name].looseCount = 0;
        initialValue[p.name].winPercentage = 0;
        initialValue[p.name].loosePercentage = 0;
        initialValue[p.name].pairResults = {};
        initialValue[p.name].pairSum = 0;
        initialValue[p.name].pointsTotal = 0;
        initialValue[p.name].goldenSetsWon = 0;
        initialValue[p.name].goldenSetsLost = 0;
      });
      var tmatches = this.filteredMathces.slice(0);
      res = tmatches
        .sort((a, b) => a.startTime - b.startTime)
        .reduce((accumulator, curr, currentIndex, array) => {
          var player_1_score = curr.players[0].points.length;
          var player_2_score = curr.players[1].points.length;
          if (player_1_score != player_2_score) {
            var winner =
              player_1_score > player_2_score
                ? curr.players[0].person.name
                : curr.players[1].person.name;
            var loser =
              player_1_score > player_2_score
                ? curr.players[1].person.name
                : curr.players[0].person.name;
            //   console.log({ winner, loser });
            if (accumulator[winner] && accumulator[loser]) {
              accumulator.time = curr.startTime;
              accumulator[winner].gamesPlayed += 1;
              accumulator[loser].gamesPlayed += 1;
              var winnerPoints = Math.max(player_1_score, player_2_score);
              var loserPoints = Math.min(player_1_score, player_2_score);
              accumulator[winner].pointsTotal += winnerPoints;
              accumulator[loser].pointsTotal += loserPoints;
              if (winnerPoints == 6 && loserPoints == 0) {
                accumulator[winner].goldenSetsWon += 1;
                accumulator[loser].goldenSetsLost += 1;
              }
              accumulator[winner].winlose += 1;
              accumulator[loser].winlose -= 1;
              accumulator[winner].winCount += 1;
              accumulator[loser].looseCount += 1;
              [winner, loser].forEach(player => {
                accumulator[player].winPercentage =
                  accumulator[player].winCount /
                  accumulator[player].gamesPlayed;
                accumulator[player].loosePercentage =
                  accumulator[player].looseCount /
                  accumulator[player].gamesPlayed;
              });
              var scoremoving =
                accumulator[loser].stealFromLoser *
                this.settings.percentageTakenFromLoser;
              accumulator[winner].stealFromLoser += scoremoving;
              accumulator[loser].stealFromLoser -= scoremoving;

              accumulator = this.updatePair(
                accumulator,
                curr,
                winner,
                loser,
                1
              );
              accumulator = this.updatePair(
                accumulator,
                curr,
                loser,
                winner,
                -1
              );
              accumulator[winner].pairSum = this.getpairSum(
                accumulator[winner]
              );
              accumulator[loser].pairSum = this.getpairSum(accumulator[loser]);
              var currSituation = JSON.parse(JSON.stringify(accumulator));
              this.addhistory(currSituation);
              this.counter += 1;
            } else {
              console.error("person not found:" + winner + " or " + loser);
            }
          }
          return accumulator;
        }, initialValue);
      this.stats = res;
      return res;
    }
  },
  computed: {
    filteredMathces() {
      return this.matches
        .filter(a => a.startTime >= this.settings.startDate)
        .filter(
          a =>
            a.startTime <
            moment(this.settings.endDate)
              .add("days", 1)
              .toDate()
        );
    },
    people() {
      return this.$store.state.people.list;
    },
    googleTabs() {
      return this.$store.state.google.tabs;
    },
    chartData() {
      var peopleresults = this.people.slice(0);
      if (!this.resulthistory.length)
        return [
          {
            id: "-",
            color: null,
            values: [{ x: 0, value: 0 }]
          }
        ];
      for (
        let roundIndex = 0;
        roundIndex < this.resulthistory.length;
        roundIndex++
      ) {
        const round = this.resulthistory[roundIndex];
        for (var personName in round) {
          if (round.hasOwnProperty(personName)) {
            var index = peopleresults.findIndex(x => x.name == personName);
            if (index >= 0) {
              // löytyi henkilö
              // roundilla on muitakin propertyjä kuin henkilöt (esim. time)
              var person = peopleresults[index];
              if (!person.results || roundIndex == 0) person.results = [];
              person.results.push({
                x: this.xlinear ? roundIndex : round.time,
                value: round[personName][this.valueToChart]
              });
            }
          }
        }
      }
      return peopleresults.map(person => {
        return {
          id: person ? person.name : "",
          color: person ? person.color : null,
          values: [
            {
              x: 0,
              value: 0
            }
          ].concat(
            person.results.map(r => {
              return {
                x: this.xlinear ? r.x : new Date(r.x),
                value: r.value
              };
            })
          )
        };
      });
    }
  },
  watch: {
    settings: {
      handler: function(val, oldVal) {
        console.log("Updating...");
        this.updateStats();
      },
      deep: true
    },
    recordsState: {
      handler: function(val, oldVal) {
        if (val == "loaded") this.updateStats();
      },
      deep: true
    }
  },
  filters: {
    moment: function(date) {
      return moment(date).format("L, LT");
    },
    momentExcel: function(date) {
      return moment(new Date(Math.round((date - 25569) * 86400 * 1000)))
        .utc()
        .format("L, LT");
    }
  },

  mounted() {
    this.initClient(false); // luo kantaan täytettä ja käynnistää MQTT:n
  }
};
</script>
<style scoped>
.datePicker {
  display: inline-block;
}
</style>


<template>
    <div>
        <div v-if="people.length" >
            <button @click="update()">stats</button> <br>
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
            <select v-model="settings.maxMatchesIncluded">
                <option v-for="i in 10" :key="'s' + i" >{{i}}</option>
            </select>
            <select v-model="settings.useMultiplier">
                <option value="true">true</option>
                <option value="false">false</option>
            </select>
            <ul class="legend">
                <li v-for="person in people" :style="{color: person.color}" :key="person.id">{{person.name}}</li>
            </ul>
        </div>
        <b-table v-if='recordsState === "loaded"' striped hover outlined small :items="matches"  :fields="fields(columns, 5)" @row-clicked="showStats">
          <template slot="start_time" slot-scope="data">
              {{data.item.startTime | moment}}
          </template>
          <template slot="player_1" slot-scope="data">
            <span :class="{'font-weight-bold': data.item.players[0].points.length > data.item.players[1].points.length}">
              {{data.item.players[0].person.name}}
            </span>
          </template>
          <template slot="player_1_score" slot-scope="data">
            <span :class="{'font-weight-bold': data.item.players[0].points.length > data.item.players[1].points.length}">
              {{data.item.players[0].points.length}}
            </span>
          </template>
          <template slot="player_2" slot-scope="data">
            <span :class="{'font-weight-bold': data.item.players[1].points.length > data.item.players[0].points.length}">
              {{data.item.players[1].person.name}}
            </span>
          </template>
          <template slot="player_2_score" slot-scope="data">
            <span :class="{'font-weight-bold': data.item.players[1].points.length > data.item.players[0].points.length}">
              {{data.item.players[1].points.length}}
            </span>
          </template>
        </b-table>
    </div>  
</template>
<script>
import { Person, Remote, Match, Player, Point } from "~/helpers/models";
import { mapActions, mapGetters, mapMutations } from "vuex";
import d3__chart from "~/components/d3__chart";
import moment from "moment";
moment.locale("fi");

export default {
  components: {
    d3__chart
  },
  props: {
    matches: { type: Array, default: () => [] },
    recordsState: { type: String, default: "" }
  },
  data() {
    return {
      // list: JSON.parse(
      //   '[{"start":43185.96969907408,"player_1":"Antti","player_1_score":3,"player_2":"Aapo","player_2_score":3,"last_point":43185.97064814815},{"start":43182.74166666667,"player_1":"Antti","player_1_score":11,"player_2":"Niklas","player_2_score":6,"last_point":43182.743055555555},{"start":43182.739583333336,"player_1":"Severi","player_1_score":6,"player_2":"Antti","player_2_score":11,"last_point":43182.74166666667},{"start":43182.73819444444,"player_1":"Severi","player_1_score":11,"player_2":"Niklas","player_2_score":4,"last_point":43182.739583333336},{"start":43182.736805555556,"player_1":"Antti","player_1_score":11,"player_2":"Niklas","player_2_score":4,"last_point":43182.73819444444},{"start":43182.73402777778,"player_1":"Antti","player_1_score":11,"player_2":"Severi","player_2_score":6,"last_point":43182.73611111111},{"start":43182.731944444444,"player_1":"Antti","player_1_score":11,"player_2":"Niklas","player_2_score":8,"last_point":43182.73402777778},{"start":43182.728472222225,"player_1":"Antti","player_1_score":11,"player_2":"Miikka","player_2_score":8,"last_point":43182.73125},{"start":43182.725694444445,"player_1":"Antti","player_1_score":11,"player_2":"Severi","player_2_score":6,"last_point":43182.72777777778},{"start":43180.79305555556,"player_1":"Antti","player_1_score":11,"player_2":"Aapo","player_2_score":6,"last_point":43180.79513888889},{"start":43180.790972222225,"player_1":"Antti","player_1_score":11,"player_2":"Niklas","player_2_score":7,"last_point":43180.79305555556},{"start":43180.78680555556,"player_1":"Severi","player_1_score":12,"player_2":"Niklas","player_2_score":10,"last_point":43180.790972222225},{"start":43180.78680555556,"player_1":"Severi","player_1_score":11,"player_2":"Niklas","player_2_score":8,"last_point":43180.78680555556},{"start":43180.78333333333,"player_1":"Severi","player_1_score":16,"player_2":"Antti","player_2_score":14,"last_point":43180.78680555556},{"start":43180.76597222222,"player_1":"Severi","player_1_score":11,"player_2":"Aapo","player_2_score":9,"last_point":43180.78333333333},{"start":43180.77847222222,"player_1":"Niklas","player_1_score":10,"player_2":"Aapo","player_2_score":12,"last_point":43180.76597222222},{"start":43180.777083333334,"player_1":"Antti","player_1_score":5,"player_2":"Aapo","player_2_score":11,"last_point":43180.77847222222},{"start":43180.774305555555,"player_1":"Antti","player_1_score":11,"player_2":"Severi","player_2_score":8,"last_point":43180.777083333334},{"start":43180.77291666667,"player_1":"Antti","player_1_score":11,"player_2":"Niklas","player_2_score":4,"last_point":43180.774305555555},{"start":43180.770833333336,"player_1":"Antti","player_1_score":11,"player_2":"Aapo","player_2_score":8,"last_point":43180.77291666667},{"start":43180.76944444444,"player_1":"Antti","player_1_score":6,"player_2":"Severi","player_2_score":0,"last_point":43180.770833333336},{"start":43180.76736111111,"player_1":"Niklas","player_1_score":5,"player_2":"Antti","player_2_score":11,"last_point":43180.76944444444},{"start":43180.76597222222,"player_1":"Antti","player_1_score":11,"player_2":"Aapo","player_2_score":2,"last_point":43180.76736111111},{"start":43180.763194444444,"player_1":"Aapo","player_1_score":11,"player_2":"Severi","player_2_score":8,"last_point":43180.76597222222},{"start":43180.76111111111,"player_1":"Aapo","player_1_score":11,"player_2":"Niklas","player_2_score":9,"last_point":43180.763194444444},{"start":43180.75833333333,"player_1":"Antti","player_1_score":11,"player_2":"Aapo","player_2_score":6,"last_point":43180.76111111111},{"start":43180.75625,"player_1":"Antti","player_1_score":11,"player_2":"Niklas","player_2_score":3,"last_point":43180.75833333333},{"start":43180.754166666666,"player_1":"Severi","player_1_score":8,"player_2":"Niklas","player_2_score":11,"last_point":43180.75625},{"start":43180.75277777778,"player_1":"Antti","player_1_score":11,"player_2":"Aapo","player_2_score":6,"last_point":43180.754166666666},{"start":43180.74930555555,"player_1":"Antti","player_1_score":12,"player_2":"Niklas","player_2_score":10,"last_point":43180.75277777778},{"start":43180.74722222222,"player_1":"Antti","player_1_score":11,"player_2":"Niklas","player_2_score":6,"last_point":43180.74930555555},{"start":43180.74513888889,"player_1":"Antti","player_1_score":11,"player_2":"Aapo","player_2_score":6,"last_point":43180.74722222222},{"start":43180.74375,"player_1":"Severi","player_1_score":4,"player_2":"Aapo","player_2_score":11,"last_point":43180.74513888889},{"start":43180.74166666667,"player_1":"Severi","player_1_score":11,"player_2":"Niklas","player_2_score":6,"last_point":43180.74375},{"start":43180.739583333336,"player_1":"Antti","player_1_score":11,"player_2":"Aapo","player_2_score":8,"last_point":43180.74166666667},{"start":43180.7375,"player_1":"Antti","player_1_score":11,"player_2":"Niklas","player_2_score":6,"last_point":43180.739583333336},{"start":43180.73541666667,"player_1":"Antti","player_1_score":11,"player_2":"Severi","player_2_score":4,"last_point":43180.7375},{"start":43180.73263888889,"player_1":"Antti","player_1_score":11,"player_2":"Aapo","player_2_score":7,"last_point":43180.73541666667},{"start":43180.73125,"player_1":"Aapo","player_1_score":11,"player_2":"Niklas","player_2_score":9,"last_point":43180.73263888889},{"start":43180.72708333333,"player_1":"Severi","player_1_score":12,"player_2":"Niklas","player_2_score":14,"last_point":43180.73125}]'
      // ),
      resulthistory: [],
      counter: 0,
      stats: {},
      settings: {
        maxMatchesIncluded: 10,
        matchIcludedPeriod: 1000 * 60 * 60 * 24 * 30, // 1 kuukausi
        useMultiplier: true
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
    update() {
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
        var multiplier =
          (this.settings.maxMatchesIncluded - array.length + i + 1) /
          this.settings.maxMatchesIncluded;
        multiplierTotal = multiplierTotal + multiplier;
        return (
          prev + curr.winlose * (this.settings.useMultiplier ? multiplier : 1)
        );
      }, 0);
      accumulator[player1].pairResults[player2].sum =
        sum / (this.settings.useMultiplier ? multiplierTotal : 1);
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
        initialValue[p.name].score = 100;
        initialValue[p.name].winCount = 0;
        initialValue[p.name].looseCount = 0;
        initialValue[p.name].winPercentage = 0;
        initialValue[p.name].loosePercentage = 0;
        initialValue[p.name].pairResults = {};
        initialValue[p.name].pairSum = 0;
      });
      res = this.matches.reduce((accumulator, curr, currentIndex, array) => {
        var player_1_score = curr.players[0].points.length
        var player_2_score = curr.players[1].points.length
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
            accumulator[winner].winlose += 1;
            accumulator[loser].winlose -= 1;
            accumulator[winner].winCount += 1;
            accumulator[loser].looseCount -= 1;
            accumulator[winner].winPercentage =
              accumulator[winner].winCount / accumulator[winner].gamesPlayed;
            accumulator[loser].loosePercentage =
              accumulator[loser].looseCount / accumulator[loser].gamesPlayed;
            var scoremoving = accumulator[loser].score * 0.1;
            accumulator[winner].score += scoremoving;
            accumulator[loser].score -= scoremoving;

            accumulator = this.updatePair(accumulator, curr, winner, loser, 1);
            accumulator = this.updatePair(accumulator, curr, loser, winner, -1);
            accumulator[winner].pairSum = this.getpairSum(accumulator[winner]);
            accumulator[loser].pairSum = this.getpairSum(accumulator[loser]);

            var currSituation = JSON.parse(JSON.stringify(accumulator));
            //console.log(currSituation);
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
      for (let i = 0; i < this.resulthistory.length; i++) {
        const round = this.resulthistory[i];
        for (var personName in round) {
          if (round.hasOwnProperty(personName)) {
            var index = peopleresults.findIndex(x => x.name == personName);
            if (index >= 0) {
              // roundilla on muitakin propertyjä kuin henkilöt (esim. time)
              var person = peopleresults[index];
              if (!person.results) person.results = [];
              person.results.push({
                x: this.xlinear ? i : round.time,
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
    settings: () => {
      this.update();
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


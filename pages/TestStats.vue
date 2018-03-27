<template>
    <div>
        <div v-if="people.length" >
            <button @click="getStats()">stats</button> <br>
            <!-- {{people}}<br> -->
            {{resulthistory}},
            {{counter}}
            {{stats}}
        </div>
    </div>  
</template>
<script>
import { Person, Remote, Match, Player, Point } from "~/helpers/models";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      list: JSON.parse(
        '[{"start":43185.96969907408,"player_1":"Antti","player_1_score":3,"player_2":"Aapo","player_2_score":3,"last_point":43185.97064814815},{"start":43182.74166666667,"player_1":"Antti","player_1_score":11,"player_2":"Niklas","player_2_score":6,"last_point":43182.743055555555},{"start":43182.739583333336,"player_1":"Severi","player_1_score":6,"player_2":"Antti","player_2_score":11,"last_point":43182.74166666667},{"start":43182.73819444444,"player_1":"Severi","player_1_score":11,"player_2":"Niklas","player_2_score":4,"last_point":43182.739583333336},{"start":43182.736805555556,"player_1":"Antti","player_1_score":11,"player_2":"Niklas","player_2_score":4,"last_point":43182.73819444444},{"start":43182.73402777778,"player_1":"Antti","player_1_score":11,"player_2":"Severi","player_2_score":6,"last_point":43182.73611111111},{"start":43182.731944444444,"player_1":"Antti","player_1_score":11,"player_2":"Niklas","player_2_score":8,"last_point":43182.73402777778},{"start":43182.728472222225,"player_1":"Antti","player_1_score":11,"player_2":"Miikka","player_2_score":8,"last_point":43182.73125},{"start":43182.725694444445,"player_1":"Antti","player_1_score":11,"player_2":"Severi","player_2_score":6,"last_point":43182.72777777778},{"start":43180.79305555556,"player_1":"Antti","player_1_score":11,"player_2":"Aapo","player_2_score":6,"last_point":43180.79513888889},{"start":43180.790972222225,"player_1":"Antti","player_1_score":11,"player_2":"Niklas","player_2_score":7,"last_point":43180.79305555556},{"start":43180.78680555556,"player_1":"Severi","player_1_score":12,"player_2":"Niklas","player_2_score":10,"last_point":43180.790972222225},{"start":43180.78680555556,"player_1":"Severi","player_1_score":11,"player_2":"Niklas","player_2_score":8,"last_point":43180.78680555556},{"start":43180.78333333333,"player_1":"Severi","player_1_score":16,"player_2":"Antti","player_2_score":14,"last_point":43180.78680555556},{"start":43180.76597222222,"player_1":"Severi","player_1_score":11,"player_2":"Aapo","player_2_score":9,"last_point":43180.78333333333},{"start":43180.77847222222,"player_1":"Niklas","player_1_score":10,"player_2":"Aapo","player_2_score":12,"last_point":43180.76597222222},{"start":43180.777083333334,"player_1":"Antti","player_1_score":5,"player_2":"Aapo","player_2_score":11,"last_point":43180.77847222222},{"start":43180.774305555555,"player_1":"Antti","player_1_score":11,"player_2":"Severi","player_2_score":8,"last_point":43180.777083333334},{"start":43180.77291666667,"player_1":"Antti","player_1_score":11,"player_2":"Niklas","player_2_score":4,"last_point":43180.774305555555},{"start":43180.770833333336,"player_1":"Antti","player_1_score":11,"player_2":"Aapo","player_2_score":8,"last_point":43180.77291666667},{"start":43180.76944444444,"player_1":"Antti","player_1_score":6,"player_2":"Severi","player_2_score":0,"last_point":43180.770833333336},{"start":43180.76736111111,"player_1":"Niklas","player_1_score":5,"player_2":"Antti","player_2_score":11,"last_point":43180.76944444444},{"start":43180.76597222222,"player_1":"Antti","player_1_score":11,"player_2":"Aapo","player_2_score":2,"last_point":43180.76736111111},{"start":43180.763194444444,"player_1":"Aapo","player_1_score":11,"player_2":"Severi","player_2_score":8,"last_point":43180.76597222222},{"start":43180.76111111111,"player_1":"Aapo","player_1_score":11,"player_2":"Niklas","player_2_score":9,"last_point":43180.763194444444},{"start":43180.75833333333,"player_1":"Antti","player_1_score":11,"player_2":"Aapo","player_2_score":6,"last_point":43180.76111111111},{"start":43180.75625,"player_1":"Antti","player_1_score":11,"player_2":"Niklas","player_2_score":3,"last_point":43180.75833333333},{"start":43180.754166666666,"player_1":"Severi","player_1_score":8,"player_2":"Niklas","player_2_score":11,"last_point":43180.75625},{"start":43180.75277777778,"player_1":"Antti","player_1_score":11,"player_2":"Aapo","player_2_score":6,"last_point":43180.754166666666},{"start":43180.74930555555,"player_1":"Antti","player_1_score":12,"player_2":"Niklas","player_2_score":10,"last_point":43180.75277777778},{"start":43180.74722222222,"player_1":"Antti","player_1_score":11,"player_2":"Niklas","player_2_score":6,"last_point":43180.74930555555},{"start":43180.74513888889,"player_1":"Antti","player_1_score":11,"player_2":"Aapo","player_2_score":6,"last_point":43180.74722222222},{"start":43180.74375,"player_1":"Severi","player_1_score":4,"player_2":"Aapo","player_2_score":11,"last_point":43180.74513888889},{"start":43180.74166666667,"player_1":"Severi","player_1_score":11,"player_2":"Niklas","player_2_score":6,"last_point":43180.74375},{"start":43180.739583333336,"player_1":"Antti","player_1_score":11,"player_2":"Aapo","player_2_score":8,"last_point":43180.74166666667},{"start":43180.7375,"player_1":"Antti","player_1_score":11,"player_2":"Niklas","player_2_score":6,"last_point":43180.739583333336},{"start":43180.73541666667,"player_1":"Antti","player_1_score":11,"player_2":"Severi","player_2_score":4,"last_point":43180.7375},{"start":43180.73263888889,"player_1":"Antti","player_1_score":11,"player_2":"Aapo","player_2_score":7,"last_point":43180.73541666667},{"start":43180.73125,"player_1":"Aapo","player_1_score":11,"player_2":"Niklas","player_2_score":9,"last_point":43180.73263888889},{"start":43180.72708333333,"player_1":"Severi","player_1_score":12,"player_2":"Niklas","player_2_score":14,"last_point":43180.73125}]'
      ),
      resulthistory: [],
      counter: 0,
      stats: {}
    };
  },
  methods: {
    ...mapActions(["initClient"]),
    addhistory(value) {
      this.resulthistory.push(value);
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
        initialValue[p.name].winlose = 0;
        initialValue[p.name].score = 100;
      });
      res = this.list.reduce((accumulator, curr, currentIndex, array) => {
        if (curr.player_1_score != curr.player_2_score) {
          var winner =
            curr.player_1_score > curr.player_2_score
              ? curr.player_1
              : curr.player_2;
          var loser =
            curr.player_1_score > curr.player_2_score
              ? curr.player_2
              : curr.player_1;
          //   console.log({ winner, loser });
          if (accumulator[winner] && accumulator[loser]) {
            accumulator[winner].winlose += 1;
            accumulator[loser].winlose -= 1;
            var scoremoving = accumulator[loser].score * 0.1;
            accumulator[winner].score += scoremoving;
            accumulator[loser].score -= scoremoving;
            var currSituation = JSON.parse(JSON.stringify(accumulator));
            console.log(currSituation);
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
    }
  },
  mounted() {
    this.initClient(false); // luo kantaan täytettä ja käynnistää MQTT:n
  }
};
</script>


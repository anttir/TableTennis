<template>
    <b-table :fields="fields()" :items="rows()" :no-provider-sorting="true">
        <template v-for="person in people" :slot="'HEAD_' + person.name" slot-scope="data">
            <span :style="{color: person.color}" :key="'th-' + person.ID">{{person.name}}</span>
        </template>
        <template slot="name" slot-scope="data">
            <span :style="{color: people.find(x => x.name == data.value).color}">{{data.value}}</span>
        </template>
    </b-table>
</template>
<script>
export default {
  props: {
    data: { type: Object, default: () => {} },
    people: { type: Array, default: () => [] }
  },
  computed: {},
  methods: {
    filteredKeys() {
      return Object.keys(this.data).filter(
        x => x != "time" && this.data[x].gamesPlayed > 0
      );
    },
    rows() {
      var names = this.filteredKeys();
      return names.map(name => {
        var t = this.data[name];
        Object.keys(this.data[name].pairResults).forEach(pairName => {
          t[pairName] = this.data[name].pairResults[pairName].sum;
        });
        t.name = name;
        return t;
      });
    },
    fields() {
      var cols = [
        { key: "name" },
        { key: "gamesPlayed" },
        { key: "winPercentage", formatter: "percentageFormatter" },
        { key: "loosePercentage", formatter: "percentageFormatter"   },
        { key: "winlose" },
        { key: "pairSum", label:"Score", formatter: (x) => Math.floor(x * 100)/100 }
      ].map(c => {
        c.sortable = true;
        return c;
      });

      var cols2 = this.filteredKeys();
      cols2 = cols2.map(c => {
        return {
          key: c.replace(/ /g, "_"), //.toLowerCase(),
          //label: c,
          sortable: true,
          formatter: "percentageFormatter"
        };
      });
      return cols.concat(cols2);
    },
    percentageFormatter(value) {
      return value ? Math.floor(value * 100) + "%" : "";
    }
  },
  data() {
    return {
      //   data: {
      //     Antti: {
      //       gamesPlayed: 60,
      //       winlose: 50,
      //       score: 298.63111841981646,
      //       winCount: 55,
      //       looseCount: -5,
      //       winPercentage: 0.9166666666666666,
      //       loosePercentage: -0.11363636363636363,
      //       pairResults: {
      //         Severi: {
      //           array: [
      //             { winlose: -1 },
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: -1 },
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: 1 }
      //           ],
      //           sum: 0.7090909090909091
      //         },
      //         Niklas: {
      //           array: [
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: 1 }
      //           ],
      //           sum: 1
      //         },
      //         Miikka: { array: [{ winlose: 1 }], sum: 1 },
      //         Aapo: {
      //           array: [
      //             { winlose: 1 },
      //             { winlose: -1 },
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: 1 }
      //           ],
      //           sum: 0.8888888888888886
      //         }
      //       },
      //       pairSum: 3.5979797979797974
      //     },
      //     Aapo: {
      //       gamesPlayed: 15,
      //       winlose: -3,
      //       score: 60.22763957772951,
      //       winCount: 6,
      //       looseCount: -9,
      //       winPercentage: 0.4,
      //       loosePercentage: -0.6428571428571429,
      //       pairResults: {
      //         Antti: {
      //           array: [
      //             { winlose: -1 },
      //             { winlose: 1 },
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: -1 }
      //           ],
      //           sum: -0.8888888888888886
      //         },
      //         Severi: {
      //           array: [{ winlose: -1 }, { winlose: 1 }, { winlose: 1 }],
      //           sum: 0.40740740740740744
      //         },
      //         Niklas: {
      //           array: [{ winlose: 1 }, { winlose: 1 }, { winlose: 1 }],
      //           sum: 1
      //         }
      //       },
      //       pairSum: 0.5185185185185188
      //     },
      //     Severi: {
      //       gamesPlayed: 46,
      //       winlose: -20,
      //       score: 38.29263087349631,
      //       winCount: 13,
      //       looseCount: -33,
      //       winPercentage: 0.29545454545454547,
      //       loosePercentage: -0.717391304347826,
      //       pairResults: {
      //         Antti: {
      //           array: [
      //             { winlose: 1 },
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: 1 },
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: -1 }
      //           ],
      //           sum: -0.7090909090909091
      //         },
      //         Niklas: {
      //           array: [
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: 1 },
      //             { winlose: -1 },
      //             { winlose: 1 },
      //             { winlose: -1 }
      //           ],
      //           sum: 0.34545454545454546
      //         },
      //         Aapo: {
      //           array: [{ winlose: 1 }, { winlose: -1 }, { winlose: -1 }],
      //           sum: -0.40740740740740744
      //         }
      //       },
      //       pairSum: -0.7710437710437711
      //     },
      //     Niklas: {
      //       gamesPlayed: 30,
      //       winlose: -26,
      //       score: 12.848611128957725,
      //       winCount: 2,
      //       looseCount: -28,
      //       winPercentage: 0.06666666666666667,
      //       loosePercentage: -0.9655172413793104,
      //       pairResults: {
      //         Severi: {
      //           array: [
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: 1 },
      //             { winlose: -1 },
      //             { winlose: 1 }
      //           ],
      //           sum: -0.34545454545454546
      //         },
      //         Antti: {
      //           array: [
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: -1 },
      //             { winlose: -1 }
      //           ],
      //           sum: -1
      //         },
      //         Aapo: {
      //           array: [{ winlose: -1 }, { winlose: -1 }, { winlose: -1 }],
      //           sum: -1
      //         }
      //       },
      //       pairSum: -2.3454545454545457
      //     },
      //     Miro: {
      //       gamesPlayed: 0,
      //       winlose: 0,
      //       score: 100,
      //       winCount: 0,
      //       looseCount: 0,
      //       winPercentage: 0,
      //       loosePercentage: 0,
      //       pairResults: {},
      //       pairSum: 0
      //     },
      //     Miikka: {
      //       gamesPlayed: 1,
      //       winlose: -1,
      //       score: 90,
      //       winCount: 0,
      //       looseCount: -1,
      //       winPercentage: 0,
      //       loosePercentage: -1,
      //       pairResults: { Antti: { array: [{ winlose: -1 }], sum: -1 } },
      //       pairSum: -1
      //     },
      //     time: "2018-03-21T17:27:00.000Z"
      //   }
    };
  }
};
</script>
<style scoped>

</style>



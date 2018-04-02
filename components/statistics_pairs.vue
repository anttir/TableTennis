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
        { key: "loosePercentage", formatter: "percentageFormatter" },
        { key: "winlose" },
        {
          key: "pairSum",
          label: "Score",
          formatter: x => Math.round(x * 100) / 100
        }
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
      return value ? Math.round(value * 100) + "%" : "";
    }
  },
  data() {
    return {};
  }
};
</script>
<style scoped>

</style>



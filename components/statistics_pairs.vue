<template>
<div>
    <b-table :fields="fields" :items="rows()" :no-provider-sorting="true" :sort-by.sync="scoreField" :sort-desc="true">
        <template v-for="person in people" :slot="'HEAD_' + person.name" slot-scope="data">
            <span :style="{color: person.color}" :key="'th-' + person.ID">{{person.name}}</span>
        </template>
        <template slot="name" slot-scope="data">
          <input type="checkbox" style="display:none" v-model="excludedPeople" :value="data.value" :id="'p' + data.value" >
          <label :for="'p' + data.value" style="cursor: pointer" :style="{color: people.find(x => x.name == data.value).color}">{{data.value}}</label>
        </template>
    </b-table>
</div>
</template>
<script>
export default {
  props: {
    data: { type: Object, default: () => {} },
    people: { type: Array, default: () => [] },
    scoreField: { type: String, default: () => "Score" }
  },
  data() {
    return {
      sortDesc: "Descending",
      excludedPeople: []
    };
  },
  computed: {
    fields() {
      var cols = [
        { key: "name" },
        { key: "gamesPlayed" },
        { key: "winPercentage", formatter: "percentageFormatter" },
        { key: "pointsTotal" },
        // { key: "loosePercentage", formatter: "percentageFormatter" },
        { key: "winlose" },
        {
          key: this.scoreField,
          label: this.scoreField,
          formatter:
            this.scoreField === "pairSum"
              ? "percentageFormatter"
              : x => Math.round(x * 100) / 100
        }
      ].map(c => {
        c.sortable = true;
        return c;
      });
      if (this.scoreField === "pairSum") {
        var cols2 = this.filteredKeys();
        cols2 = cols2.map(c => {
          return {
            key: c.replace(/ /g, "_"), //.toLowerCase(),
            //label: c,
            sortable: true,
            formatter: "percentageFormatter"
          };
        });
        cols = cols.concat(cols2);
      }
      return cols;
    }
  },
  methods: {
    includePerson(name) {
      var index = this.excludedPeople.indexOf(name);
      if (index !== -1) this.excludedPeople.splice(index, 1);
    },
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
    percentageFormatter(value) {
      if (value == 0) return "-";
      return value ? Math.round(value * 100) + "%" : "";
    }
  },
  watch: {
    excludedPeople(val) {
      this.$emit("excludedPeopleChanged", val);
    }
  }
};
</script>
<style>
th.sorting_asc,
th.sorting_desc {
  background-color: #eee;
}
</style>



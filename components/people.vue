<template>
    <div>
        <span>People</span>
        <ul>
            <li v-for="(person,i) in people" :key="i">
                <span class="colortab rounded border" v-on:click="toggle(person.ID)" :style="{ background: person.color }"></span>
                <span :style="{color: person.color}">{{ person.name }}</span>
                <compact-picker v-if="visibleColorpickers.includes(person.ID)" :value="person.color" v-on:input="updateColor(person, $event)"/>
                <font-awesome-icon class="actionIcon" v-on:click="removePerson(person)" :icon="['fas', 'trash']" size="sm" />
            </li>
            <li>
                <input placeholder="Add new person" v-model="newPersonName" @keyup.enter="addPerson">
                <span class="colortab rounded border" v-on:click="toggle('colorpick')" :style="{ background: color.hex }"></span>
                <compact-picker v-if="visibleColorpickers.includes('colorpick')" v-model="color" v-on:input="hidePicker('colorpick')"/>
                <button @click="addPerson">add</button>
            </li>
        </ul>
    </div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import fontawesome from "@fortawesome/fontawesome";
import faSolids from "@fortawesome/fontawesome-free-solid";
fontawesome.library.add(faSolids);

import { mapMutations } from "vuex";

import { Compact } from "vue-color";

export default {
  components: {
    "compact-picker": Compact,
    FontAwesomeIcon
  },
  data() {
    return {
      color: { hex: "#F44E3B" },
      visibleColorpickers: [],
      newPersonName: ""
    };
  },
  computed: {
    people() {
      return this.$store.state.people.list;
    }
  },
  methods: {
    updateColor(person, color) {
      this.$store.commit("people/changeColor", {
        personID: person.ID,
        color: color.hex
      });
      this.visibleColorpickers.splice(
        this.visibleColorpickers.indexOf(person.ID),
        1
      );
    },
    addPerson(e) {
      //debugger; // eslint-disable-line
      this.$store.commit("people/add", {
        ID: null,
        name: this.newPersonName,
        color: this.color.hex
      });
      this.newPersonName = "";
      //   e.target.value = "";
      this.hidePicker("colorpick");
    },
    removePerson(person) {
      this.$store.commit("people/remove", person);
    },
    hidePicker(ID) {
      if (this.visibleColorpickers.includes(ID)) {
        this.visibleColorpickers.splice(
          this.visibleColorpickers.indexOf(ID),
          1
        );
      }
    },
    toggle(ID) {
      //debugger // eslint-disable-line
      if (this.visibleColorpickers.includes(ID)) {
        this.visibleColorpickers.splice(
          this.visibleColorpickers.indexOf(ID),
          1
        );
      } else {
        this.visibleColorpickers.push(ID);
      }
    }
    // ...mapMutations({
    //   toggle: "people/toggle"
    // })
  }
};
</script>

<style>
.colortab {
  display: inline-block;
  width: 1em;
  height: 1em;
  margin: 0 0.3em;
}
.actionIcon {
  margin: 0 0.3em;
  opacity: 0.5;
}
</style>
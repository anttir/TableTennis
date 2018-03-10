<template>
    <div>
        <span>People</span>
        <ul>
            <li v-for="(person,i) in people" :key="i">
                <span class="colortab" v-on:click="toggle(person.ID)" :style="{ background: person.color }"></span>
                <span :style="{color: person.color}">{{ person.name }}</span>
                <compact-picker v-if="visibleColorpickers.includes(person.ID)" :value="person.color" v-on:input="updateColor(person, $event)"/>
            </li>
            <li>
                <input placeholder="Add new person" @keyup.enter="addPerson">
                <span class="colortab" v-on:click="toggle('colorpick')" :style="{ background: color.hex }"></span>
                <compact-picker v-if="visibleColorpickers.includes('colorpick')" v-model="color" v-on:input="hidePicker('colorpick')"/>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapMutations } from "vuex";

import { Compact } from "vue-color";
import { Grayscale } from "vue-color";
import { Material } from "vue-color";
import { Swatches } from "vue-color";
import { Slider } from "vue-color";
import { Sketch } from "vue-color";
import { Chrome } from "vue-color";
import { Photoshop } from "vue-color";

export default {
  data() {
    return {
      color : {hex:'#F44E3B'},
      visibleColorpickers : []
    };
  },
  computed: {
    people() {
      return this.$store.state.people.list;
    }
  },
  methods: {
    updateColor(person, color) {
        this.$store.commit("people/changeColor", {personID : person.ID, color:color.hex})
        this.visibleColorpickers.splice(this.visibleColorpickers.indexOf(person.ID), 1)
    },
    addPerson(e) {
      this.$store.commit("people/add", {ID:null, name: e.target.value, color: this.color.hex});
      e.target.value = "";
      this.hidePicker('colorpick')
    },
    hidePicker(ID) {
        if(this.visibleColorpickers.includes(ID)) {
            this.visibleColorpickers.splice(this.visibleColorpickers.indexOf(ID), 1)
        }
    },
    toggle(ID){
        //debugger // eslint-disable-line
        if(this.visibleColorpickers.includes(ID)) {
            this.visibleColorpickers.splice(this.visibleColorpickers.indexOf(ID), 1)
        } else {
            this.visibleColorpickers.push(ID)
        }
    }
    // ...mapMutations({
    //   toggle: "people/toggle"
    // })
  },
  components: {
    "compact-picker": Compact
  }
};
</script>

<style>
.colortab {
      display: inline-block;
      width:1em;
      height:1em;
      margin: 0 0.3em ;
      border-radius: 0.3em;
}
</style>
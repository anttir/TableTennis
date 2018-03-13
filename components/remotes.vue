<template>
    <div>
        <span>Remotes</span>
        <ul>
            <li v-for="(remote,i) in remotes" :key="i">
                <span>{{ remote.name }}</span>
                <ul class="buttonids">
                    <li v-for="(buttonID,i) in remote.buttonIDs" :key="i">
                        <span>{{ buttonID }}</span> 
                    </li>
                    <li>
                        <input placeholder="Add new code" v-model="newRemoteCode" @keyup.enter="addCode(remote.ID)">
                        <button @click="addCode(remote.ID)">add</button>
                    </li>
                </ul>
                <span v-on:click="removeremote(remote)"><i class="fas fa-trash actionIcon"></i></span>
            </li>
            <li>
                <input placeholder="Add new remote" v-model="newRemoteName" @keyup.enter="addRemote">
                <button @click="addRemote">add</button>
            </li>
        </ul>
    </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import fontawesome from '@fortawesome/fontawesome'
import faSolids from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faSolids)

import { mapMutations } from "vuex";

export default {
  data() {
    return {
      newRemoteName : "",
      newRemoteCode:"",
    };
  },
  computed: {
    remotes() {
      return this.$store.state.remotes.list;
    }
  },
  methods: {
    addCode(remoteID) {
      this.$store.commit("remotes/addCodeToRemote", {remoteID: remoteID, code: this.newRemoteCode });
      this.newRemoteCode ="";
    },
    addRemote(e) {
      this.$store.commit("remotes/add", {name: this.newRemoteName, buttonIDs:[]});
      this.newRemoteName = "";
    //   e.target.value = "";
    },
    removeremote(remote) {
      this.$store.commit("remotes/remove", remote);
    },
    // ...mapMutations({
    //   toggle: "remotes/toggle"
    // })
  },
  components: {
    FontAwesomeIcon
  }
};
</script>

<style>
    .actionIcon {
        margin: 0 0.3em ;
        opacity: 0.5;
        size: 80%;
    }
    .buttonids{ display: inline-block; padding-left: 0.5em;}
    .buttonids li{ 
        display: inline-block; 
        list-style-type: none;
        padding: 0 0.3em;
        margin: 0 0.1em;
        border-left: 1px Solid grey;
        border-right: 1px Solid grey;
        font-family: monospace;
    }
</style>
<template>
  <div>
      <b-tabs v-model="tabIndex" >
        <b-tab id="topmenu" title="Home" disabled>
          <template slot="title">
            <i style="color:green" class="fas fa-table-tennis"></i>
            <span class="title p-3">Table Tennis Scoreboard</span>
          </template>
        </b-tab>
        <b-tab title="Current match">
          <speech ref="synth" />
          <div v-if="currentMatch" class="currentMatch match" v-cloak>
            <div class="row">
              <div class="col">
                <span class="legend">Sounds: </span>
                <span v-if="!soundsOn" v-on:click="soundsOn = !soundsOn"><i class="fas actionIcon fa-volume-off" ></i></span>
                <span v-else v-on:click="soundsOn = !soundsOn"><i class="fas actionIcon fa-volume-up" ></i></span>
              </div>
              <div class="col text-right startTime"><span class="legend">Start time:</span> {{currentMatch.startTime | moment}}</div>
            </div>
            <div class="row players">
              <template v-for="(player, i) in currentMatch.players">
                <div class="col player m-3" :key="'p-'+i">
                  <div>
                    <div class="legend namelegend">Name:</div>
                    <div class="nameselector p-1 rounded border border-info bg-light" v-if="nameselectorvisible[i]">
                      <button  @click="toggleselectorvisible(i)" type="button" class="close" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button><br>
                      <div v-for="person in people" :key="'pe' + person.ID">
                        <span v-if="!player.person || person.ID != player.person.ID" :style="{ color: person.color, cursor:'pointer'}"  @click="changePerson(player.ID, person, player.remote, i)">
                          {{person.name}}
                        </span>
                        <span v-else class="disabled font-italic" :style="{ color: person.color}">{{person.name}}</span>
                      </div>
                    </div>
                    <div v-on:click="toggleselectorvisible(i)" class="personName text-center" :style="{ color: player.person ? player.person.color : 'grey'}">{{ player.person ? player.person.name : "select"}}</div>
                    <div class="remoteName" v-b-tooltip.hover title="Remote name">{{player.remote.name}}</div>
                  </div>
                  <div class="text-center points" v-if="player.person && currentMatch.enoughPlayers">
                    <span v-on:click="addPoint(player.remote.buttonIDs[1])"><i class="fas fa-minus pointsbutton " /></span>
                    <b-fliptext :id="'flipPoints' + player.person.ID" :text="player.points.length" style="display: inline-block; vertical-align: middle;" />
                    <span v-on:click="addPoint(player.remote.buttonIDs[0])"><i class="fas fa-plus pointsbutton " /></span>
                  </div>
                </div>
                <div v-if="i==0"  class="col col-md-auto"  :key="'separator-'+i" >
                  <i @click="switchPlayers()" style="color:grey" class="fas fa-exchange-alt"></i>
                </div>
              </template>
            </div>
            <div v-if="currentMatch.enoughPlayers">
              <div class="text-center">
                <button class="btn btn-info" @click="speak(literalresult)"><input type="checkbox" id="checkbox" v-model="autoSpeech"> Current score <i class="fas actionIcon fa-volume-up" ></i></button>
              </div>
              <!-- <button class="btn btn-info" @click="countStats">countStats</button> -->
              <div class="text-center">
                <d3__chart
                  :layout="layout"
                  :chartdata="chartData"
                  :axes="axes"
                  :xlinear="xlinear" />
                  <!-- Scale: 
                  <a v-on:click="xlinear=true" :style="{fontWeight: xlinear ? 'bold' : 'normal', cursor:  xlinear ? 'default' : 'pointer'}">points</a> / 
                  <a v-on:click="xlinear=false" :style="{fontWeight: !xlinear ? 'bold' : 'normal', cursor: !xlinear ? 'default' : 'pointer'}">time</a> -->
              </div>
              <div class="text-center">
                <button v-if="!loggedInToGoogle" class="btn btn-info m-2" @click="tabIndex = 5">Log in to Google</button>
                <!-- <button v-if="loggedInToGoogle" class="btn btn-primary m-2" @click="saveScore()">Save score</button> -->
                <button v-if="loggedInToGoogle" class="btn m-2 btn-primary"  @click="saveAndstartNewMatch()">Save score and start a new match</button>
                <button v-else class="btn m-2 btn-danger" @click="startNewMatch(false)">Start new match</button>
              </div>
            </div>
          </div>
          <div v-else>-- No matches -- </div>
        </b-tab>
        <b-tab title="Matches" ><matches /></b-tab>
        <b-tab title="People" ><people /></b-tab>
        <b-tab title="Remotes" ><remotes /></b-tab>
        <b-tab title="History" ><googledb ref="history" v-on:ready="loggedInToGoogle = true" /></b-tab>
        <!-- <b-tab title="Logger"><logger/></b-tab> -->
      </b-tabs>
 </div>
</template>

<script>
import moment from "moment";
moment.locale("fi");
import { mapActions, mapGetters, mapMutations } from "vuex";

import * as d3 from "d3";
import d3__chart from "~/components/d3__chart";

import BFliptext from "~/components/b-fliptext";
import Logger from "~/components/logger";
import People from "~/components/people";
import Remotes from "~/components/remotes";
import Matches from "~/components/matches";
import Speech from "~/components/speech";
import Googledb from "~/components/googledb";

import { Person, Remote, Match, Player, Point } from "~/helpers/models";

export default {
  components: {
    d3__chart,
    BFliptext,
    Logger,
    People,
    Matches,
    Remotes,
    Speech,
    Googledb
  },
  data() {
    return {
      layout: {
        width: 800,
        height: 200,
        marginTop: 45,
        marginRight: 50,
        marginBottom: 50,
        marginLeft: 35
      },
      axes: ["bottom", "right"],
      soundsOn: true,
      xlinear: true,
      nameselectorvisible: [false, false],
      autoSpeech: true,
      loggedInToGoogle: false,
      tabIndex: 1
    };
  },
  computed: {
    literalresult() {
      var cm = this.currentMatch;
      var languageID = null;
      if (cm.latestPoint) {
        var p = cm.players.find(x => x.person.ID == cm.latestPoint.personID)
          .person;
        languageID = p.languageID;
      }
      var pointstotal =
        cm.players[0].points.length + cm.players[1].points.length;
      var readnames = pointstotal == 0 || pointstotal % 3 == 1;
      return {
        text:
          (readnames ? cm.players[0].person.name : "") +
          " " +
          cm.players[0].points.length +
          "..." +
          (readnames ? cm.players[1].person.name : "") +
          " " +
          cm.players[1].points.length,
        languageID: languageID
      };
    },
    matches() {
      return this.$store.state.matches.list;
    },
    people() {
      return this.$store.state.people.list;
    },
    remotes() {
      return this.$store.state.remotes.list;
    },
    chartData() {
      return this.currentMatch.players.map(player => {
        return {
          id: player.person ? player.person.name : "",
          color: player.person ? player.person.color : null,
          values: [
            {
              x: this.xlinear ? 0 : this.currentMatch.startTime,
              value: 0
            }
          ].concat(
            player.points.map(point => {
              return {
                x: this.xlinear
                  ? point.currSetTotal
                  : new Date(point.timestamp),
                value: point.currPlayerTotal
              };
            })
          )
        };
      });
    },
    ...mapGetters({ currentMatch: "matches/currentMatch" }),
    ...mapGetters({ latestPoint: "matches/latestPoint" })
  },
  methods: {
    ...mapActions(["initClient"]),
    ...mapActions({ addPoint: "matches/addPoint" }),
    ...mapMutations({
      addMatch: "matches/add",
      resetPoints: "matches/resetPoints",
      switchPlayers: "matches/switchPlayers",
      startNewMatch: "matches/startNewMatch",
      saveAndstartNewMatch() {
        this.saveScore();
        this.startNewMatch();
      }
    }),
    toggleselectorvisible(i) {
      this.nameselectorvisible.splice(i, 1, !this.nameselectorvisible[i]);
    },
    playSound(sound) {
      if (sound) {
        var audio = new Audio(sound);
        audio.play();
      }
    },
    speak(text, languageID) {
      this.$refs.synth.speak(text, languageID);
    },
    saveScore() {
      this.$refs.history.addData(this.currentMatch);
    },
    loginToGoogle() {
      this.$refs.history.initializeGoogleApi();
    },
    countStats() {
      console.log(this.$refs.history.countStats(this.currentMatch));
    },
    changePerson(playerID, person, remote, i) {
      this.$store.commit("matches/addPlayerToCurrent", {
        player: new Player(person, remote),
        playerID: playerID
      });
      this.toggleselectorvisible(i);
    },
    keyListener(evt) {
      switch (evt.code + "") {
        case "ShiftLeft":
          this.addPoint({ player: this.currentMatch.players[0], points: 1 });
          break;
        case "ShiftRight":
          this.addPoint({ player: this.currentMatch.players[1], points: 1 });
          break;
        default:
          break;
      }
    }
  },
  watch: {
    nameselectorvisible() {},
    latestPoint: function dataChanged(newData, oldData) {
      if (
        this.soundsOn &&
        this.currentMatch.players.length &&
        newData &&
        newData.personID
      ) {
        // muuttujia ei välttämättä ole vielä alustettu
        var sound = this.currentMatch.players.filter(
          x => x.person.ID == newData.personID
        )[0].person.sound;
        if (!sound) {
          var sounds = [
            "http://soundbible.com/mp3/Air Plane Ding-SoundBible.com-496729130.mp3",
            "http://soundbible.com/mp3/Elevator Ding-SoundBible.com-685385892.mp3"
          ];
          var i = this.currentMatch.players
            .map(x => x.person.ID)
            .indexOf(newData.personID);
          sound = sounds[i];
        }
        this.playSound(sound);
        if (this.autoSpeech) this.speak(this.literalresult);
      }
    }
  },
  filters: {
    moment: function(date) {
      return moment(date).format("L, LT");
    }
  },
  created: function() {},
  destroyed: function() {
    document.removeEventListener("keyup", this.escapeKeyListener);
  },
  mounted() {
    this.initClient(true); // luo kantaan täytettä ja käynnistää MQTT:n
    document.addEventListener("keyup", this.keyListener);
  }
};
</script>

<style scoped>
ul.matches {
  list-style-type: none;
}

.currentMatch .legend {
  font-size: 80%;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  color: rgb(226, 226, 226);
  display: inline;
}
.currentMatch .namelegend {
  position: absolute;
}
.currentMatch .startTime,
.currentMatch .remote {
  display: inline;
}
.currentMatch .player .personName {
  font-family: "Mina", sans-serif;
  font-weight: bold;
  font-size: 10vh;
}
.currentMatch .remoteName {
  /* border: 5px solid #f9f9f9; */
  border-radius: 50%;
  font-weight: bold;
  background-color: whitesmoke;
  padding: 0 0.5em;
  top: 0;
  right: 0%;
  position: absolute;
  text-align: center;
}
.currentMatch .points {
  white-space: nowrap;
}

.currentMatch .nameselector {
  position: absolute;
  width: 100%;
  min-height: 12vh;
  text-align: center;
  z-index: 99;
}
.currentMatch .nameselector .disabled {
  opacity: 0.5;
}

li.player {
  cursor: copy;
}

.pointsbutton {
  background-color: whitesmoke;
  border-radius: 50%;
  border: 1px solid lightgrey;
  padding: 0.2em;
  margin: 0 0.5em;
  vertical-align: middle;
  color: black;
  font-size: 3vmax;
}

.chart {
  margin: auto;
}
</style>



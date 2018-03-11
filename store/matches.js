import {
  Person,
  Remote,
  Match,
  Player,
  Point,
  guidGenerator
} from "../helpers";

export const state = () => ({
  list: []
});

export const getters = {
  currentMatch: state => {
    return state.list[state.list.length - 1];
  },
  isPlaying(playerID) {
    return state.list.map(p => p.ID).includes(playerID);
  }
  // exampleCurrentLeader: (state, getters) => {
  //   return getters.currentMatch.players[0] // ...
  // }
};

export const mutations = {
  add(state, data) {
    state.list.push(data);
  },
  remove(state, { match }) {
    state.list.splice(state.list.indexOf(match), 1);
  },
  addPlayerToCurrent(state, player) {
    this.commit("matches/addPlayerToMatch", {
      match: state.list[state.list.length - 1],
      player: player
    });
  },
  addPlayerToMatch(state, data) {
    if (data.match.players.length > 1) {
      data.match.players.splice(0, 1);
    }
    this.commit("matches/removePlayerFromMatch", {
      match: data.match,
      personID: data.player.person.ID
    });
    data.match.players.push(data.player);
  },
  addPointToCurrentMatch: function(state, RFID) {
    RFID = parseInt(RFID);
    var _currentMatch = state.list[state.list.length - 1];
    var tplayer = _currentMatch.players.filter(p =>
      p.remote.buttonIDs.includes(RFID)
    );
    if (tplayer.length) {
      _currentMatch.addPoint(tplayer[0].person.ID);
      _currentMatch.latestPoint = new Date();
    }
  },
  removePlayerFromMatch(state, data) {
    for (var i = data.match.players.length - 1; i >= 0; i--) {
      if (data.match.players[i].person.ID == data.personID) {
        data.match.players.splice(i, 1);
      }
    }
  }
};

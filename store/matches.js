import {
  Person,
  Remote,
  Match,
  Player,
  Point,
  guidGenerator
} from "../helpers";

export const state = () => ({
  list: [],
  rfquerycount: 0
});

export const getters = {
  currentMatch: state => {
    return state.list[state.list.length - 1];
  },
  isPlaying(state, personID) {
    return state.list.map(p => p.player.person.ID).includes(personID);
  },
  latestPoint: (state, getters) => {
    return getters.currentMatch ? getters.currentMatch.latestPoint : null;
  }
};

export const actions = {
  addPoint(context, rfcode) {
    context.commit("incrementRfCounter");
    context.commit("addPointToCurrentMatch", rfcode);
  }
};

export const mutations = {
  incrementRfCounter(state, data) {
    state.rfquerycount++;
  },
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
  addPointToCurrentMatch(state, data) {
    var points = 1;
    var rfcode;
    if (data.points == null) {
      rfcode = data;
    } else {
      rfcode = data.rfcode;
      points = data.points;
    }
    rfcode = parseInt(rfcode);
    var _currentMatch = state.list[state.list.length - 1];
    var tplayer = _currentMatch.players.filter(p =>
      p.remote.buttonIDs.includes(rfcode)
    );
    if (tplayer.length) {
      if(points > 0) {
        _currentMatch.addPoint(tplayer[0].person.ID);
      }else{
        _currentMatch.removePoint(tplayer[0].person.ID);
      }
      _currentMatch.latestPoint = _currentMatch.latestPoint;
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

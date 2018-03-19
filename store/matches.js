import {
  Person,
  Remote,
  Match,
  Player,
  Point,
  guidGenerator
} from "../helpers";
import { debug } from "util";

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
  addPlayerToCurrent(state, data) {
    this.commit("matches/addPlayerToMatch", {
      match: state.list[state.list.length - 1],
      player: data.player,
      playerID: data.playerID
    });
  },
  addPlayerToMatch(state, data) {
    // kumpaan paikkaan halutaan vaihtee
    var position = data.playerID
      ? data.match.players.map(x => x.ID).indexOf(data.playerID)
      : -1;
    // otetaan tämä pelaaja pois (ei voi olla kahdesti)
    this.commit("matches/removePlayerFromMatch", {
      match: data.match,
      personID: data.player.person.ID
    });
    // otetaan yksi pelaaja pois, jos vielä kaksi
    if (data.match.players.length > 1) {
      if (position == 0 || position == -1) {
        data.match.players.shift(); // eka pois
      } else {
        data.match.players.pop(); // vika pois
      }
    }
    // lisätään joko alkuun tai loppuun
    if (position == 0) {
      data.match.players.unshift(data.player);
    } else {
      data.match.players.push(data.player);
    }
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
      if (points > 0) {
        _currentMatch.addPoint(tplayer[0].person.ID);
      } else {
        _currentMatch.removePoint(tplayer[0].person.ID);
      }
      _currentMatch.latestPoint = _currentMatch.latestPoint;
    }
  },
  resetPoints(state) {
    var _currentMatch = state.list[state.list.length - 1];
    _currentMatch.players.forEach(player => {
      player.points.splice(0, player.points.length);
    });
  },
  removePlayerFromMatch(state, data) {
    for (var i = data.match.players.length - 1; i >= 0; i--) {
      if (data.match.players[i].person.ID == data.personID) {
        data.match.players.splice(i, 1);
      }
    }
  }
};

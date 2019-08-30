import {
  Person,
  Remote,
  Match,
  Player,
  Point,
  guidGenerator
} from "~/helpers/models";
import { debug } from "util";

export const state = () => ({
  list: [],
  rfquerycount: 0
});

export const getters = {
  currentMatch: state => {
    return state.list[state.list.length - 1];
  },
  // isPlaying(state, personID) {
  //   return state.list[state.list.length - 1].players.map(p => p.person.ID).includes(personID);
  // },
  latestPoint: (state, getters) => {
    return getters.currentMatch ? getters.currentMatch.latestPoint : null;
  }
};

export const actions = {
  addPoint(context, data) {
    context.commit("incrementRfCounter");
    context.commit("addPointToCurrentMatch", data);
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
  clear(state) {
    state.list = [];
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
    var tplayer = null;
    var rfcode;
    var _currentMatch = state.list[state.list.length - 1];
    if (data.points == null) {
      // jos on annettu vain RF-koodi
      rfcode = parseInt(data);
      tplayer = _currentMatch.players.find(p =>
        p.remote.buttonIDs.includes(rfcode)
      );
      var butnumber = tplayer.remote.buttonIDs.indexOf(rfcode);
      if (butnumber == 0) points = 1;
      if (butnumber == 1) points = -1;
    } else {
      tplayer = data.player;
      points = data.points;
    }
    if (tplayer) {
      if (points > 0) {
        _currentMatch.addPoint(tplayer.person.ID);
      } else {
        _currentMatch.removePoint(tplayer.person.ID);
      }
      _currentMatch.latestPoint = _currentMatch.latestPoint; // jotta huomataan muutos
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
      if (
        data.match.players[i].person &&
        data.match.players[i].person.ID == data.personID
      ) {
        data.match.players.splice(i, 1);
      }
    }
  },
  startNewMatch(state, keepThePlayers) {
    var _currentMatch = state.list[state.list.length - 1];
    var _remotes = [
      _currentMatch.players[0].remote,
      _currentMatch.players[1].remote
    ];
    var playersInOrder = _currentMatch.players
      .map(p => ({
        player: p,
        points: p.points.length
      }))
      .sort((x, y) => y.points - x.points);
    var winner = playersInOrder[0].player;
    var loser = playersInOrder[1].player;
    var winnerPosition = _currentMatch.players.findIndex(
      x => x.ID == winner.ID
    );

    var newMatch = new Match();
    if (winnerPosition == 0) {
      newMatch.players.push(new Player(winner.person, _remotes[0]));
    }
    newMatch.players.push(
      new Player(keepThePlayers ? loser.person : null, _remotes[1])
    );
    if (winnerPosition == 1) {
      newMatch.players.push(new Player(winner.person, _remotes[0]));
    }
    state.list.push(newMatch);
  },
  switchPlayers(state) {
    var _currentMatch = state.list[state.list.length - 1];
    _currentMatch.players.reverse();
    var tempremote = _currentMatch.players[0].remote;
    _currentMatch.players[0].remote = _currentMatch.players[1].remote;
    _currentMatch.players[1].remote = tempremote;
  },
  // toggleDetails(state, matchId){
  //   var _currentMatch = state.list.filter(x => x.ID == matchId)[0];
  //   if(_currentMatch) {
  //     if(_currentMatch.hasOwnProperty("_showDetails")) {
  //       _currentMatch._showDetails = !_currentMatch._showDetails;
  //     } else {
  //       _currentMatch._showDetails = true;
  //     }
  //   }
  // }
};

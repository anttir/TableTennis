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

export const mutations = {
  add(state, data) {
    var _buttonIDs = [];
    data.buttonIDs.forEach(button => {
      _buttonIDs.push(button);
    });
    var r = new Remote(data.name, _buttonIDs);
    state.list.push(r);
  },
  addCodeToRemote(state, data) {
    var r = state.list[state.list.map(x => x.ID).indexOf(data.remoteID)];
    var code = parseInt(data.code);
    // poistetaan jos oli jo jossain käytössä
    state.list.forEach(remote => {
      if (remote.buttonIDs.includes(code)) {
        remote.buttonIDs.splice(remote.buttonIDs.indexOf(code), 1);
      }
    });
    // lisätään haluttuun
    if (!r.buttonIDs.includes(code)) {
      r.buttonIDs.push(code);
    }
  },
  // removeCodefromRemote(state, remote, buttonID) {
  // },
  remove(state, {
    remote
  }) {
    state.list.splice(state.list.indexOf(remote), 1);
  },
};
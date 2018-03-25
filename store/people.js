import {
  Person,
  Remote,
  Match,
  Player,
  Point,
  guidGenerator
} from "~/helpers/models";

export const state = () => ({
  list: []
});

export const mutations = {
  add(state, person) {
    if(!person.ID) person.ID =  guidGenerator();
    state.list.push(person);
  },
  remove(state, { person }) {
    state.list.splice(state.list.indexOf(person), 1);
  },
  changeColor(state, data) {
    var p = state.list[state.list.map(x => x.ID).indexOf(data.personID)];
    p.color = data.color;
  },
  toggle(state, person) {
    var p = state.list[state.list.indexOf(person)];
    p.color = p.color == "green" ? "red" : "green";
  }
};

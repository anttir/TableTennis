import {
  Person,
  Remote,
  Match,
  Player,
  Point,
  guidGenerator
} from "../helpers";

export const state = () => ({
  list: [
    new Person(1, "Antti", "red"),
    new Person(2, "Toinen", "blue"),
    new Person(3, "Kolmas", "green")
  ]
});

export const mutations = {
  add(state, person) {
    state.list.push(
      new Person(
        person.ID || guidGenerator(),
        person.name,
        person.color || "black"
      )
      // {
      // ID: person.ID || guidGenerator(),
      //   name: person.name,
      //   color: person.color || "black"
      // }
    );
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

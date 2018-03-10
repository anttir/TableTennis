export const state = () => ({
    list: []
  })
  
  export const mutations = {
    add (ID, name, color) {
      state.list.push({
        ID : ID,
        name : name,
        color : color || "black"
      })
    },
    remove (state, { person }) {
      state.list.splice(state.list.indexOf(person), 1)
    },
    toggle (state, person) {
      person.color = person.color == "green" ? "red" : "green";
    }
  }
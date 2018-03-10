export const state = () => ({
    list: []
  })
  
  export const mutations = {
    add (name, buttonIDs) {
      var _buttonIDs = [];
      buttonIDs.forEach(button => {
          this.buttonIDs.push(button);
      });
      state.list.push({
        name : name,
        buttonIDs : _buttonIDs
      })
    },
    remove (state, { remote }) {
      state.list.splice(state.list.indexOf(remote), 1)
    },
  }
export const state = () => ({
  // Authenticated can be undefined, true or false. If it is undefined
  // then we haven't attemted authentication yet.
  authenticated: undefined,
  sheetsAPIReady: false,
  tabs: {
    matches: {
//      datarange: "'Matches'!A2:H",
      datarange: "'Matches'!A800:H",
      columns: [
        "Start",
        "Player 1",
        "Player 1 Score",
        "Player 2",
        "Player 2 Score",
        "Last point",
        "Stats",
        "Data"
      ]
    },
    players: {
      datarange: "'Players'!A2:F",
      columns: ["ID", "Name", "Color", "Sound", "Language"]
    }
  }
});

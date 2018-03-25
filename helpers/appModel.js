/**
 * This is the data model of our application.
 */
const appModel = {
  // Authenticated can be undefined, true or false. If it is undefined
  // then we haven't attemted authentication yet.
  authenticated: undefined,
  sheetsAPIReady: false,
  // This API is whitelisted only for the following domains
  // http://localhost:8091
  // http://pingis.rasi.me
  // So if you want to run this on a different port, you'll need your own client id.
  // get from here - https://console.developers.google.com

  client_id:
    "572526352445-k37660j8ebca03euuudn7q8lq8e7r909.apps.googleusercontent.com",
  sheet: {
    kind: "drive#file",
    id: "1Iofv97Z6G-RUlhb9Rbtfhiu9ZAgUgoYUSmLrLCWg4Bc",
    name: "Table Tennis Scoreboard",
    mimeType: "application/vnd.google-apps.spreadsheet"
  },
  title: ""
};

export default appModel;

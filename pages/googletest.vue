<template>
  <div>
      Nyt alkaa jo vähän pänniä, kun tähän on mennyt kolme päivää aikaa?<br>

              <button @click="initializeGoogleApi">initializeGoogleApi</button>

      <div>
        <input v-model="textToInsert" type="text" />
        <button @click="addData">Lisää</button>
      </div>
      <div>
        <h2>State</h2>
        <table>
        <tr v-for="(value, key) in state" :key="key">
            <td>{{ key }}</td><td :style="{color: value ? 'green' : 'red'}">{{ value }}</td>
        </tr>
        <tr><td>unknown</td><td :style="{color: unknown ? 'green' : 'red'}">{{unknown}}</td></tr>
        <tr><td>apiLoaded</td><td :style="{color: apiLoaded ? 'green' : 'red'}">{{apiLoaded}}</td></tr>
        <tr><td>needsAuthentication</td><td :style="{color: needsAuthentication ? 'green' : 'red'}">{{needsAuthentication}}</td></tr>
        </table>
    </div>
  </div>
</template>
<script>
import { convertDateToSheetsDateString, getNow } from "~/helpers/dateUtils";

export default {
  data() {
    return {
      lastRecords: [],
      textToInsert: "testing - " + new Date(),
      config: {
        // This API is whitelisted only for the following domains
        // http://localhost:8091
        // http://localhost:3000
        // http://pingis.rasi.me
        // Admin here - https://console.developers.google.com
        client_id:
          "572526352445-k37660j8ebca03euuudn7q8lq8e7r909.apps.googleusercontent.com",
        sheet: {
          kind: "drive#file",
          id: "1Iofv97Z6G-RUlhb9Rbtfhiu9ZAgUgoYUSmLrLCWg4Bc",
          name: "Table Tennis Scoreboard",
          mimeType: "application/vnd.google-apps.spreadsheet"
        },
        scopes: "https://www.googleapis.com/auth/spreadsheets", // We need this to read/write time entries to the spreadsheet.
        DATA_RANGE: "A2:C"
      },
      state: {
        saveState: "",
        recordsState: "",
        authenticated: undefined,
        sheetsAPIReady: false,
        apiInitialized: false,
        doingWhat: ""
      }
    };
  },
  computed: {
    // Provides a Google Docs link to edit a spreadsheet
    editLink() {
      return `https://docs.google.com/spreadsheets/d/${this.sheetId}/edit`;
    },
    // The signed in state is a little bit tricky, since we want to show loader
    // only when visitor is not authenticated.
    unknown() {
      return this.state.authenticated === undefined;
    },
    apiLoaded() {
      return this.state.authenticated && this.sheetsAPIReady;
    },
    needsAuthentication() {
      return this.state.authenticated !== false;
    }
  },
  methods: {
    convertDateToSheetsDateString(date) {
      return convertDateToSheetsDateString(date);
    },
    /**
     * Attempts to refresh auth token in background. If Google Client is not loaded
     * yet, this function prepares window.initializeGoogleApi variable to be called
     * by index.html
     */
    initializeGoogleApi() {
      if (!gapi.auth) {
        // This means, google client was not yet loaded. We ask index.html
        // to call us when google client script is loaded.
        window.initializeGoogleApi = this.initializeGoogleApi;
        // And wait until client is loaded...
        return;
      }
      // On the other hand, if we've already initialized the API, we just bail out
      if (this.state.apiInitialized) {
        return;
      }
      // First time here - make sure no-one will ever call us again.
      this.state.apiInitialized = true;

      // Attempt to sign in in background
      this.signIn(/* immediate = */ true);
    },
    signIn(immediate) {
      return gapi.auth.authorize(
        {
          client_id: this.config.client_id,
          scope: this.config.scopes,
          immediate
        },
        this.handleAuthResult
      );
    },
    handleAuthResult(authResult) {
      this.state.authenticated = authResult && !authResult.error;
      if (this.state.authenticated) this.loadAPIs();
    },
    loadAPIs() {
      gapi.client
        .load("https://sheets.googleapis.com/$discovery/rest?version=v4")
        .then(() => {
          this.state.sheetsAPIReady = true;
        });
    },
    refreshRecords() {
      if (this.apiLoaded) {
        state.doingWhat = "Loading data...";
        getLastRecordsForComponent(this).then(() => {
          state.doingWhat = "Results";
          this.state.recordsState = "loaded";
        });
      } else {
        this.state.doingWhat = "Not logged in";
      }
    },
    addData() {
      this.state.saveState = "saving";
      const start = this.convertDateToSheetsDateString(new Date());
      const end = this.convertDateToSheetsDateString(new Date());
      const spreadsheetId = this.config.sheet.id;
      this.logTime(spreadsheetId, start, end, this.textToInsert).then(
        () => {
          this.textToInsert = "";
          this.state.saveState = "done";
          this.error = "";
          this.refreshRecords();
        },
        response => {
          this.state.saveState = "error";
          this.error = this.getError(response);
        }
      );
    },
    // Appends log entry to the given spreadsheet.
    logTime(spreadsheetId, start, end, what) {
      return gapi.client.sheets.spreadsheets.values
        .append({
          spreadsheetId,
          valueInputOption: "USER_ENTERED",
          range: this.config.DATA_RANGE,
          values: [[start, end, what]]
        })
        .then(this.id, this.checkError);
    },
    id(x) {
      console.info(x);
      return x;
    },
    checkError(response) {
      console.error(response);
      if (response.status === 401) {
        // this is invalid auth. Refresh the page should fix it
        window.location.reload();
      }
      return response;
    }

    // onSignInClick() {
    //   signIn().then(() => this.refreshRecords());
    // },
    // addData() {
    //   alert("undone");
    // }
  },
  filters: {
    moment: function(date) {
      return moment(date).format("L, LT");
    },
    truefalse: function(value) {
      if (value === true) return "<span>juu</span>";
      if (value === false) return "<span>ei</span>";
      return value;
    }
  },
  head() {
    return {
      // title: this.title,
      // meta: [],
      // link: [],
      script: [
        {
          type: "text/javascript",
          src: "https://apis.google.com/js/client.js?onload=checkAuthentication"
        }
      ]
    };
  }
};
</script>


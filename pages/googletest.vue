<template>
    <div>
        <button @click="initializeGoogleApi">initializeGoogleApi</button>
        <div v-if='unknown'>
            <h3>Checking authentication...</h3>
        </div>        
        <div v-if='apiLoaded'>
            <div>
                <input v-model="textToInsert" type="text" />
                <button @click="addData">Lisää</button>
            </div>
            <div  v-if='state.saveState === "saving"'>
                <h4>Saving...</h4>
                <div class='progress'>
                    <div class='indeterminate'></div>
                </div>
            </div>
            <div v-if='state.saveState === "error"' class='card-panel red-text'>
                <h4>Error...</h4>
                <pre><code>{{error}}</code></pre>
                <div>
                    Refresh the page maybe?
                </div>
            </div>
            <button @click="refreshRecords">Lataa</button>
            <table v-if='state.recordsState === "loaded"'>
                <tr v-for="(record, i) in lastRecords" :key="'r'+i">
                    <td v-for="(td, i) in record" :key="'td'+i">{{td}}</td>
                </tr>
            </table>
            <div v-if='state.recordsState === "loading"'>
                <h4>Loading records...</h4>
                <div class='progress'>
                    <div class='indeterminate'></div>
                </div>
            </div>
        </div>
        <div v-if='needsAuthentication'>
            <h1>Welcome!</h1>
            <p>
                hfhddf
            </p>
            <a class='waves-effect waves-light btn' @click='onSignInClick'>Sign in to Google Sheets</a>
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
      return this.state.authenticated && this.state.sheetsAPIReady;
    },
    needsAuthentication() {
      return this.state.authenticated === false;
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
    signOut(callback) {
      const token = gapi.auth.getToken();
      if (token) {
        const accessToken = token.access_token;
        const revokeUrl = `https://accounts.google.com/o/oauth2/revoke?token=${accessToken}`;

        window.jQuery.ajax({
          type: "GET",
          url: revokeUrl,
          async: false,
          contentType: "application/json",
          dataType: "jsonp",
          success: forwardCallback,
          error: forwardCallback
        });
      }
      gapi.auth.signOut();
      // Make sure we also forward callback right now, if there was no token.
      if (!token) setTimeout(forwardCallback, 0);
      function forwardCallback() {
        cleanAppModel();
        callback();
      }
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
        this.state.doingWhat = "Loading data...";
        this.getLastRecordsForComponent(this).then(() => {
          this.state.doingWhat = "Results";
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
    },
    getLastRecordsForComponent(target) {
      // immediately before loading, switch to progress mode:
      this.state.recordsState = "loading";
      const spreadsheetId = this.config.sheet.id;
      return this.fetchLastRecords(spreadsheetId).then(
        response => {
          // we've got our data!
          this.state.recordsState = "loaded";
          const values = response.result.values || [];
          this.lastRecords = values.reverse().slice(0, 100);
        },
        response => {
          console.error("failed to load range", response);
        }
      );
    },
    fetchLastRecords(spreadsheetId) {
      return gapi.client.sheets.spreadsheets.values
        .get({
          spreadsheetId,
          range: this.config.DATA_RANGE
        })
        .then(this.id, this.checkError);
    },
    onSignInClick() {
      this.signIn(() => this.refreshRecords());
    },
    onSignOutClick() {
      this.signOut(() => console.log("logged out"));
    }
    // getLastDate(records) {
    //   if (records.length === 0) return "";
    //   const lastRecord = records[0];
    //   if (lastRecord.length < 2) return "";
    //   const lastEnd = lastRecord[1];
    //   if (!lastEnd) return "";
    //   const d = new Date(lastEnd);
    //   if (Number.isNaN(d.getDate())) return "";
    //   return toDateInputStr(d);
    // }
  },
  filters: {
    moment: function(date) {
      return moment(date).format("L, LT");
    }
  },
//   mounted() {
//     console.info("automaattikirjautuminen");
//     this.initializeGoogleApi();
//   },
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


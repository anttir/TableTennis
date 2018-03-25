<template>
    <div>
        <div v-if='unknown'>
            <button class="btn m-2 btn-primary" @click="initializeGoogleApi">tarkista kirjautuminen</button>
            <h3>Checking authentication...</h3>
        </div>        
        <div v-if='apiLoaded'>
            <!-- <div>
                <input v-model="textToInsert" type="text" />
                <button @click="addData([new Date(), '-', textToInsert])">Lisää</button>
            </div> -->
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
            <button class="float-left btn m-2" @click="refreshRecords">Refresh</button>
            <a class="float-right btn m-2" target="_blank" :href='editLink'>Edit</a>
            <!-- {{fields}}<br> -->
            <b-table v-if='state.recordsState === "loaded"' striped hover outlined small :items="lastRecords" :fields="fields">
              <template slot="start" slot-scope="data">
                 {{data.item.start | momentExcel}}
              </template>
              <template slot="player_1" slot-scope="data">
                <span :class="{'font-weight-bold': data.item.player_1_score > data.item.player_2_score}">
                  {{data.item.player_1}}
                </span>
              </template>
              <template slot="player_2" slot-scope="data">
                <span :class="{'font-weight-bold': data.item.player_2_score > data.item.player_1_score}">
                  {{data.item.player_2}}
                </span>
              </template>
            </b-table>
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
                Reading data from Google Sheets requires sign in
            </p>
            <a class='waves-effect waves-light btn' @click='onSignInClick'>Sign in to Google Sheets</a>
        </div>
        <!-- <div>
          <b-btn v-b-toggle.collapse1 variant="primary">Status</b-btn>
          <b-collapse id="collapse1" class="mt-2">
            <b-card>
              <table>
                <tr v-for="(value, key) in state" :key="key">
                    <td>{{ key }}</td><td :style="{color: value ? 'green' : 'red'}">{{ value }}</td>
                </tr>
                <tr><td>unknown</td><td :style="{color: unknown ? 'green' : 'red'}">{{unknown}}</td></tr>
                <tr><td>apiLoaded</td><td :style="{color: apiLoaded ? 'green' : 'red'}">{{apiLoaded}}</td></tr>
                <tr><td>needsAuthentication</td><td :style="{color: needsAuthentication ? 'green' : 'red'}">{{needsAuthentication}}</td></tr>
              </table>
            </b-card>
          </b-collapse>
        </div>         -->
    </div>
</template>
<script>
import moment from "moment";
moment.locale("fi");
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
        DATA_RANGE: "'Points'!A2:E",
        columns: [
          "Start",
          "Player 1",
          "Player 2",
          "Player 1 Score",
          "Player 2 Score",
          // "Points"
        ]
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
    fields() {
      // return this.config.columns.map(c => c.replace(/ /g, "_").toLowerCase());

      return this.config.columns.map(c => {
        var o = {};
        o.key = c.replace(/ /g, "_").toLowerCase()
        o.label = c;
        o.sortable = true;
        return o;
      })
    },
    // Provides a Google Docs link to edit a spreadsheet
    editLink() {
      return `https://docs.google.com/spreadsheets/d/${this.config.sheet.id}/edit`;
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
  watch: {
    apiLoaded(val) {
      if (val) this.refreshRecords();
      this.$emit("ready");
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
    addData(match) {
      // puretaan peli sopiviin sarakkeisiin
      var points = match.players
        .map(p => p.points)
        .reduce((a, b) => a.concat(b), []);
      var data = [
        this.convertDateToSheetsDateString(match.startTime),
        match.players[0].person.name,
        match.players[1].person.name,
        match.playerScores[0],
        match.playerScores[1],
        JSON.stringify(match)
      ];
      this.state.saveState = "saving";
      const spreadsheetId = this.config.sheet.id;
      this.saveData(spreadsheetId, data).then(
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
    saveData(spreadsheetId, columns) {
      return gapi.client.sheets.spreadsheets.values
        .append({
          spreadsheetId,
          valueInputOption: "USER_ENTERED",
          range: this.config.DATA_RANGE,
          values: [columns]
        })
        .then(this.id, this.checkError);
    },
    id(x) {
      // console.info(x);
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
          var values = response.result.values || [];
          values = values.reverse().slice(0, 100);
          values = values.map(r => {
            var obj = {};
            r.map((c, i) => {
              obj[this.config.columns[i].replace(/ /g, "_").toLowerCase()] = c;
            });
            return obj;
          });
          this.lastRecords = values;
        },
        response => {
          console.error("failed to load range", response);
        }
      );
    },
    fetchLastRecords(spreadsheetId) {
      return gapi.client.sheets.spreadsheets.values
        .get({
          spreadsheetId: spreadsheetId,
          range: this.config.DATA_RANGE,
          dateTimeRenderOption: "SERIAL_NUMBER",
          majorDimension: "ROWS",
          valueRenderOption: "UNFORMATTED_VALUE"
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
    },
    momentExcel: function(date) {
      return moment(new Date(Math.round((date - 25569)*86400*1000))).utc().format("L, LT");
    },
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


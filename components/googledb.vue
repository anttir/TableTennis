<template>
    <div>
        <div v-if='unknown'>
            <button class="btn m-2 btn-primary" @click="initializeGoogleApi">Log in</button>
            <!-- <h3>Checking authentication...</h3> -->
        </div>        
        <div v-if='apiLoaded'>
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
            <div>
              <button class="float-left btn m-2" @click="refreshRecords">Refresh</button>
              <a class="float-right btn m-2" target="_blank" :href='editLink'>Edit</a>
            </div>
            <br style="clear:both" />
            <div v-if='recordsState === "loading"'>
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
    </div>
</template>
<script>
import {
  convertDateToSheetsDateString,
  getNow,
  ExcelSerialToDate
} from "~/helpers/dateUtils";
import {
  Person,
  Remote,
  Match,
  Player,
  Point,
  guidGenerator
} from "~/helpers/models";

export default {
  data() {
    return {
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
        scopes: "https://www.googleapis.com/auth/spreadsheets" // We need this to read/write time entries to the spreadsheet.
      },
      state: {
        saveState: "",
        recordStates: [],
        authenticated: undefined,
        sheetsAPIReady: false,
        apiInitialized: false
      }
    };
  },
  computed: {
    googleTabs() {
      return this.$store.state.google.tabs;
    },
    // Provides a Google Docs link to edit a spreadsheet
    editLink() {
      return `https://docs.google.com/spreadsheets/d/${
        this.config.sheet.id
      }/edit`;
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
    },
    recordsState() {
      if (
        this.state.recordStates.filter(x => x == true).length ==
        this.state.recordStates.length
      ) {
        this.$emit("recordsStateChange", "loaded");
        return "loaded";
      } else {
        this.$emit("recordsStateChange", "loading");
        return this.state.recordStates.length ? "loading" : "-";
      }
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
    ExcelSerialToDate(serial) {
      return ExcelSerialToDate(serial);
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
        this.state.recordStates = []; //.slice(0, this.state.recordStates.length);
        this.state.recordStates.push(false);
        this.state.recordStates.push(false);
        this.getRecordsFromTab(this, this.googleTabs.matches, null, true).then(
          data => {
            var currentMatch = this.$store.state.matches.list.slice(-1).pop(); // listan viimeinen
            this.$store.commit("matches/clear");
            data.forEach(p => {
              if (p.data) {
                var m = JSON.parse(p.data);
                m.startTime = new Date(m.startTime);
                this.$store.commit("matches/add", m);
              } else {
                // vanhimmista peleistä ei ole kaikkea dataa
                var tMatch = new Match(p.ID);
                tMatch.startTime = this.ExcelSerialToDate(p.start);
                var player1 = new Player(new Person(null, p.player_1));
                for (let i = 0; i < p.player_1_score; i++) {
                  player1.points.push(new Point());
                }
                player1.remote = this.$store.state.remotes.list[0];
                var player2 = new Player(new Person(null, p.player_2));
                for (let i = 0; i < p.player_2_score; i++) {
                  player2.points.push(new Point());
                }
                player2.remote = this.$store.state.remotes.list[1];
                tMatch.players.push(player1);
                tMatch.players.push(player2);
                this.$store.commit("matches/add", tMatch);
              }
            });
            this.$store.commit("matches/add", currentMatch);
            this.$set(this.state.recordStates, 0, true);
          }
        );
        this.getRecordsFromTab(this, this.googleTabs.players).then(data => {
          this.$store.commit("people/clear");
          data.forEach(p => {
            this.$store.commit(
              "people/add",
              new Person(p.id, p.name, p.color, p.sound, p.language)
            );
          });
          this.$set(this.state.recordStates, 1, true);
        });
      } else {
        // this.state.doingWhat = "Not logged in";
      }
    },
    addMatch(match) {
      if (!match.latestPoint) return; // ei yhtään pistettä
      // puretaan peli sopiviin sarakkeisiin
      var points = match.players
        .map(p => p.points)
        .reduce((a, b) => a.concat(b), [])
        .sort((a, b) => a.timestamp - b.timestamp);
      var data = [
        this.convertDateToSheetsDateString(match.startTime),
        match.players[0].person.name,
        match.playerScores[0],
        match.players[1].person.name,
        match.playerScores[1],
        this.convertDateToSheetsDateString(
          new Date(Math.max.apply(Math, points.map(p => p.timestamp)))
        ),
        JSON.stringify(match.stats),
        JSON.stringify(match)
      ];
      this.addData(this.googleTabs.matches, data);
    },
    addData(tab, data) {
      this.state.saveState = "saving";
      const spreadsheetId = this.config.sheet.id;
      this.saveData(spreadsheetId, tab, data).then(
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
    saveData(spreadsheetId, tab, columns) {
      return gapi.client.sheets.spreadsheets.values
        .append({
          spreadsheetId,
          valueInputOption: "USER_ENTERED",
          range: tab.datarange,
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
    getRecordsFromTab(target, tab, maxRows, reverse) {
      // immediately before loading, switch to progress mode:
      // this.state.recordsState = "loading";
      const spreadsheetId = this.config.sheet.id;
      return this.fetchLastRecords(spreadsheetId, tab).then(
        response => {
          // we've got our data!
          // this.state.recordsState = "loaded";
          var values = response.result.values || [];
          if (reverse) {
            values = values.reverse();
          }
          if (maxRows !== null) {
            maxRows = maxRows || 100; // undefined => 100
            values = values.slice(0, maxRows);
          }
          values = values.map(r => {
            var obj = {};
            r.map((c, i) => {
              obj[tab.columns[i].replace(/ /g, "_").toLowerCase()] = c;
            });
            return obj;
          });
          return values;
        },
        response => {
          console.error("failed to load range", response);
        }
      );
    },
    fetchLastRecords(spreadsheetId, tab) {
      return gapi.client.sheets.spreadsheets.values
        .get({
          spreadsheetId: spreadsheetId,
          range: tab.datarange,
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


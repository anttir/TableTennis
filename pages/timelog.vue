<template>
  <div>
    unknown {{unknown}}<br>
    apiLoaded {{apiLoaded}}<br>
    needsAuthentication {{needsAuthentication}}<br>
    authenticated {{authenticated}} <br>
    sheetsAPIReady {{sheetsAPIReady}}<br>
    <button @click="initGoogleApi()">käynnistä</button>
    <button @click="refreshRecords()">lataa</button>
    toimii {{new Date()}}
      <div v-if='unknown'>
        <h3>Checking authentication...</h3>
      </div>
      <div v-if='apiLoaded || true'>
        <form novalidate @submit.prevent='logIt'>
          <div class='input-field'>
            <label for='what'>What?</label>
            <input id='what' type='text' v-model='what'>
          </div>

          <div class='row' v-if='saveState !== "saving"'>
            <input type='submit' class='waves-effect waves-light btn col s12' value='Log time'/>
          </div>
        </form>
        <div  v-if='saveState === "saving"'>
          <h4>Saving...</h4>
          <div class='progress'>
              <div class='indeterminate'></div>
          </div>
        </div>
        <div v-if='saveState === "error"' class='card-panel red-text'>
          <h4>Error...</h4>
          <pre><code>{{error}}</code></pre>
          <div>
            Refresh the page maybe?
          </div>
        </div>
        <div v-if='recordsState === "loaded"'>
          <table >
            <thead>
              <tr>
                <th data-field='start'>Start</th>
                <th data-field='end'>End</th>
                <th data-field='what'>
                  What?
                  <a href='#' @click.prevent='refreshRecords' class='right' title='refresh'>&#x21bb;</a>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for='(i, record) in lastRecords' :key="'r' + i">
                <td>{{record[0]}}</td>
                <td>{{record[1]}}</td>
                <td>{{record[2]}}</td>
              </tr>
            </tbody>
          </table>
          <div class='fixed-action-btn' style='bottom: 12px; right: 12px;'>
            <a class='btn-floating btn-small red' :href='editLink' title='Edit records...' target='_blank'>
              <i class='small material-icons'>mode_edit</i>
            </a>
          </div>
        </div>
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
          hfhddf
        </p>
        <a class='waves-effect waves-light btn' @click='onSignInClick'>Sign in to Google Sheets</a>
      </div>
    </div>
</template>

<script>
// This is the heart of the application. This file may not be the prettiest.
import appModel from "~/helpers/appModel";
import {
  signIn,
  signOut,
  getError,
  logTime,
  getLastRecordsForComponent,
  initializeGoogleApi
} from "~/helpers/goog";
import { convertDateToSheetsDateString, getNow } from "~/helpers/dateUtils";

export default {
  data() {
    return {
      recordsState: "",
      lastRecords: [],
      start: "",
      end: getNow(),
      what: "",
      saveState: "",
      sheetId: appModel.sheet.id
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
      return appModel.authenticated === undefined;
    },
    apiLoaded() {
      return appModel.authenticated && appModel.sheetsAPIReady;
    },
    needsAuthentication() {
      return appModel.authenticated !== false;
    },
    /* apuja */
    authenticated() {
      return appModel.authenticated;
    },
    sheetsAPIReady() {
      return appModel.sheetsAPIReady;
    }
  },
  methods: {
    initGoogleApi() {
      initializeGoogleApi();
    },
    onSignInClick() {
      signIn().then(() => this.refreshRecords());
    },
    onSignOutClick() {
      // TODO: should I also navigate to root path?
      signOut(() => console.log("logged out"));
      // signOut(() => this.$router.push("loggedout"));
      // signOut(() => window.location.reload());
    },
    refreshRecords() {
      if (this.apiLoaded) {
        appModel.title = "Loading data...";
        getLastRecordsForComponent(this).then(() => {
          // debugger // eslint-disable-line
          const sheetId = this.sheetId;
          appModel.title = "Results";
          this.recordsState = "loaded";
        });
      } else {
        appModel.title = "Not logged in";
      }
    },
    logIt() {
      this.saveState = "saving";
      const start = convertDateToSheetsDateString(new Date());
      const end = convertDateToSheetsDateString(new Date());
      const spreadsheetId = this.sheetId;

      logTime(spreadsheetId, start, end, this.what).then(
        () => {
          // TODO: This is not very reliable.
          this.lastRecords.unshift([start, end, this.what]);
          this.start = this.end;
          this.end = getNow();

          this.what = "";
          this.saveState = "done";
          this.error = "";
          this.refreshRecords();
        },
        response => {
          this.saveState = "error";
          this.error = getError(response);
        }
      );
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

// And immediately try to initialize Google API, even if Google client is not yet loaded:
// initGoogleApi();
</script>

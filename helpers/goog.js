/**
 * The file provides a wrapper on top of Google API.
 */
import appModel from "./appModel.js";
import { toDateInputStr, getNow } from "./dateUtils.js";

// Defines where all time log records are.
//
// By default we are using only three columns:
//
//     A        B       C
// 1  Start    End     What?
// ---------------------------------
// 2    records go here
//
// So, our final range is:
const DATA_RANGE = "A2:C";

const SCOPES = [
  // We need this to read/write time entries to the spreadsheet.
  "https://www.googleapis.com/auth/spreadsheets"
];

let apiInitialized = false;

/**
 * Attempts to sign in
 * @param {bool} immediate - if true, then login uses "immediate mode", which
 * means that the token is refreshed behind the scenes, and no UI is shown to the user.
 */
export function signIn(immediate) {
  return gapi.auth.authorize(
    {
      client_id: appModel.client_id,
      scope: SCOPES,
      immediate
    },
    handleAuthResult
  );
}

export function signOut(callback) {
  const token = gapi.auth.getToken();
  if (token) {
    const accessToken = token.access_token;
    const revokeUrl = `https://accounts.google.com/o/oauth2/revoke?token=${accessToken}`;

    window.jQuery.ajax({
      type: 'GET',
      url: revokeUrl,
      async: false,
      contentType: 'application/json',
      dataType: 'jsonp',
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
}

function cleanAppModel() {
  appModel.authenticated = undefined;
}

/**
 * Gets last entries of a spreadsheet
 */
export function fetchLastRecords(spreadsheetId) {
  return gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId,
      range: DATA_RANGE
    })
    .then(id, checkError);
}

/**
 * Appends log entry to the given spreadsheet.
 */
export function logTime(spreadsheetId, start, end, what) {
  return gapi.client.sheets.spreadsheets.values
    .append({
      spreadsheetId,
      valueInputOption: "USER_ENTERED",
      range: DATA_RANGE,
      values: [[start, end, what]]
    })
    .then(id, checkError);
}

/**
 * Attempts to refresh auth token in background. If Google Client is not loaded
 * yet, this function prepares window.initializeGoogleApi variable to be called
 * by index.html
 */
export function initializeGoogleApi() {
  if (!gapi.auth) {
    // This means, google client was not yet loaded. We ask index.html
    // to call us when google client script is loaded.
    window.initializeGoogleApi = initializeGoogleApi;

    // And wait until client is loaded...
    return;
  }

  // On the other hand, if we've already initialized the API, we just bail out
  if (apiInitialized) {
    return;
  }

  // First time here - make sure no-one will ever call us again.
  apiInitialized = true;

  // Attempt to sign in in background
  signIn(/* immediate = */ true);
}

/**
 * Extracts error from Google API response
 */
export function getError(response) {
  if (!response) throw new Error("Response is required here");
  if (response.result && response.result.error) {
    return response.result.error.message;
  }
  return "Unknown error :(";
}

function handleAuthResult(authResult) {
  appModel.authenticated = authResult && !authResult.error;
  if (appModel.authenticated) loadAPIs();
}

function loadAPIs() {
  gapi.client
    .load("https://sheets.googleapis.com/$discovery/rest?version=v4")
    .then(() => {
      appModel.sheetsAPIReady = true;
    });
}

// function get(obj, path) {
//   if (!obj) return obj;
//   const parts = path.split(".");
//   for (let i = 0; i < parts.length; ++i) {
//     const key = parts[i];
//     obj = obj[key];
//     if (!obj) return obj;
//   }
//   return obj;
// }

function id(x) {
  return x;
}

function checkError(response) {
  if (response.status === 401) {
    // this is invalid auth. Refresh the page should fix it
    window.location.reload();
  }

  return response;
}

export function getLastRecordsForComponent(component) {
  // immediately before loading, switch to progress mode:
  component.recordsState = "loading";
  const spreadsheetId = appModel.sheet.id; 

  return fetchLastRecords(spreadsheetId).then(
    response => {
      // we've got our data!
      component.recordsState = "loaded";

      const values = response.result.values || [];
      const lastRecords = values.reverse().slice(0, 100);

      component.lastRecords = lastRecords;
      const lastDate = getLastDate(lastRecords);
      if (lastDate) component.start = lastDate;
      else {
        component.start = getNow();
        component.end = getNow();
      }
    },
    response => {
      console.error("failed to load range", response);
    }
  );
}

function getLastDate(records) {
  if (records.length === 0) return "";

  const lastRecord = records[0];
  if (lastRecord.length < 2) return "";

  const lastEnd = lastRecord[1];

  if (!lastEnd) return "";

  const d = new Date(lastEnd);
  if (Number.isNaN(d.getDate())) return "";

  return toDateInputStr(d);
}

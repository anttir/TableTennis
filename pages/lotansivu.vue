<template>
  <div>

    <h1>ESP8266 IR Remote</h1>
    <h2>Versterker</h2>
    <button type="button" @click="loadDoc('http://192.168.1.142/control?cmd=IRSEND,NEC,4bb620df,32')">Power on</button>
    <button type="button" @click="loadDoc('http://192.168.1.142/control?cmd=IRSEND,NEC,4b36e21d,32')">Power off</button><br><br>
    <button type="button" @click="loadDoc('http://192.168.1.142/control?cmd=IRSEND,NEC,4bb6d02f,32')">Input tuner</button>
    <button type="button" @click="loadDoc('http://192.168.1.142/control?cmd=IRSEND,NEC,4bb6f00f,32')">Input VIDEO1 (Laptop)</button>
    <button type="button" @click="loadDoc('http://192.168.1.142/control?cmd=IRSEND,NEC,4bb6906f,32')">Input CD (PC Coaxial)</button>
    <button type="button" @click="loadDoc('http://192.168.1.142/control?cmd=IRSEND,NEC,4bb6708f,32')">Input VIDEO2 (TV)</button><br><br>

    <button type="button" @click="loadDoc('http://192.168.1.142/control?cmd=IRSEND,NEC,4bb600ff,32')">Channel up</button>
    <button type="button" @click="loadDoc('http://192.168.1.142/control?cmd=IRSEND,NEC,4bb6807f,32')">Channel down</button><br><br>
    <button type="button" @click="loadDoc('http://192.168.1.142/control?cmd=IRSEND,NEC,4bb641be,32')">(Search) Up</button>
    <button type="button" @click="loadDoc('http://192.168.1.142/control?cmd=IRSEND,NEC,4bb6c13e,32')">(Search) Down</button><br><br>

    <button type="button" @click="loadDoc('http://192.168.1.142/control?cmd=IRSEND,NEC,4bb640bf,32')">Volume +</button>
    <button type="button" @click="loadDoc('http://192.168.1.142/control?cmd=IRSEND,NEC,4bb6c03f,32')">Volume -</button>
    <button type="button" @click="loadDoc('http://192.168.1.142/control?cmd=IRSEND,NEC,4bb6a05f,32')">Volume mute</button><br><br><br>
    <button type="button" @click="loadDoc('http://192.168.1.142/control?cmd=IRSEND,NEC,4bb632cd,32')">Listening mode up</button>
    <button type="button" @click="loadDoc('http://192.168.1.142/control?cmd=IRSEND,NEC,4b36a25d,32')">Listening mode down</button>
    <hr>
    <h2>TV</h2>
    <button type="button" @click="loadDoc('http://192.168.1.142/control?cmd=IRSEND,SAMSUNG,E0E09966,32')">Power on</button>
    <button type="button" @click="loadDoc('http://192.168.1.142/control?cmd=IRSEND,SAMSUNG,E0E019E6,32')">Power off</button><br><br>
    Response: <b><p id="output"></p></b>
    </div>
  
</template>
<script>
export default {
  data() {
    return {
      output: ""
    };
  },
  methods: {
    loadDoc(url) {
      console.log(url);
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          this.output = xhttp.responseText;
        }
      };
      xhttp.open("GET", url, true);
      xhttp.send();
    }
  }
};
</script>


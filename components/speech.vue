<template>
  <span>
      <!-- <select name="voice" id="voice">
          <option value="Microsoft Zira Desktop - English (United States)">Microsoft Zira Desktop - English (United States)</option>
          <option value="Google Deutsch">Google Deutsch</option>
          <option value="Google US English">Google US English</option>
          <option value="Google UK English Female">Google UK English Female</option>
          <option value="Google español">Google español</option>
          <option value="Google français">Google français</option>
          <option value="Google italiano">Google italiano</option>
        </select>
      <button @click="speak(text)">puhu</button> -->
  </span>
</template>
<script>
export default {
  methods: {
    speak(data) {
      var text = data.text || "testing";
      var languageID = data.languageID || "Google UK English Female";
      var languages = [
        "Microsoft Zira Desktop - English (United States)",
        "Google Deutsch",
        "Google US English",
        "Google UK English Female",
        "Google español",
        "Google français",
        "Google italiano"
      ];
      var msg = new SpeechSynthesisUtterance();
      msg.text = text;
      msg.voice = speechSynthesis.getVoices().find(
        voice => voice.name == languageID || voice.lang == languageID );
      window.speechSynthesis.speak(msg);
    }
  },
  mounted() {
    if ("speechSynthesis" in window) {
      this.message = "Your browser supports speech synthesis.";
      speechSynthesis.getVoices();
    } else {
      this.message = "Sorry your browser does not support speech synthesis.";
    }
  }
};
</script>

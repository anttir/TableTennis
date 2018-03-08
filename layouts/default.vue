<template>
  <nuxt></nuxt>
</template>

<script>
// if (process.browser) {
//   const $ = require("jquery");
// }
export default {
  head() {
    return {
      link: [
        { rel: "stylesheet", href: "jquery.bFlipText.css" },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css?family=Mina" }
        ],
      script: [
        {
          type: "text/javascript",
          src:
            "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"
        },
        { type: "text/javascript", src: "jquery.bFlipText.js" }
      ]
    };
  }
};
</script>

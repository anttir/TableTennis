<template>
  <div class="container">
    <H1>Table Tennis Scoring</H1>
    <nuxt/>
    <div>My footer</div>
  </div>
</template>

<script>
// if (process.browser) {
//   const $ = require("jquery");
// }
export default {
  head() {
    return {
      link: [
        { rel: "stylesheet", href: "/jquery.bFlipText.css" },
        { rel: "stylesheet", href: "//fonts.googleapis.com/css?family=Mina" },
        { rel: "stylesheet", href: "/fixes.css" }
        ],
      script: [
        {
          type: "text/javascript",
          src:
            "//ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"
        },
        { type: "text/javascript", src: "/jquery.bFlipText.js" }
      ]
    };
  }
};
</script>

<template>
  <div class="container">
    <nuxt/>
    <!-- <div>My footer</div> -->
  </div>
</template>

<script>
// if (process.browser) {
//   const $ = require("jquery");
// }
export default {
  data() {
    return {
      title: "Table Tennis Scoreboard"
    };
  },
  head() {
    return {
      title: this.title,
      meta: [
        { name: "msapplication-TileColor", content: "#ffffff" },
        {
          name: "msapplication-TileImage",
          content: "/favicon/ms-icon-144x144.png"
        },
        { name: "theme-color", content: "#ffffff" }
      ],
      link: [
        { rel: "stylesheet", href: "/jquery.bFlipText.css" },
        { rel: "stylesheet", href: "//fonts.googleapis.com/css?family=Mina" },
        { rel: "stylesheet", href: "/fixes.css" },

        {
          rel: "apple-touch-icon",
          sizes: "57x57",
          href: "/favicon/apple-icon-57x57.png"
        },
        {
          rel: "apple-touch-icon",
          sizes: "60x60",
          href: "/favicon/apple-icon-60x60.png"
        },
        {
          rel: "apple-touch-icon",
          sizes: "72x72",
          href: "/favicon/apple-icon-72x72.png"
        },
        {
          rel: "apple-touch-icon",
          sizes: "76x76",
          href: "/favicon/apple-icon-76x76.png"
        },
        {
          rel: "apple-touch-icon",
          sizes: "114x114",
          href: "/favicon/apple-icon-114x114.png"
        },
        {
          rel: "apple-touch-icon",
          sizes: "120x120",
          href: "/favicon/apple-icon-120x120.png"
        },
        {
          rel: "apple-touch-icon",
          sizes: "144x144",
          href: "/favicon/apple-icon-144x144.png"
        },
        {
          rel: "apple-touch-icon",
          sizes: "152x152",
          href: "/favicon/apple-icon-152x152.png"
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/favicon/apple-icon-180x180.png"
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "192x192",
          href: "/favicon/android-icon-192x192.png"
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon/favicon-32x32.png"
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "96x96",
          href: "/favicon/favicon-96x96.png"
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon/favicon-16x16.png"
        },
        { rel: "manifest", href: "/favicon/manifest.json" }
      ],
      script: [
        {
          type: "text/javascript",
          src: "//ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"
        },
        { type: "text/javascript", src: "/jquery.bFlipText.js" },
        { defer:"defer", src: "//use.fontawesome.com/releases/v5.0.8/js/all.js" }
      ]
    };
  }
};
</script>

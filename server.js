const express = require("express");
const app = express();
const { Nuxt, Builder } = require("nuxt");
const port = process.env.PORT || 3000;

const nuxt = new Nuxt(require("./nuxt.config.js"));

app.use(nuxt.render);

const isDev = process.env.NODE_ENV !== "production";
// Build only in test mode
if (isDev) {
  const builder = new Builder(nuxt);
  builder.build().then(() => {
    console.log("Nuxt built");
  });
} else {
  console.log("Nuxt built");
}
app.listen(port, () =>
  console.log("Example app listening on port " + port + "!")
);

<template>
  <div :id="id"/>
</template>

<script>

export default {
  props: ["text", "id"],
  mounted() {
      const $ = window.$
      if (process.browser) {
          var my_style = {
            width: "140px",
            "font-size": "140px",
            background: "#fff",
            color: "#000"
          };
          $(this.$el).bFlipText({
            text: this.text + "",
            css: my_style
          });

      }
  },
  beforeDestroy: function() {},
  watch: {
    text: function() {
      $(this.$el).bFlipTextPlay(this.text);
    }
  }
};
</script>


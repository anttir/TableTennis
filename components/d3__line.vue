<template>
    <path class="line" ref="line" :style="style"></path>
</template>

<script>
import * as d3 from "d3";

export default {
  props: ["layout", "seriesdata", "scale"],
  mounted: function() {
    this.drawLine();
  },
  methods: {
    drawLine: function() {
      // Get scale
      var scale = this.scale;

      // Line object
      
      var line = d3
        .line()
        .x(function(d) {
          return scale.x(d.x);
        })
        .y(function(d) {
          return scale.y(d.value);
        });

      // DOM node for line
      var $line = d3.select(this.$refs.line);
      $line
        .data([
          this.seriesdata.values.filter(function(d) {
            return typeof d.value !== typeof null;
          })
        ])
        .attr("d", line);
    }
  },
  computed: {
    style: function() {
      return {
        fill: "none",
        stroke: this.scale.color(this.seriesdata.id),
        strokeWidth: 2
      };
    }
  },
  watch: {
    // Changes to scale means we have to redraw the line!
    scale: {
      deep: true,
      handler: function(val, oldVal) {
        this.drawLine();
      }
    }
  }
};
</script>

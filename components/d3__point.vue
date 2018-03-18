<template>
    <circle class="point" ref="point" :style="style"></circle>

</template>
<script>
import * as d3 from "d3";

export default {
  // D3 component: points
  props: ["layout", "pointdata", "scale", "seriesid"],
  mounted: function() {
    this.drawPoint();
  },
  methods: {
    drawPoint: function() {
      // Get scales
      var scale = this.scale;

      // DOM node for points
      var $point = d3.select(this.$refs.point);
      $point
        .datum(this.pointdata)
        .attr("cx", function(d) {
          return scale.x(d.x);
        })
        .attr("cy", function(d) {
          return scale.y(d.value);
        })
        .attr("r", 5);
    }
  },
  computed: {
    style: function() {
      return {
        fill: "#fff",
        stroke: this.scale.color(this.seriesid),
        strokeWidth: 2
      };
    }
  },
  watch: {
    scale: {
      deep: true,
      handler: function(val, oldVal) {
        this.drawPoint();
      }
    }
  }
};
</script>
<style>

</style>

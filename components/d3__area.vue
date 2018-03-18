<template>
    <path class="area" ref="area" :style="style"></path>
</template>

<script>
import * as d3 from "d3";

// Component: D3 area
export default {
  props: ["layout", "seriesdata", "scale"],
  mounted() {
    this.drawArea();
  },
  methods: {
    drawArea() {
      // Get scale
      var scale = this.scale;

      // Area object
      var area = d3
        .area()
        .x(function(d) {
          return scale.x(d.x);
        })
        .y0(scale.y(0))
        .y1(function(d) {
          return scale.y(d.value);
        });

      // DOM node for area
      var $area = d3.select(this.$refs.area);

      $area
        .datum(
          this.seriesdata.values.filter(function(d) {
            return typeof d.value !== typeof null;
          })
        )
        .attr("d", area);
    }
  },
  computed: {
    style() {
      return {
        fill: this.scale.color(this.seriesdata.id),
        fillOpacity: 0.25
      };
    }
  },
  watch: {
    // Changes to scale means we have to redraw the line!
    scale: {
      deep: true,
      handler: function(val, oldVal) {
        this.drawArea();
      }
    }
  }
};
</script>
<style>

</style>

<template>
    <g :class="[classList]" ref="axis" :style="style"></g>
</template>

<script>
import * as d3 from "d3";

// Component: Chart axes
export default {
  props: ["axis", "layout", "scale", "xlinear"],
  data: function() {
    return {
      classList: ["axis"].concat(this.getAxisClasses())
    };
  },
  mounted: function() {
    this.drawAxis();
  },
  computed: {
    style: function() {
      return {
        transform: this.getAxisTransform()
      };
    }
  },
  methods: {
    // Return a class list containg the appropriate labels for axes
    getAxisClasses: function() {
      var axis = {
        top: "x",
        bottom: "x",
        left: "y",
        right: "y"
      };
      return [this.axis, axis[this.axis]];
    },

    // Draw axis
    drawAxis: function() {
      var $axis = d3.select(this.$refs.axis);
      var scale = this.scale;
      var yscalenumbers = Array.apply(null, {
        length: -scale.y.domain()[0] + scale.y.domain()[1] + 1
      }).map((x,i) => i + scale.y.domain()[0] ); // vain kokonaisluvut käyttöön
      var xscalenumbers = Array.apply(null, {
        length: -scale.x.domain()[0] + scale.x.domain()[1] + 1
      }).map((x,i) => i + scale.x.domain()[0] ); // vain kokonaisluvut käyttöön
      // .filter(function(d, i) { return !(i % 2); });
      var xTickformat = this.xlinear ? d3.format("d") : d3.timeFormat("%b %d");
      var axisGenerator = {
        top: d3.axisTop(scale.x).tickFormat(xTickformat),
        right: d3
          .axisRight(scale.y)
          .tickValues(yscalenumbers)
          .tickFormat(d3.format("d")),
        bottom: d3.axisBottom(scale.x).tickFormat(xTickformat),
        left: d3
          .axisLeft(scale.y)
          .tickValues(yscalenumbers)
          .tickFormat(d3.format("d"))
      };
      if (this.xlinear) {
        axisGenerator.top.tickValues(xscalenumbers);
        axisGenerator.bottom.tickValues(xscalenumbers);
      }

      $axis.call(axisGenerator[this.axis]);
    },

    // Return necessary axis transformation for proper positioning
    getAxisTransform: function() {
      var axisOffset = {
        top: { x: 0, y: 0 },
        right: { x: this.layout.width, y: 0 },
        bottom: { x: 0, y: this.layout.height },
        left: { x: 0, y: 0 }
      };

      return (
        "translate(" +
        axisOffset[this.axis].x +
        "px, " +
        axisOffset[this.axis].y +
        "px)"
      );
    }
  },
  watch: {
    // Changes to scale means we have to redraw the line!
    scale: {
      deep: true,
      handler: function(val, oldVal) {
        this.drawAxis();
      }
    }
  }
};
</script>
<style>

</style>

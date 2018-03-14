<template>
    <svg :view-box.camel="viewBox" preserveAspectRatio="xMidYMid meet">
    <g class="d3__stage" :style="stageStyle">
      <d3__axis
        v-for="(axis, i) in unique(axes)"
        :axis="axis"
        :layout="layout"
        :scale="scale"
        :key="'axis_' + i"
        ></d3__axis>
      <d3__series
        v-for="(seriesdata, i) in chartdata"
        :seriesdata="seriesdata" 
        :layout="layout"
        :scale="scale"
        :key="'series_' + i"
        ></d3__series>
    </g>
  </svg>
</template>
<script>
// FROM https://codepen.io/terrymun/pen/gmBdKq/?editors=0010

import * as d3 from "d3";
import d3__axis from "~/components/d3__axis";
import d3__series from "~/components/d3__series";

// Component: SVG parent and stage
export default {
  components: {
    d3__axis,
    d3__series
  },
  props: [
    "axes", // Chart axes
    "layout", // Dimensions for the chart and margins
    "chartdata" // Data for plotting
  ],
  computed: {
    // SVG viewbox
    viewBox() {
      var outerWidth =
          this.layout.width + this.layout.marginLeft + this.layout.marginRight,
        outerHeight =
          this.layout.height + this.layout.marginTop + this.layout.marginBottom;
      return "0 0 " + outerWidth + " " + outerHeight;
    },

    // Stage
    stageStyle() {
      return {
        transform:
          "translate(" +
          this.layout.marginLeft +
          "px," +
          this.layout.marginTop +
          "px)"
      };
    }
  },
  data() {
    return {
      scale: {
        x: this.getScaleX(),
        y: this.getScaleY(),
        color: d3
          .scaleOrdinal()
          .range(this.chartdata.map(x => x.color))
          .domain(this.chartdata.map(x => x.id))
      }
    };
  },
  methods: {
    unique(arr) {
      return arr.filter(function(item, i, ar) {
        return ar.indexOf(item) === i;
      });
    },
    getScaleX() {
      return d3
        .scaleTime()
        .range([0, this.layout.width])
        .domain(
          d3.extent(
            [].concat.apply(
              [],
              this.chartdata.map(x => x.values.map(y => y.timestamp))
            )
          )
        ); // kaikkien sarjojen kaikki valuet
    },

    // Get y-axis scale
    getScaleY() {
      return d3
        .scaleLinear()
        .range([this.layout.height, 0])
        .domain([
          0,
          d3.max(this.chartdata, function(d) {
            return d3.max(d.values, function(e) {
              return e.value;
            });
          })
        ]);
    }
  },
  watch: {
    // Watch for layout changes
    layout: {
      deep: true,
      handler: function(val, oldVal) {
        this.scale.x = this.getScaleX();
        this.scale.y = this.getScaleY();
      }
    },
    chartdata: {
      handler: function(val, oldVal) {
        this.scale.x = this.getScaleX();
        this.scale.y = this.getScaleY();
      },
      deep: true
    }
  }
};
</script>
<style>

</style>

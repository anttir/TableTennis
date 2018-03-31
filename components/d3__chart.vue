<template>
    <svg :view-box.camel="viewBox" preserveAspectRatio="xMidYMid meet">
    <g class="d3__stage" :style="stageStyle">
      <d3__axis
        v-for="(axis, i) in unique(axes)"
        :axis="axis"
        :layout="layout"
        :scale="scale"
        :key="'axis_' + i"
        :xlinear="xlinear"
        ></d3__axis>
      <d3__series
        v-for="(seriesdata, i) in chartdata"
        :seriesdata="seriesdata" 
        :layout="layout"
        :scale="scale"
        :key="'series_' + i"
        :seriestypes="seriestypes"
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
  props: {
    axes: { type: Array, default: () => ["bottom", "right"] }, // Chart axes
    seriestypes: { type: Array, default: () => ["line", "area", "scatter"] },
    layout: {
      type: Object,
      default: {
        width: 800,
        height: 200,
        marginTop: 45,
        marginRight: 50,
        marginBottom: 50,
        marginLeft: 35
      }
    }, // Dimensions for the chart and margins
    xlinear: { type: Boolean, default: true },
    chartdata: {
      type: Array,
      default: () => [
        {
          id: "-",
          color: null,
          values: [{ x: 0, value: 0 }]
        }
      ]
    } // Data for plotting
  },
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
      if (this.xlinear) {
        return d3
          .scaleLinear()
          .range([0, this.layout.width])
          .domain(
            d3.extent(
              [].concat.apply(
                [],
                this.chartdata.map(x => x.values.map(p => p.x)) // kaikkien sarjojen kaikki valuet
              )
            )
          );
      } else {
        return d3
          .scaleTime()
          .range([0, this.layout.width])
          .domain(
            d3.extent(
              [].concat.apply(
                [],
                this.chartdata.map(x => x.values.map(p => p.x)) // kaikkien sarjojen kaikki valuet
              )
            )
          );
      }
    },
    // Get y-axis scale
    getScaleY() {
      return d3
        .scaleLinear()
        .range([this.layout.height, 0])
        .domain([
          d3.min(this.chartdata, function(d) {
            return d3.min(d.values, function(e) {
              return e.value;
            });
          }),
          d3.max(this.chartdata, function(d) {
            return d3.max(d.values, function(e) {
              return e.value;
            });
          })
        ]);
    },
    updateChart() {
      this.scale.x = this.getScaleX();
      this.scale.y = this.getScaleY();
      this.scale.color = d3
        .scaleOrdinal()
        .range(this.chartdata.map(x => x.color))
        .domain(this.chartdata.map(x => x.id));
    }
  },
  watch: {
    // Watch for layout changes
    layout: {
      deep: true,
      handler: function(val, oldVal) {
        this.updateChart();
      }
    },
    chartdata: {
      deep: true,
      handler: function(val, oldVal) {
        this.updateChart();
      }
    },
    xlinear: {
      deep: true,
      handler: function(val, oldVal) {
        this.updateChart();
      }
    }
  }
};
</script>
<style>

</style>

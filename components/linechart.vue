<template>
  <div class="linechart" :id="id">
    <svg :width="width" :height="height">
        <g>
            <path v-for="(player,i) in match.players" :key="i" class="line" :d="paths.lines[i]" :style="{ stroke: player.person.color}" />
            <!--<path v-for="paths.lines" class="line" :d="paths.line" />-->
            <path class="selector" :d="paths.selector" />
        </g>
    </svg>
    </div>
</template>

<script>
import * as d3 from "d3";

export default {
  props: {
    latestpoint: {
      type: Date,
      default: () => null
    },
    currpoints: {
      type: Array,
      default: () => []
    },
    margin: {
      type: Object,
      default: () => ({
        left: 0,
        right: 0,
        top: 10,
        bottom: 10
      })
    },
    ceil: {
      type: Number,
      default: 100
    },
    match: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      id: "",
      width: 0,
      height: 0,
      paths: {
        area: "",
        lines: ["", ""],
        selector: ""
      },
      scaled: {
        x: null,
        y: null
      },
      animatedData: [],
      points: []
    };
  },
  computed: {
    padded() {
      const width = this.width - this.margin.left - this.margin.right;
      const height = this.height - this.margin.top - this.margin.bottom;
      return {
        width,
        height
      };
    }
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    this.onResize();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  watch: {
    latestpoint: function dataChanged(newData, oldData) {
      // this.tweenData(newData, oldData);
      this.update();
    },
    width: function widthChanged() {
      this.initialize();
      this.update();
    }
  },
  methods: {
    onResize() {
      this.width = this.$el.offsetWidth;
      this.height = this.$el.offsetHeight;
    },
    createLine: d3
      .line()
      .x(d => d.x)
      .y(d => d.y),
    createValueSelector: d3
      .area()
      .x(d => d.x)
      .y0(d => d.max)
      .y1(0),
    initialize() {
      this.scaled.x = d3.scaleTime().range([0, this.padded.width]);
      this.scaled.y = d3.scaleLinear().range([this.padded.height, 0]);
      this.scaled.z = d3.scaleOrdinal(d3.schemeCategory10);
      d3.axisLeft().scale(this.scaled.y);
      d3.axisBottom().scale(this.scaled.x);
    },
    update() {
      var allPoints = this.match.players
        .map(p => p.points)
        .reduce((a, b) => a.concat(b), []);
      this.scaled.x.domain(
        d3.extent(
          allPoints.concat([
            {
              timestamp: this.match.startTime
            }
          ]),
          (d, i) => d.timestamp
        )
      );
      this.scaled.y.domain([
        0,
        Math.max(this.ceil, d3.max(allPoints, d => d.currPlayerTotal))
      ]);
      this.points = [[], []];
      this.match.players.forEach((player, i) => {
        // origo
        if (player.points.length) {
          this.points[i].push({
            x: this.scaled.x(this.match.startTime),
            y: this.scaled.y(0),
            max: this.height
          });
        }
        player.points.forEach(point => {
          this.points[i].push({
            x: this.scaled.x(point.timestamp),
            y: this.scaled.y(point.currPlayerTotal),
            max: this.height
          });
        });
      });
      this.paths.lines.splice(0, this.paths.lines.length);
      for (let i = 0; i < 2; i++) {
        var t = this.createLine(this.points[i]);
        if (t) {
          this.paths.lines.push(t);
        }
      }
    }
  }
};
</script>

<style scoped>
.areaChart,
.linechart {
  height: 200px;
  width: 50%;
  border: 1px solid #ddd;
}

.axis--x path {
  display: none;
}

.line {
  fill: none;
  stroke: steelblue;
  stroke-width: 1.5px;
}

.area {
  fill: #76bf8a;
}
</style>

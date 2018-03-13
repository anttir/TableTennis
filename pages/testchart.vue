<template>
    <div>
        <header>
        <h1>Vue.js + d3.js</h1>
        <span class="byline">Drawing charts in a purely Vue.js manner, instead of using DOM construction features of d3.js.<br />
        <a href="https://codepen.io/terrymun/full/peQpxJ/">See alternative example</a></span>
        </header>

        <section id="chart">
        <d3__chart
            :layout="layout"
            :chartdata="chartData"
            :axes="axes" />
        <d3__chart
            :layout="layout"
            :chartdata="chartData2"
            :axes="axes" />
        </section>
        <!-- <section id="data">{{chartData}}</section> -->
        <section class="content">
        <p>Although drawn using d3.js, this SVG chart does not use the standard DOM manipuulations seen in most d3.js examples. Individual components of the charts, such as the line, points, and area, are assembled using Vue components instead. This SVG chart is truly reactive, thanks to Vue.js. The Vue instance of this chart is stored in the global <code>d3Vis</code> variable. You can test the following in your browser console:</p>
        <ul>
            <li>Change the dimensions. Try <code>d3Vis.layout.width = 1000</code> to update the <code>width</code> of the chart.</li>
            <li>Decide what axis to display. Try <code>d3Vis.axes.push('right')</code> to add a right axes</li>
            <li>Update margins. Try <code>d3Vis.layout.marginRight = 50</code> to increase the right margin to accommodate the additional axis added above</li>
        </ul>
        </section>
    </div>
</template>

<script>
import * as d3 from "d3";
import d3__chart from "~/components/d3__chart";

// Initialize chart
export default {
  components: {
    d3__chart
  },
  data() {
    return {
      layout: {
        width: 800,
        height: 250,
        marginTop: 45,
        marginRight: 50,
        marginBottom: 50,
        marginLeft: 50
      },
      axes: ["left", "bottom", "right"],
      columns: ["Timestamp", "Previous", "Current"],
      offset: 1,
      chartDataRaw: [
        ["2017-03-01T01:00:00", 1, 3],
        ["2017-03-02T01:00:00", 2, 6],
        ["2017-03-03T01:00:00", 2, 6],
        ["2017-03-04T01:00:00", 2, 6],
        ["2017-03-05T01:00:00", 2, 6],
        ["2017-03-06T01:00:00", 4, 6],
        ["2017-03-07T01:00:00", 9, 7],
        ["2017-03-08T01:00:00", 18, 14],
        ["2017-03-09T01:00:00", 23, 16],
        ["2017-03-10T01:00:00", 24, 16],
        ["2017-03-11T01:00:00", 24, 16],
        ["2017-03-12T01:00:00", 24, 16],
        ["2017-03-13T01:00:00", 25, 18],
        ["2017-03-14T01:00:00", 26, 19],
        ["2017-03-15T01:00:00", 30, 21],
        ["2017-03-16T01:00:00", 32, 23],
        ["2017-03-17T01:00:00", 32, 23],
        ["2017-03-18T01:00:00", 32, 23],
        ["2017-03-19T01:00:00", 32, 23],
        ["2017-03-20T01:00:00", 32, 23],
        ["2017-03-21T01:00:00", 32, 25],
        ["2017-03-22T01:00:00", 32, 26],
        ["2017-03-23T01:00:00", 32, 28],
        ["2017-03-24T01:00:00", 32, 29],
        ["2017-03-25T01:00:00", 32, 29],
        ["2017-03-26T01:00:00", 32, 29],
        ["2017-03-27T01:00:00", 32, 29],
        ["2017-03-28T01:00:00", 35, 29],
        ["2017-03-29T01:00:00", 35, 29],
        ["2017-03-30T01:00:00", 35, null],
        ["2017-03-31T01:00:00", 35, null]
      ],
      chartData2: [
        {
          id: "Previous",
          values: [
            { timestamp: 1488319200000, value: 1 },
            { timestamp: 1488405600000, value: 2 },
            { timestamp: 1488492000000, value: 2 },
            { timestamp: 1488578400000, value: 2 },
            { timestamp: 1488664800000, value: 2 },
            { timestamp: 1488751200000, value: 4 },
            { timestamp: 1488837600000, value: 9 },
            { timestamp: 1488924000000, value: 18 },
            { timestamp: 1489010400000, value: 23 },
            { timestamp: 1489096800000, value: 24 },
            { timestamp: 1489183200000, value: 24 },
            { timestamp: 1489269600000, value: 24 },
            { timestamp: 1489356000000, value: 25 },
            { timestamp: 1489442400000, value: 26 },
            { timestamp: 1489528800000, value: 30 },
            { timestamp: 1489615200000, value: 32 },
            { timestamp: 1489701600000, value: 32 },
            { timestamp: 1489788000000, value: 32 },
            { timestamp: 1489874400000, value: 32 },
            { timestamp: 1489960800000, value: 32 },
            { timestamp: 1490047200000, value: 32 },
            { timestamp: 1490133600000, value: 32 },
            { timestamp: 1490220000000, value: 32 },
            { timestamp: 1490306400000, value: 32 },
            { timestamp: 1490392800000, value: 32 },
            { timestamp: 1490479200000, value: 32 },
            { timestamp: 1490562000000, value: 32 },
            { timestamp: 1490648400000, value: 35 },
            { timestamp: 1490734800000, value: 35 },
            { timestamp: 1490821200000, value: 35 },
            { timestamp: 1490907600000, value: 35 }
          ]
        },
        {
          id: "Current",
          values: [
            { timestamp: 1488319200000, value: 3 },
            { timestamp: 1488405600000, value: 6 },
            { timestamp: 1488492000000, value: 6 },
            { timestamp: 1488578400000, value: 6 },
            { timestamp: 1488664800000, value: 6 },
            { timestamp: 1488751200000, value: 6 },
            { timestamp: 1488837600000, value: 7 },
            { timestamp: 1488924000000, value: 14 },
            { timestamp: 1489010400000, value: 16 },
            { timestamp: 1489096800000, value: 16 },
            { timestamp: 1489183200000, value: 16 },
            { timestamp: 1489269600000, value: 16 },
            { timestamp: 1489356000000, value: 18 },
            { timestamp: 1489442400000, value: 19 },
            { timestamp: 1489528800000, value: 21 },
            { timestamp: 1489615200000, value: 23 },
            { timestamp: 1489701600000, value: 23 },
            { timestamp: 1489788000000, value: 23 },
            { timestamp: 1489874400000, value: 23 },
            { timestamp: 1489960800000, value: 23 },
            { timestamp: 1490047200000, value: 25 },
            { timestamp: 1490133600000, value: 26 },
            { timestamp: 1490220000000, value: 28 },
            { timestamp: 1490306400000, value: 29 },
            { timestamp: 1490392800000, value: 29 },
            { timestamp: 1490479200000, value: 29 },
            { timestamp: 1490562000000, value: 29 },
            { timestamp: 1490648400000, value: 29 },
            { timestamp: 1490734800000, value: 29 },
            { timestamp: 1490821200000, value: null },
            { timestamp: 1490907600000, value: null }
          ]
        }
      ]
    };
  },
  methods: {
    mapdata(chartDataRaw, offset) {
      return function(id, index) {
        return {
          id: id,
          values: chartDataRaw.map(function(d) {
            return {
              timestamp: d3
                .utcParse("%Y-%m-%dT%H:%M:%S")(d[0])
                .setHours(0, 0, 0, 0),
              value: d[index + offset]
            };
          })
        };
      };
    }
  },
  computed: {
    chartData() {
      return this.columns
        .slice(this.offset)
        .map(this.mapdata(this.chartDataRaw, this.offset));
    }
  }
};
</script>

<style>
body {
  line-height: 1.75;
}

header {
  margin-bottom: 1.5rem;
}

h1 {
  margin-bottom: 0.5rem;
  text-align: center;
}
h1 + span.byline {
  display: block;
  text-align: center;
}

section {
  margin-bottom: 1.5rem;
}
section.content {
  padding: 0 1.5rem;
}

svg {
  background-color: #eee;
  width: 100%;
}

code {
  background-color: #f5f5f5;
  color: #e96900;
  padding: 3px 5px;
  margin: 0 2px;
  border-radius: 4px;
  white-space: nowrap;
}
</style>


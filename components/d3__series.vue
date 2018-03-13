<template>
    <g class="d3__series">
    <d3__area
      :layout="layout"
      :seriesdata="this.seriesdata"
      :scale="this.scale">
    </d3__area>
    <d3__line
      :layout="layout"
      :seriesdata="this.seriesdata"
      :scale="this.scale">
    </d3__line>
    <d3__scatter
      :layout="layout"
      :seriesdata="this.seriesdata"
      :scale="this.scale">
    </d3__scatter>
  </g>
</template>

<script>
// Component: Data series
import d3__area from "~/components/d3__area";
import d3__line from "~/components/d3__line";
import d3__scatter from "~/components/d3__scatter";

export default {
  components: {
    d3__area,
    d3__line,
    d3__scatter
  },
  props: ["layout", "seriesdata", "scale"]
};
</script>
<style>

</style>

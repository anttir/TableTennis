<template>
    <g class="d3__series">
    <d3__area v-if="seriestypes.includes('area')"
      :layout="layout"
      :seriesdata="seriesdata"
      :scale="scale"
      >
    </d3__area>
    <d3__line v-if="seriestypes.includes('line')"
      :layout="layout"
      :seriesdata="seriesdata"
      :scale="scale"
    >
    </d3__line>
    <d3__scatter v-if="seriestypes.includes('scatter')"
      :layout="layout"
      :seriesdata="seriesdata"
      :scale="scale"
      >
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
  props: ["layout", "seriesdata", "scale", "seriestypes"]
};
</script>
<style>

</style>

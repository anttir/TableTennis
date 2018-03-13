<template>
    <g class="points">
    <d3__point
               v-for="(pointdata,i) in seriesdata.values"
               v-if="typeof pointdata.value !== typeof null"
               :seriesid="seriesdata.id"
               :pointdata="pointdata"
               :layout="layout"
               :scale="scale"
               :key="i"></d3__point>
  </g>
</template>
<script>
import d3__point from "~/components/d3__point";

export default {
  components: {
    d3__point
  },
  props: ["layout", "seriesdata", "scale"],
  watch: {
    scale: {
      deep: true,
      handler: function() {} // Has to be included for nested components watch to fire properly
    }
  }
};
</script>
<style>

</style>

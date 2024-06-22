<script setup lang="ts">
import {
  VisXYContainer,
  VisAxis,
  VisCrosshair,
  VisTooltip,
  VisBulletLegend,
  VisGroupedBar,
} from "@unovis/vue";

type DataRecord = { x: number; y: number; y1: number };
defineProps<{
  graphData: DataRecord[];
  xNumTicks: number;
  x: (d: DataRecord) => number;
  y: ((d: DataRecord) => number)[];
  template: (d: DataRecord) => string;
  items: {
    name: string;
  }[];
}>();
</script>

<template>
  <div>
    <VisXYContainer
      v-if="graphData.length > 0"
      class="graph"
      :padding="{ top: 8, bottom: 2, left: 0, right: 6 }"
      :data="graphData"
    >
      <VisGroupedBar :x="x" :y="y" :group-width="20" :bar-padding="0.1" />
      <VisAxis
        :num-ticks="xNumTicks"
        :tick-line="undefined"
        :grid-line="false"
        type="x"
        label="Spieltag"
        :domain-line="false"
      />
      <VisAxis
        :fallback-value="0"
        :grid-line="true"
        type="y"
        :domain-line="false"
        :tick-line="undefined"
      />
      <VisTooltip />
      <VisCrosshair :template="template" />
    </VisXYContainer>
    <VisBulletLegend :items="items" />
  </div>
</template>

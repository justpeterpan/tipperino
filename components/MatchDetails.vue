<script lang="ts" setup>
import type { Match } from "~/types";

const props = defineProps<{
  details: Match;
}>();

function formatMatchTime(matchDateTime: string) {
  return new Date(matchDateTime).toLocaleTimeString("de-DE", {
    hour: "numeric",
  });
}
</script>
<template>
  <div>
    <h2>
      {{ details.location.locationCity }},
      {{ details.location.locationStadium }}
    </h2>
    <div>{{ formatMatchTime(details.matchDateTime) }}</div>
    <div>{{ details.group.groupName }}</div>
    <div class="flex gap-1">
      <div>{{ details.team1.teamName }}</div>
      <div>vs</div>
      <div>{{ details.team2.teamName }}</div>
    </div>
  </div>
</template>

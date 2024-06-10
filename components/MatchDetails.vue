<script lang="ts" setup>
import type { Match } from "~/types";

const props = defineProps<{
  details: Match;
  groupId: string;
  predictions:
    | {
        id: number;
        group: number;
        user: string;
        updatedAt: string;
        match: number;
        team1Id: number;
        team1Name: string;
        team1Score: number;
        team2Id: number;
        team2Name: string;
        team2Score: number;
      }[]
    | null;
}>();

const team1Score = defineModel("team1Score", { type: Number, default: 0 });
const team2Score = defineModel("team2Score", { type: Number, default: 0 });

const emit = defineEmits(["saved"]);

async function save() {
  await $fetch("/api/predictions", {
    method: "POST",
    body: {
      team1Score: team1Score.value,
      team1Name: props.details.team1.teamName,
      team1Id: props.details.team1.teamId,
      team2Score: team2Score.value,
      team2Name: props.details.team2.teamName,
      team2Id: props.details.team2.teamId,
      match: props.details.matchID,
      group: +props.groupId,
    },
  });
  emit("saved");
}

function predicted(match: number) {
  return props.predictions?.find((prediction) => prediction.match === match);
}
</script>
<template>
  <div class="text-base font-serif">
    <h2 class="flex items-center italic border max-w-fit">
      <UIcon name="i-heroicons-map-pin" /> {{ details.location.locationCity }},
      {{ details.location.locationStadium }}
    </h2>
    <div class="flex gap-1 items-center pt-2 max-w-fit border">
      <div>{{ details.team1.teamName }}</div>
      <UInput v-model="team1Score" type="number" class="w-6" size="2xs" />
      <div>:</div>
      <UInput v-model="team2Score" type="number" class="w-6" size="2xs" />
      <div>{{ details.team2.teamName }}</div>
      <UButton
        v-if="!predicted(details.matchID)"
        icon="i-heroicons-check"
        class="ml-2"
        color="black"
        square
        size="2xs"
        @click="save"
      />
      <UButton v-else icon="i-heroicons-pencil" square size="2xs" />
    </div>
  </div>
</template>

<style>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>

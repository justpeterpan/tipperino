<script lang="ts" setup>
import type { Match } from "../types";
import type { NotificationColor } from "#ui/types";

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

const toast = useToast();

const team1Score = defineModel("team1Score", { type: Number, default: 0 });
const team2Score = defineModel("team2Score", { type: Number, default: 0 });

team1Score.value = predicted(props.details.matchID)?.team1Score || 0;
team2Score.value = predicted(props.details.matchID)?.team2Score || 0;

const emit = defineEmits(["saved"]);
const isEditing = ref(false);
const hasStarted = computed(() => {
  return new Date(props.details.matchDateTimeUTC).getTime() < Date.now();
});

function handleEdit() {
  isEditing.value = !isEditing.value;
}

async function save() {
  const res = await $fetch<{ message: string; color: NotificationColor }>(
    "/api/predictions",
    {
      method: isEditing.value ? "PATCH" : "POST",
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
    }
  );
  toast.add({ title: res.message, color: res.color });
  isEditing.value = false;
  emit("saved");
}

function predicted(match: number) {
  return props.predictions?.find((prediction) => prediction.match === match);
}

function cancelEdit() {
  team1Score.value = predicted(props.details.matchID)?.team1Score || 0;
  team2Score.value = predicted(props.details.matchID)?.team2Score || 0;
  isEditing.value = false;
}
</script>
<template>
  <div class="text-base font-serif">
    <h2 class="flex items-center italic max-w-fit">
      <UIcon name="i-heroicons-map-pin" />{{ hasStarted }}
      {{ details.location.locationCity }},
      {{ details.location.locationStadium }}
    </h2>
    <div class="flex gap-2 items-center pt-2 max-w-fit">
      <div class="text-black dark:text-white">{{ details.team1.teamName }}</div>
      <UInput
        v-model="team1Score"
        type="number"
        class="w-8"
        size="xs"
        :disabled="hasStarted || (!isEditing && !!predicted(details.matchID))"
      />
      <div>:</div>
      <UInput
        v-model="team2Score"
        type="number"
        class="w-8"
        size="xs"
        :disabled="hasStarted || (!isEditing && !!predicted(details.matchID))"
      />
      <div class="text-black dark:text-white">{{ details.team2.teamName }}</div>
      <UButton
        v-if="!hasStarted && (isEditing || !predicted(details.matchID))"
        icon="i-heroicons-check"
        class="ml-2"
        color="black"
        square
        size="2xs"
        @click="save"
      />
      <UButton
        v-else-if="!hasStarted"
        icon="i-heroicons-pencil"
        class="ml-2"
        square
        size="2xs"
        @click="handleEdit"
      />
      <UButton
        v-if="isEditing"
        icon="i-heroicons-x-mark"
        square
        size="2xs"
        color="black"
        variant="outline"
        @click="cancelEdit"
      />
    </div>
  </div>
</template>

<style>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>

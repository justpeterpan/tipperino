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
const isLoading = ref(false);
const isChecked = ref(false);

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
  isChecked.value = true;
  setTimeout(async () => {
    isLoading.value = true;
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
    isChecked.value = false;
    emit("saved");
    // timout to prevent flashing of switch from save to edit button
    setTimeout(() => {
      isChecked.value = false;
      isLoading.value = false;
    }, 1000);
  }, 1000);
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
    <h2 class="flex items-center italic max-w-fit text-neutral-500">
      <UIcon name="i-heroicons-map-pin" />
      {{ details.location.locationCity }},
      {{ details.location.locationStadium }}
    </h2>
    <div class="flex gap-2 items-center pt-4 max-w-fit">
      <UInput
        v-model="team1Score"
        type="number"
        class="w-10"
        size="lg"
        :disabled="hasStarted || (!isEditing && !!predicted(details.matchID))"
      />
      <div>:</div>
      <UInput
        v-model="team2Score"
        type="number"
        class="w-10"
        size="lg"
        :disabled="hasStarted || (!isEditing && !!predicted(details.matchID))"
      />
      <UButton
        v-if="!hasStarted && (isEditing || !predicted(details.matchID))"
        id="check-btn"
        icon="i-heroicons-check"
        :disabled="isChecked"
        class="ml-2"
        :class="{ checked: isChecked }"
        color="black"
        square
        :loading="isLoading"
        @click="save"
      />
      <UButton
        v-else-if="!hasStarted"
        icon="i-heroicons-pencil"
        class="ml-2"
        square
        size="xs"
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

#check-btn {
  position: relative;
}

#check-btn.checked {
  filter: none;
  -webkit-animation: heart 1s cubic-bezier(0.17, 0.89, 0.32, 1.49);
  animation: heart 2s cubic-bezier(0.17, 0.89, 0.32, 1.49);
}

#check-btn.checked:before,
#check-btn.checked:after {
  position: absolute;
  z-index: -1;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  content: "";
  -webkit-animation: inherit;
  animation: inherit;
  -webkit-animation-timing-function: ease-out;
  animation-timing-function: ease-out;
}

#check-btn.checked:before {
  box-sizing: border-box;
  margin: -2.25rem;
  width: 4.5rem;
  height: 4.5rem;
  transform: scale(0);
  will-change: transform, border-width, border-color;
  -webkit-animation-name: bubble;
  animation-name: bubble;
}

.dark #check-btn.checked:before {
  box-sizing: border-box;
  margin: -2.25rem;
  width: 4.5rem;
  height: 4.5rem;
  transform: scale(0);
  will-change: transform, border-width, border-color;
  -webkit-animation-name: darkBubble;
  animation-name: darkBubble;
}

#check-btn.checked:after {
  margin: -0.1875rem;
  width: 0.375rem;
  height: 0.375rem;
  box-shadow: 0.32476rem -3rem 0 -0.1875rem #ff8080,
    -0.32476rem -2.625rem 0 -0.1875rem #ffed80,
    2.54798rem -1.61656rem 0 -0.1875rem #ffed80,
    1.84982rem -1.89057rem 0 -0.1875rem #a4ff80,
    2.85252rem 0.98418rem 0 -0.1875rem #a4ff80,
    2.63145rem 0.2675rem 0 -0.1875rem #80ffc8,
    1.00905rem 2.84381rem 0 -0.1875rem #80ffc8,
    1.43154rem 2.22414rem 0 -0.1875rem #80c8ff,
    -1.59425rem 2.562rem 0 -0.1875rem #80c8ff,
    -0.84635rem 2.50595rem 0 -0.1875rem #a480ff,
    -2.99705rem 0.35095rem 0 -0.1875rem #a480ff,
    -2.48692rem 0.90073rem 0 -0.1875rem #ff80ed,
    -2.14301rem -2.12438rem 0 -0.1875rem #ff80ed,
    -2.25479rem -1.38275rem 0 -0.1875rem #ff8080;
  will-change: opacity, box-shadow;
  -webkit-animation-name: sparkles;
  animation-name: sparkles;
}

@-webkit-keyframes heart {
  0%,
  17.5% {
    font-size: 0;
  }
}

@keyframes heart {
  0%,
  17.5% {
    font-size: 0;
  }
}

@-webkit-keyframes darkBubble {
  15% {
    transform: scale(1);
    border-color: #fff;
    border-width: 2.25rem;
  }
  30%,
  100% {
    transform: scale(1);
    border-color: #fff;
    border-width: 0;
  }
}

@keyframes darkBubble {
  15% {
    transform: scale(1);
    border-color: #fff;
    border-width: 2.25rem;
  }
  30%,
  100% {
    transform: scale(1);
    border-color: #fff;
    border-width: 0;
  }
}

@-webkit-keyframes bubble {
  15% {
    transform: scale(1);
    border-color: #000;
    border-width: 2.25rem;
  }
  30%,
  100% {
    transform: scale(1);
    border-color: #000;
    border-width: 0;
  }
}

@keyframes bubble {
  15% {
    transform: scale(1);
    border-color: #000;
    border-width: 2.25rem;
  }
  30%,
  100% {
    transform: scale(1);
    border-color: #000;
    border-width: 0;
  }
}

@-webkit-keyframes sparkles {
  0%,
  20% {
    opacity: 0;
  }
  25% {
    opacity: 1;
    box-shadow: 0.32476rem -2.4375rem 0 0rem #ff8080,
      -0.32476rem -2.0625rem 0 0rem #ffed80,
      2.1082rem -1.26585rem 0 0rem #ffed80,
      1.41004rem -1.53985rem 0 0rem #a4ff80,
      2.30412rem 0.85901rem 0 0rem #a4ff80, 2.08305rem 0.14233rem 0 0rem #80ffc8,
      0.76499rem 2.33702rem 0 0rem #80ffc8, 1.18748rem 1.71734rem 0 0rem #80c8ff,
      -1.35019rem 2.0552rem 0 0rem #80c8ff,
      -0.60229rem 1.99916rem 0 0rem #a480ff,
      -2.44865rem 0.22578rem 0 0rem #a480ff,
      -1.93852rem 0.77557rem 0 0rem #ff80ed,
      -1.70323rem -1.77366rem 0 0rem #ff80ed,
      -1.81501rem -1.03204rem 0 0rem #ff8080;
  }
}

@keyframes sparkles {
  0%,
  20% {
    opacity: 0;
  }
  25% {
    opacity: 1;
    box-shadow: 0.32476rem -2.4375rem 0 0rem #ff8080,
      -0.32476rem -2.0625rem 0 0rem #ffed80,
      2.1082rem -1.26585rem 0 0rem #ffed80,
      1.41004rem -1.53985rem 0 0rem #a4ff80,
      2.30412rem 0.85901rem 0 0rem #a4ff80, 2.08305rem 0.14233rem 0 0rem #80ffc8,
      0.76499rem 2.33702rem 0 0rem #80ffc8, 1.18748rem 1.71734rem 0 0rem #80c8ff,
      -1.35019rem 2.0552rem 0 0rem #80c8ff,
      -0.60229rem 1.99916rem 0 0rem #a480ff,
      -2.44865rem 0.22578rem 0 0rem #a480ff,
      -1.93852rem 0.77557rem 0 0rem #ff80ed,
      -1.70323rem -1.77366rem 0 0rem #ff80ed,
      -1.81501rem -1.03204rem 0 0rem #ff8080;
  }
}
</style>

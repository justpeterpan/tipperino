<script lang="ts" setup>
import type { NotificationColor } from "#ui/types";

const toast = useToast();
const props = defineProps<{
  questionId: number;
  question: string;
  groupId: string;
  teams: string[];
  players: {
    name: string;
    creast: string;
  }[];
  a: {
    id: number;
    group: number | null;
    user: string | null;
    updatedAt: string;
    question: number | null;
    answer: string;
  } | null;
}>();
const answer = ref(props.a?.answer || "");
const isEditing = ref(false);
const timeOfFirstMatch = new Date(1718391600000);
const hasStarted = computed(() => {
  return timeOfFirstMatch.getTime() < Date.now();
});

const emit = defineEmits(["saved"]);

function handleEdit() {
  isEditing.value = !isEditing.value;
}

function cancelEdit() {
  answer.value = props.a?.answer || "";
  isEditing.value = false;
}

async function saveAnswer() {
  if (selectedPlayer.value?.name) {
    answer.value = selectedPlayer.value.name;
  }
  if (selectedTeam.value) {
    answer.value = selectedTeam.value;
  }

  const res = await $fetch<{ message: string; color: NotificationColor }>(
    "/api/predictions/answers",
    {
      method: isEditing.value ? "PATCH" : "POST",
      body: {
        questionId: props.questionId,
        answer: answer.value,
        groupId: props.groupId,
      },
    }
  );

  toast.add({ title: res.message, color: res.color });
  isEditing.value = false;
  emit("saved");
}

const selectedPlayer = ref(
  props.a?.answer
    ? props.players.filter((player) => player.name === props.a?.answer)[0]
    : props.players[0]
);

const selectedTeam = ref(
  props.a?.answer
    ? props.teams.filter((team) => team === props.a?.answer)[0]
    : props.teams[0]
);

const doNotShowInput = computed(() => {
  if (
    props.questionId === 1 ||
    props.questionId === 2 ||
    props.questionId === 4 ||
    props.questionId === 5 ||
    props.questionId === 7
  ) {
    return false;
  }
  return true;
});
</script>

<template>
  <div>
    <div class="text-lg font-thin">{{ question }}</div>
    <div class="flex gap-2">
      <UInput
        v-if="doNotShowInput"
        v-model="answer"
        size="xl"
        class="flex-grow-[4]"
        :disabled="hasStarted || (!isEditing && !!props.a?.answer)"
      />
      <USelectMenu
        v-if="questionId === 1"
        size="xl"
        class="w-full"
        v-model="selectedPlayer"
        :options="players"
        searchable
        option-attribute="name"
        by="name"
        :disabled="hasStarted || (!isEditing && !!props.a?.answer)"
      >
        <template #option="{ option: player }">
          <img
            :src="player.creast"
            alt="country flag"
            class="rounded-full w-6 h-6 object-cover"
          />
          <span class="truncate">{{ player.name }}</span>
        </template>
      </USelectMenu>
      <USelectMenu
        v-if="
          questionId === 2 ||
          questionId === 4 ||
          questionId === 5 ||
          questionId === 7
        "
        size="xl"
        class="w-full"
        v-model="selectedTeam"
        :options="teams"
        searchable
        :disabled="hasStarted || (!isEditing && !!props.a?.answer)"
      >
        <template #option="{ option: team }">
          <span class="truncate">{{ team }}</span>
        </template>
      </USelectMenu>
      <UButton
        v-if="!hasStarted && (isEditing || !props.a?.answer)"
        icon="i-heroicons-check"
        size="xl"
        color="black"
        square
        @click="saveAnswer"
      />
      <UButton
        v-else-if="!hasStarted"
        icon="i-heroicons-pencil"
        size="xl"
        square
        @click="handleEdit"
      />
      <UButton
        v-if="isEditing"
        icon="i-heroicons-x-mark"
        square
        size="xl"
        color="black"
        variant="outline"
        @click="cancelEdit"
      />
    </div>
  </div>
</template>

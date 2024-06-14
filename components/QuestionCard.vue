<script lang="ts" setup>
import type { NotificationColor } from "#ui/types";

const toast = useToast();
const props = defineProps<{
  questionId: number;
  question: string;
  groupId: string;
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
</script>

<template>
  <div>
    <div class="text-lg font-thin">{{ question }}</div>
    <div class="flex gap-2">
      <UInput
        v-model="answer"
        size="xl"
        class="flex-grow-[4]"
        :disabled="hasStarted || (!isEditing && !!props.a?.answer)"
      />
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

<script lang="ts" setup>
const props = defineProps<{
  question: string;
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
</script>

<template>
  <div>
    <div class="text-lg font-thin">{{ question }}</div>
    <div class="flex gap-2">
      <UInput v-model="answer" size="xl" class="flex-grow-[4]" disabled />
    </div>
  </div>
</template>

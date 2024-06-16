<script lang="ts" setup>
const props = defineProps<{
  question: string;
  a: {
    [x: string]: {
      answer: string;
      group: number | null;
      question: number | null;
    }[];
    [x: number]: {
      answer: string;
      group: number | null;
      question: number | null;
    }[];
  } | null;
  qid: number;
  l: number | undefined;
}>();
</script>

<template>
  <div>
    <div class="text-lg/5 font-black text-rap mb-6">{{ question }}</div>
    <div>
      <div class="flex flex-col">
        <div v-for="(entries, person) of props.a">
          <div class="answer-grid text-lg/5 font-semibold">
            {{ person }}
            <div class="font-normal font-serif italic">
              {{ entries.find((e) => e.question === props.qid)?.answer }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <UDivider v-if="qid !== l" label="✦" class="my-6" />
  </div>
</template>

<style scoped>
.answer-grid {
  display: grid;
  grid-template-columns: minmax(min-content, 35%) 1fr;
}
</style>

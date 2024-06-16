<script setup lang="ts">
const route = useRoute();
const { data: questions } = await useFetch("/api/predictions/questions", {
  method: "GET",
});

const { data: answers } = await useFetch("/api/predictions/answers", {
  method: "GET",
  params: {
    group: route.params.id as string,
  },
});
</script>

<template>
  <div class="max-w-fit">
    <QuestionCard
      v-for="q of questions"
      :key="q.id"
      class="grid text-wrap"
      :class="{ 'mb-10': q.id === questions?.length }"
      :question="q.question"
      :answers="answers"
      :qid="q.id"
      :l="questions?.length"
      :a="answers"
    />
  </div>
</template>

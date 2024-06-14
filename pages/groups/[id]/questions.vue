<script setup lang="ts">
import players from "~/data/players.json" with { type: "json" };
import teams from "~/data/teams.json" with { type: "json" };

const route = useRoute();
const { data: questions } = await useFetch("/api/predictions/questions", {
  method: "GET",
});

const { data: answers, refresh: refreshAnswers } = await useFetch(
  "/api/predictions/answers",
  {
    method: "GET",
    params: {
      group: route.params.id as string,
    },
  }
);
</script>

<template>
  <div class="max-w-fit">
    <QuestionCard
      v-for="q of questions"
      :key="q.id"
      class="grid text-wrap gap-2 mb-10"
      :question-id="q.id"
      :question="q.question"
      :group-id="(route.params.id as string)"
      :a="answers?.filter((a) => a.question === q.id)[0] || null"
      :players="q.id === 1 ? players : []"
      :teams="q.id === 2 || q.id === 4 || q.id === 5 || q.id === 7 ? teams : []"
      @saved="refreshAnswers"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Match } from "~/types";

const nuxtApp = useNuxtApp();

definePageMeta({
  middleware: "auth",
});

const { data: matches } = await useFetch<Match[]>("/api/matches", {
  getCachedData(key) {
    return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
  },
});

const matchDates = new Set(
  matches.value
    ?.filter(
      (match) =>
        !match.group.groupName.includes("final") &&
        !match.group.groupName.includes("Finale")
    )
    .map((match) => match.matchDateTime.slice(0, 10))
);

const matchesPerDate = Array.from(matchDates).map((date) => {
  return {
    date,
    matches: matches.value?.filter((match) =>
      match.matchDateTime.includes(date)
    ),
  };
});
</script>
<template>
  <div>
    <MatchList :matches-per-date="matchesPerDate" />
  </div>
</template>

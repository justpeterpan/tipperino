<script lang="ts" setup>
definePageMeta({
  middleware: "auth",
});
const { data: matches } = await useFetch("/api/matches", { lazy: true });

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

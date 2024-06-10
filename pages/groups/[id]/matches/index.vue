<script lang="ts" setup>
const { data: matches } = await useFetch("/api/matches");

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
    <h1 class="text-xl/6 font-thin font-serif italic pb-10">gruppenphase</h1>
    <MatchList :matches-per-date="matchesPerDate" />
  </div>
</template>

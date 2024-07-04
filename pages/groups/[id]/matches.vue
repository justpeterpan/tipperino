<script lang="ts" setup>
import type { Match } from "~/types";

definePageMeta({ middleware: "auth" });

const { data: matches } = await useFetch<Match[]>("/api/matches");

const groupMatchDates = new Set(
  matches.value
    ?.filter(
      (match) =>
        !match.group.groupName.includes("final") &&
        !match.group.groupName.includes("Finale")
    )
    .map((match) => match.matchDateTime.slice(0, 10))
);

const koMatchDates = (
  round: "Achtelfinale" | "Viertelfinale" | "Halbfinale" | "Finale"
) => {
  return new Set(
    matches.value
      ?.filter((match) => match.group.groupName.includes(round))
      .map((match) => match.matchDateTime.slice(0, 10))
  );
};

const groupMatchesPerDate = Array.from(groupMatchDates).map((date) => {
  return {
    date,
    matches: matches.value?.filter((match) =>
      match.matchDateTime.includes(date)
    ),
  };
});

const koMatchesPerDate = (
  round: "Achtelfinale" | "Viertelfinale" | "Halbfinale" | "Finale"
) => {
  return Array.from(koMatchDates(round)).map((date) => {
    return {
      date,
      matches: matches.value?.filter((match) =>
        match.matchDateTime.includes(date)
      ),
    };
  });
};
</script>
<template>
  <div>
    <MatchList
      :matches-per-date="koMatchesPerDate('Viertelfinale')"
      stage="8"
    />
    <UDivider label="✦" class="my-8" />
    <MatchList
      :matches-per-date="koMatchesPerDate('Achtelfinale')"
      stage="16"
    />
    <UDivider label="✦" class="my-8" />
    <MatchList
      :matches-per-date="groupMatchesPerDate"
      stage="group"
      class="mb-4"
    />
  </div>
</template>

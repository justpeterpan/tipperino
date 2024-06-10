<script lang="ts" setup>
import type { Match } from "~/types";

const route = useRoute();
const { data: group } = await useFetch(`/api/groups/${route.params.id}`);
const { data: matches } = await useFetch<Match[]>(
  `${useRuntimeConfig().public.api}/getmatchdata/em2024/2024`
);

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
  <div class="pl-10 pb-10">
    <h2 class="font-thin lowercase italic text-sm/3">{{ group?.name }}</h2>
    <h1 class="text-xl/6 font-thin font-serif italic pb-10">gruppenphase</h1>

    <div v-for="date of matchesPerDate" class="pb-10">
      <div class="font-serif font-thin">
        {{ date.date }}
      </div>
      <div
        v-for="match of date.matches"
        :key="match.matchID"
        class="max-h-min max-w-min"
      >
        <NuxtLink
          v-if="
            !(
              match.group.groupName.includes('finale') ||
              match.group.groupName.includes('Finale')
            )
          "
        >
          <div
            class="flex flex-row gap-2 items-center font-black uppercase text-xl sm:text-4xl tracking-[-0.06em]"
          >
            <div class="team1">
              {{ match.team1.teamName }}
            </div>
            <div class="text-base lowercase italic font-serif font-medium">
              vs
            </div>
            <div class="team2">
              {{ match.team2.teamName }}
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

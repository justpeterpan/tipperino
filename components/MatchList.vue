<script lang="ts" setup>
import type { Match } from "~/types";

const props = defineProps<{
  matchesPerDate: { date: string; matches: Match[] | undefined }[];
}>();

const transformedMatches = computed(() => {
  return props.matchesPerDate.map((date) => {
    return {
      date: date.date,
      matches: date.matches?.map((match) => {
        return {
          ...match,
          label: `${match.team1.teamName} vs ${match.team2.teamName}`,
          slot: "details",
        };
      }),
    };
  });
});
</script>

<template>
  <div>
    <div v-for="date of transformedMatches" class="pb-10">
      <div class="font-serif font-thin">
        {{ date.date }}
      </div>
      <UAccordion :items="date.matches">
        <template #default="{ item }">
          <UButton
            color="white"
            variant="ghost"
            class="ml-0 p-0 max-w-fit"
            :ui="{ rounded: 'rounded-none' }"
          >
            <div
              class="flex flex-row gap-2 items-center font-black uppercase text-xl sm:text-4xl tracking-[-0.06em]"
            >
              <div class="team1">
                {{ item.team1.teamName }}
              </div>
              <div class="text-base lowercase italic font-serif font-medium">
                vs
              </div>
              <div class="team2">
                {{ item.team2.teamName }}
              </div>
            </div>
          </UButton>
        </template>
        <template #details="{ item }">
          <MatchDetails :details="item" />
        </template>
      </UAccordion>
    </div>
  </div>
</template>

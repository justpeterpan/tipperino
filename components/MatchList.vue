<script lang="ts" setup>
import type { Match } from "~/types";

defineProps<{
  matchesPerDate: { date: string; matches: Match[] | undefined }[];
}>();
</script>

<template>
  <div>
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

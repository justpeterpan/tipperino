<script lang="ts" setup>
import { ResultType, type Match } from "../types";

const route = useRoute();

const props = defineProps<{
  matchesPerDate: { date: string; matches: Match[] | undefined }[];
  stage: "group" | "16" | "8" | "4" | "2";
}>();

const { data: predictions, refresh: refreshPredictions } = await useFetch(
  "/api/predictions",
  {
    method: "GET",
    params: {
      group: route.params.id as string,
    },
  }
);

function predicted(match: number) {
  return predictions.value?.find((prediction) => prediction.match === match);
}

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

function formatMatchTime(matchDateTime: string) {
  return new Date(matchDateTime).toLocaleTimeString("de-DE", {
    hour: "numeric",
  });
}

function pointsOfTeam(match: Match, team: string) {
  const r = match.matchResults.find(
    (result) => result.resultTypeID === ResultType.Finished
  );

  return team === "team1" ? r?.pointsTeam1 : r?.pointsTeam2;
}

function isOpen(date: string): boolean {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);
  return new Date(date).getTime() >= currentDate.getTime();
}

const round = computed(() => {
  if (props.stage === "group") return "Gruppenphase";
  if (props.stage === "16") return "Achtelfinale";
  if (props.stage === "8") return "Viertelfinale";
  if (props.stage === "4") return "Halbfinale";
  if (props.stage === "2") return "Finale";
  return "Gruppenphase";
});
</script>

<template>
  <div class="max-w-fit">
    <h2
      class="text-4xl sm:text-5xl font-black uppercase mb-8 tracking-[-0.06em]"
    >
      {{ round }}
    </h2>
    <div v-for="date of transformedMatches" :key="date.date" class="max-w-fit">
      <UAccordion
        :items="[
          { label: date.date, defaultOpen: isOpen(date.date), slot: 'matches' },
        ]"
      >
        <template #default>
          <div class="flex items-center gap-2 mb-1 max-w-fit cursor-pointer">
            <UIcon name="i-heroicons-calendar" />
            <div class="font-serif font-thin text-lg">
              {{
                new Date(date.date).toLocaleDateString("de-DE", {
                  dateStyle: "full",
                })
              }}
            </div>
          </div>
        </template>
        <template #matches>
          <UAccordion :items="date.matches" multiple>
            <template #default="{ item }: { item: Match }">
              <UButton
                color="white"
                variant="ghost"
                class="ml-0 pl-0 max-w-fit dark:hover:bg-transparent"
              >
                <div class="grid grid-row-2">
                  <div
                    class="flex flex-row gap-2 items-center font-black uppercase text-xl sm:text-4xl tracking-[-0.06em]"
                  >
                    <div class="team1">
                      {{ item.team1.teamName }}
                    </div>
                    <div
                      class="text-base lowercase italic font-serif font-medium"
                    >
                      vs
                    </div>
                    <div class="team2">
                      {{ item.team2.teamName }}
                    </div>
                    <div
                      v-if="item.matchIsFinished"
                      class="text-xs sm:text-lg font-serif font-thin"
                    >
                      ({{ pointsOfTeam(item, "team1") }}
                      :
                      {{ pointsOfTeam(item, "team2") }})
                    </div>
                    <div v-else-if="predicted(item.matchID)">
                      <UIcon name="i-heroicons-check" class="text-2xl" />
                    </div>
                  </div>
                  <div
                    class="text-base text-neutral-500 flex gap-3 font-serif italic font-thin place-self-start"
                  >
                    <div class="items-center flex gap-1 text-neutral-500">
                      <UIcon name="i-heroicons-clock" />
                      {{ formatMatchTime(item.matchDateTime) }}
                    </div>
                    <div class="flex items-center gap-1">
                      <UIcon name="i-heroicons-user-group-20-solid" />
                      {{ item.group.groupName }}
                    </div>
                  </div>
                </div>
              </UButton>
            </template>
            <template #details="{ item }: { item: Match }">
              <MatchDetails
                class="-mt-2 pb-4"
                :details="item"
                :group-id="route.params.id as string"
                :predictions="predictions"
                @saved="refreshPredictions"
              />
            </template>
          </UAccordion>
        </template>
      </UAccordion>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ResultType, type Match } from "../types";

const route = useRoute();

const props = defineProps<{
  matchesPerDate: { date: string; matches: Match[] | undefined }[];
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
</script>

<template>
  <div class="max-w-fit">
    <div v-for="date of transformedMatches" class="pb-10 max-w-fit">
      <div class="flex items-center gap-2 mb-1 max-w-fit">
        <UIcon name="i-heroicons-calendar" />
        <div class="font-serif font-thin text-lg">
          {{
            new Date(date.date).toLocaleDateString("de-DE", {
              dateStyle: "full",
            })
          }}
        </div>
      </div>
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
                <div class="text-base lowercase italic font-serif font-medium">
                  vs
                </div>
                <div class="team2">
                  {{ item.team2.teamName }}
                </div>
                <div
                  v-if="item.matchIsFinished"
                  class="text-xs sm:text-lg font-serif font-thin"
                >
                  ({{
                    item.matchResults.find(
                      (result) => result.resultTypeID === ResultType.Finished
                    )?.pointsTeam1
                  }}
                  :
                  {{
                    item.matchResults.find(
                      (result) => result.resultTypeID === ResultType.Finished
                    )?.pointsTeam2
                  }})
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
            :details="item"
            :group-id="route.params.id as string"
            :predictions="predictions"
            @saved="refreshPredictions"
            class="-mt-2 pb-4"
          />
        </template>
      </UAccordion>
    </div>
  </div>
</template>

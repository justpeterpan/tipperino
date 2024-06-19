<script lang="ts" setup>
import { ResultType, type Match } from "~/types";
import { calculateScore } from "~/server/utils/predictions.js";

definePageMeta({
  middleware: "auth",
});

const route = useRoute();

const { data: matches } = await useFetch<Match[]>("/api/matches");

const { data } = await useFetch("/api/predictions/standings", {
  method: "GET",
  params: { group: route.params.id as string },
});

const { data: predictions } = await useFetch("/api/predictions/all");
</script>

<template>
  <div>
    <div class="font-black text-2xl">
      <ul>
        <li
          v-for="score of data?.scores"
          :key="score.userName"
          class="list-grid"
        >
          <UAccordion
            :items="[{ label: score.userName, slot: 'score' }]"
            multiple
          >
            <template #default="{ open }">
              <div class="accordion-grid items-center">
                <UIcon
                  name="i-heroicons-chevron-right-20-solid"
                  class="size-5 -ml-[6px] mt-1 ms-auto transform transition-transform duration-200"
                  :class="[open && 'rotate-90']"
                />
                <div
                  class="flex ml-4 sm:ml-1.5 justify-between lowercase cursor-pointer"
                >
                  {{ score.userName }}
                  <span class="text-right font-serif italic font-medium">
                    {{ score.points }} points</span
                  >
                </div>
              </div>
            </template>
            <template #score>
              <div class="mt-2 mb-6">
                <div v-for="p of data?.predictions" :key="p.id">
                  <div
                    v-if="p.user === score.userId"
                    class="font-thin font-serif italic text-lg ml-6"
                  >
                    {{ p.team1Name }} {{ p.team1Score }} : {{ p.team2Score }}
                    {{ p.team2Name }}
                    <span class="text-sm"
                      >({{
                        calculateScore(
                          {
                            team1Score: p?.team1Score,
                            team2Score: p?.team2Score,
                          },
                          {
                            team1Score:
                              matches
                                ?.find((m) => m.matchID === p.match)
                                ?.matchResults?.filter(
                                  (r) => r.resultTypeID === ResultType.Finished
                                )[0]?.pointsTeam1 ?? 0,
                            team2Score:
                              matches
                                ?.find((m) => m.matchID === p.match)
                                ?.matchResults?.filter(
                                  (r) => r.resultTypeID === ResultType.Finished
                                )[0]?.pointsTeam2 ?? 0,
                          }
                        )
                      }}
                      points)
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </UAccordion>
        </li>
      </ul>
    </div>
    <UDivider class="w-full mb-8 mt-8" label="✦" />
    <div class="mb-2">
      <div class="mb-8">
        <h2 class="text-3xl font-black">overall statistics</h2>
        <h3 class="font-serif italic text-lg/5">
          from {{ predictions?.count }} participants
        </h3>
      </div>
      <div class="card-grid gap-2">
        <UCard
          :ui="{
            background: 'bg-gray-900 dark:bg-gray-900',
            ring: 'ring-1 ring-gray-800 dark:ring-gray-800',
          }"
          class="text-white"
        >
          <div class="flex flex-col font-semibold gap-4">
            <div class="text-6xl font-bold">
              {{ predictions?.correctPredictions }}
            </div>
            <div class="text-balance text-base">
              correct
              {{
                predictions?.correctPredictions === 1
                  ? "prediction"
                  : "predictions"
              }}
            </div>
          </div>
        </UCard>
        <UCard
          :ui="{
            background: 'bg-gray-900 dark:bg-gray-900',
            ring: 'ring-1 ring-gray-800 dark:ring-gray-800',
          }"
          class="text-white"
        >
          <div class="flex flex-col font-semibold gap-4">
            <div class="text-6xl font-bold">
              {{ predictions?.scores.at(0) }}
            </div>
            <div>highest score</div>
          </div>
        </UCard>
      </div>
    </div>
    <div class="card-grid-right gap-2">
      <UCard
        class="mb-10 text-white"
        :ui="{
          background: 'bg-gray-900 dark:bg-gray-900',
          ring: 'ring-1 ring-gray-800 dark:ring-gray-800',
        }"
      >
        <div class="flex flex-col font-semibold gap-4">
          <div class="text-6xl font-bold">
            {{ predictions?.scores.at(-1) }}
          </div>
          <div>lowest score</div>
        </div>
      </UCard>
      <UCard
        class="mb-10 text-white"
        :ui="{
          background: 'bg-gray-900 dark:bg-gray-900',
          ring: 'ring-1 ring-gray-800 dark:ring-gray-800',
        }"
      >
        <div class="flex flex-col font-semibold gap-4">
          <div class="text-6xl font-bold">
            {{ predictions?.forgotten }}
          </div>
          <div>predictions forgotten</div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<style>
.card-grid {
  display: grid;
  grid-template-columns: 55% 1fr;
}
.card-grid-right {
  display: grid;
  grid-template-columns: 1fr 60%;
}

.accordion-grid {
  display: grid;
  grid-template-columns: 1% 1fr;
}
</style>

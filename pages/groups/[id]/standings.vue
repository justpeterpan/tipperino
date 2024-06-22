<script lang="ts" setup>
import { ResultType, type Match, type Prediction } from "~/types";
import { calculateScore } from "~/server/utils/predictions.js";
import {
  VisXYContainer,
  VisLine,
  VisAxis,
  VisCrosshair,
  VisTooltip,
  VisBulletLegend,
  VisGroupedBar,
} from "@unovis/vue";

definePageMeta({ middleware: "auth" });

const route = useRoute();

const { data: predictions } = await useFetch("/api/predictions/all");
const { data } = await useFetch("/api/predictions/standings", {
  method: "GET",
  params: { group: route.params.id as string },
});
const { data: matches } = await useFetch<Match[]>("/api/matches");

function getActualMatchResult(
  matchID: number,
  matches: Match[]
): { team1Score: number; team2Score: number } {
  const match = matches.find((m) => m.matchID === matchID);
  if (match) {
    const result = match.matchResults.find(
      (r) => r.resultTypeID === ResultType.Finished
    );
    if (result) {
      return { team1Score: result.pointsTeam1, team2Score: result.pointsTeam2 };
    }
  }
  return { team1Score: 0, team2Score: 0 };
}

function consolidateScore(
  data: Record<string, { match: number; date: string; score: number }[]>
) {
  const result = {};

  for (const user in data) {
    const matches = data[user];
    const scoresByDate = {};

    matches.forEach((match) => {
      if (!scoresByDate[match.date]) {
        scoresByDate[match.date] = 0;
      }
      scoresByDate[match.date] += match.score ?? 0;
    });

    result[user] = Object.keys(scoresByDate).map((date) => {
      return {
        date: date,
        score: scoresByDate[date] ?? 0,
      };
    });
  }

  return result;
}

function calcScore(
  data: {
    predictions: Prediction;
    user: number;
    scores: {
      userId: string;
      userName: string;
      points: number;
      group: number;
      rank?: number | undefined;
    }[];
  } | null,
  matches: Match[] | null
) {
  const scoresPerUser = {};
  data?.predictions.forEach((prediction) => {
    const actualResult = getActualMatchResult(prediction.match, matches || []);
    const score = calculateScore(
      { team1Score: prediction.team1Score, team2Score: prediction.team2Score },
      actualResult
    );

    if (!scoresPerUser[prediction.user]) {
      scoresPerUser[prediction.user] = [];
    }

    scoresPerUser[prediction.user].push({
      match: prediction.match,
      score: score ?? 0,
      date: new Date(prediction.date).toISOString().split("T")[0],
    });
  });
  const newScoresPerUser = consolidateScore(scoresPerUser);
  return newScoresPerUser;
}

function scoreForUser(index: number, matchDay: number, day) {
  return (
    Object.entries(calcScore(data.value, matches.value))[index][1].find(
      (s) => s.date === day
    )?.score || 0
  );
}

function prepareGraphData(): DataRecord[] {
  const finishedMatches =
    matches.value?.filter((match) => match.matchIsFinished) ?? [];
  const uniqueMatchDays = [
    ...new Set(
      finishedMatches.map((match) => match.matchDateTime.split("T")[0])
    ),
  ];
  return uniqueMatchDays.map((day, index) => ({
    x: index + 1,
    y: scoreForUser(0, index, day),
    y1: scoreForUser(1, index, day),
  }));
}

type DataRecord = { x: number; y: number; y1: number };
const template = (d: DataRecord) =>
  [
    `${
      data.value?.scores.find(
        (s) =>
          Object.entries(calcScore(data.value, matches.value))[0][0] ===
          s.userId
      )?.userName
    }: ${d.y}`,
    `${
      data.value?.scores.find(
        (s) =>
          Object.entries(calcScore(data.value, matches.value))[1][0] ===
          s.userId
      )?.userName
    }: ${d.y1}`,
  ].join(", ");
const x = (d: DataRecord) => d.x;
const y = [(d: DataRecord) => d.y, (d: DataRecord) => d.y1];
const xNumTicks = prepareGraphData().length;
const graphData: DataRecord[] = prepareGraphData();
const items = [
  {
    name:
      data.value?.scores.find(
        (s) =>
          Object.entries(calcScore(data.value, matches.value))[0][0] ===
          s.userId
      )?.userName || "who knows",
  },
  {
    name:
      data.value?.scores.find(
        (s) =>
          Object.entries(calcScore(data.value, matches.value))[1][0] ===
          s.userId
      )?.userName || "who knows",
  },
];
</script>

<template>
  <div>
    <div class="font-black text-2xl">
      <UCard class="mb-10">
        <VisXYContainer
          class="min-h-72 graph"
          :padding="{ top: 8, bottom: 2, left: 0, right: 6 }"
          :data="graphData"
        >
          <VisGroupedBar :x="x" :y="y" :group-width="20" :bar-padding="0.1" />
          <VisAxis
            :num-ticks="xNumTicks"
            :tick-line="undefined"
            :grid-line="false"
            type="x"
            label="Spieltag"
            :domain-line="false"
          />
          <VisAxis
            :fallback-value="0"
            :grid-line="true"
            type="y"
            :domain-line="false"
            :tick-line="undefined"
          />
          <VisTooltip />
          <VisCrosshair :template="template" />
        </VisXYContainer>
        <VisBulletLegend :items="items" />
      </UCard>
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
                  class="flex ml-4 sm:ml-2.5 justify-between lowercase cursor-pointer"
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

:root.dark {
  --vis-axis-grid-color: #2e2e2e;
}
</style>

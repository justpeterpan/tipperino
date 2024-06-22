<script lang="ts" setup>
import { ResultType, type Match, type Prediction } from "~/types";

definePageMeta({ middleware: "auth" });

const route = useRoute();

const { data: predictions } = await useFetch("/api/predictions/all");
const { data: matches } = await useFetch<Match[]>("/api/matches");
const { data } = await useFetch("/api/predictions/standings", {
  method: "GET",
  params: { group: route.params.id as string },
});

function getActualMatchResult(
  matchID: number,
  m: Match[]
): { team1Score: number; team2Score: number } {
  const ma = m.find((m) => m.matchID === matchID);
  if (ma) {
    const result = ma.matchResults.find(
      (r) => r.resultTypeID === ResultType.Finished
    );
    return {
      team1Score: result?.pointsTeam1 || 0,
      team2Score: result?.pointsTeam2 || 0,
    };
  }
  return { team1Score: 0, team2Score: 0 };
}
type ConsolidatedScore = Record<string, { date: string; score: number }[]>;
type Score = Record<string, { match: number; date: string; score: number }[]>;

function consolidateScore(data: Score): ConsolidatedScore {
  const result: ConsolidatedScore = {};

  for (const u in data) {
    const userMatches = data[u];
    const scoresByDate: { [key: string]: number } = {};

    userMatches.forEach((m) => {
      if (!scoresByDate[m.date]) {
        scoresByDate[m.date] = 0;
      }
      scoresByDate[m.date] += m.score ?? 0;
    });

    result[u] = Object.keys(scoresByDate).map((date) => {
      return {
        date: date,
        score: scoresByDate[date] ?? 0,
      };
    });
  }

  return result;
}

type Scores = {
  userId: string;
  userName: string;
  points: number;
  group: number;
  rank?: number | undefined;
}[];
type ScoreData = { predictions: Prediction; user: number; scores: Scores };

function calcScore(data: ScoreData | null, matches: Match[] | null) {
  const scoresPerUser: Score = {};
  data?.predictions.forEach((prediction) => {
    const actualResult = getActualMatchResult(prediction.match, matches || []);
    const score = calcS(
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

function scoreForUser(index: number, day: string) {
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
    y: scoreForUser(0, day),
    y1: scoreForUser(1, day),
  }));
}

const u = (user: number) => {
  return data.value?.scores.find(
    (s) =>
      Object.entries(calcScore(data.value, matches.value))[user][0] === s.userId
  )?.userName;
};

type DataRecord = { x: number; y: number; y1: number };
const template = (d: DataRecord) =>
  [`${u(0)}: ${d.y}`, `${u(1)}: ${d.y1}`].join(", ");
const x = (d: DataRecord) => d.x;
const y = [(d: DataRecord) => d.y, (d: DataRecord) => d.y1];
const items = [{ name: u(0) || "who knows" }, { name: u(1) || "who knows" }];
</script>

<template>
  <div>
    <div class="font-black text-2xl">
      <UCard class="mb-10 min-h-96">
        <ClientOnly>
          <ScoreGraph
            :graph-data="prepareGraphData()"
            :x-num-ticks="prepareGraphData().length"
            :x="x"
            :y="y"
            :items="items"
            :template="template"
          />
        </ClientOnly>
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
                        calcS(
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

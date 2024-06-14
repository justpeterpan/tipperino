<script lang="ts" setup>
definePageMeta({
  middleware: "auth",
});

const route = useRoute();

const { data } = await useFetch("/api/predictions/standings", {
  method: "GET",
  params: { group: route.params.id as string },
});
</script>

<template>
  <div>
    <div class="font-black text-4xl">
      <ul>
        <li
          v-for="score of data?.scores"
          :key="score.userName"
          class="list-grid"
        >
          <div class="text-left font-serif italic font-thin">
            {{ score.rank }}.
          </div>
          <div class="text-left lowercase">
            {{ score.userName }}
            <div>
              <div v-for="p of data?.predictions">
                <div
                  v-if="p.user === score.userId"
                  class="font-thin font-serif italic text-lg mt-1"
                >
                  {{ p.team1Name }} {{ p.team1Score }} : {{ p.team2Score }}
                  {{ p.team2Name }}
                </div>
              </div>
            </div>
          </div>
          <div class="text-right font-medium">{{ score.points }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
.list-grid {
  display: grid;
  margin-bottom: 8px;
  grid-template-columns: 50px auto 50px;
  max-width: 380px;
  line-height: 0.9em;
}
</style>

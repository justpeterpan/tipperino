<script lang="ts" setup>
import type { Group } from "~/types";

const nuxtApp = useNuxtApp();

definePageMeta({
  middleware: "auth",
});

const route = useRoute();

const { data: group, pending } = await useFetch<Group>(
  `/api/groups/${route.params.id}`,
  {
    getCachedData(key) {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
  }
);

const routes = [
  { name: "matches", path: "matches" },
  { name: "questions", path: "questions" },
  { name: "standings", path: "standings" },
];

const activeRoute = computed(() => {
  if (route.path.includes("matches")) return "matches";
  if (route.path.includes("standings")) return "standings";
  if (route.path.includes("questions")) return "questions";
});

if (!pending.value && !group.value) navigateTo("/");
if (!isNaN(Number(route.path.at(-1)))) {
  await navigateTo(`${route.path}/matches`);
}
</script>

<template>
  <div>
    <h1 class="text-sm font-light">✦ {{ group?.name }} ✦</h1>
    <SubNav :routes="routes" :active="activeRoute" />
    <NuxtPage />
  </div>
</template>

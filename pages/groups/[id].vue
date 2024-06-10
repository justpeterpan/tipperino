<script lang="ts" setup>
const route = useRoute();
const { data: group } = await useFetch(`/api/groups/${route.params.id}`);
const routes = [
  { name: "matches", path: "matches" },
  { name: "standings", path: "standings" },
];

if (!group.value) navigateTo("/");
</script>

<template>
  <div class="pl-10 pb-10">
    <SubNav
      :routes="routes"
      :active="route.path.includes('matches') ? 'matches' : 'standings'"
    />
    <NuxtPage />
  </div>
</template>

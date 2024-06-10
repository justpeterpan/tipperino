<script lang="ts" setup>
definePageMeta({
  middleware: "auth",
});
const route = useRoute();
const { data: group } = await useFetch(`/api/groups/${route.params.id}`, {
  lazy: true,
});
const routes = [
  { name: "matches", path: "matches" },
  { name: "standings", path: "standings" },
];

if (!group.value) navigateTo("/");
if (!isNaN(Number(route.path.at(-1)))) {
  await navigateTo(`${route.path}/matches`);
}
</script>

<template>
  <div>
    <SubNav
      :routes="routes"
      :active="route.path.includes('matches') ? 'matches' : 'standings'"
    />
    <NuxtPage />
  </div>
</template>

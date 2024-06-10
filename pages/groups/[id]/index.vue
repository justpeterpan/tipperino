<script lang="ts" setup>
const route = useRoute();
const { data: group } = await useFetch(`/api/groups/${route.params.id}`);

if (!group.value) {
  navigateTo("/");
}

navigateTo(`${group.value?.id}/matches`);
</script>

<template>
  <div class="pl-10 pb-10">
    <h2 class="font-thin lowercase italic text-sm/3">{{ group?.name }}</h2>
    <NuxtPage />
  </div>
</template>

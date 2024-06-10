<script setup lang="ts">
defineProps<{
  routes: { path: string; name: string }[];
  active: "matches" | "standings";
}>();
</script>
<template>
  <div class="max-w-fit">
    <div class="flex gap-2 mb-8">
      <ULink v-for="route of routes" :key="route.name" :to="route.path">
        <h1
          class="text-xl/6 font-thin font-serif italic"
          :class="{
            'underline decoration-2 underline-offset-4': active === route.name,
          }"
        >
          {{ route.name }}
        </h1>
      </ULink>
    </div>
  </div>
</template>

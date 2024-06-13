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
    <div class="italic font-serif text-4xl">
      ✦ soon ✦
      <!-- <ul class="w-32">
        <li v-for="d of data" :key="d" class="flex justify-between">
          <div>
            {{ d }}
          </div>
          <div>0</div>
        </li>
      </ul> -->
    </div>
  </div>
</template>

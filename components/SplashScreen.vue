<script lang="ts" setup>
const { loggedIn } = useUserSession();
</script>

<template>
  <main
    class="grid grid-flow-row sm:grid-flow-col grid-rows-2 sm:grid-rows-none sm:grid-cols-2 justify-items-center items-center h-dvh"
  >
    <div class="size-full grid justify-items-center items-center">image</div>
    <div class="size-full grid justify-items-center items-center">
      <UButton v-if="!loggedIn" to="/api/auth/auth0" label="Login" external />
    </div>
  </main>
</template>

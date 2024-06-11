<script lang="ts" setup>
const { loggedIn } = useUserSession();
</script>

<template>
  <main
    class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-72 w-auto grayscale-0 object-cover"
        src="/rhino.webp"
        alt="Your Company"
      />
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <UButton
          v-if="!loggedIn"
          to="/api/auth/auth0"
          label="Login"
          color="black"
          size="xl"
          external
          block
        />
        <UButton
          v-else
          to="/dashboard"
          label="Dashboard"
          color="black"
          size="xl"
          block
          @click="console.log('clicked')"
        />
      </div>
    </div>
  </main>
</template>

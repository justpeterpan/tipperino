<script lang="ts" setup>
const { session, user } = useUserSession();
</script>

<template>
  <div>
    <h1>home</h1>
    <div>{{ user }}</div>
    <div>{{ session }}</div>
  </div>
</template>

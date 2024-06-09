<script setup lang="ts">
const { loggedIn, clear } = useUserSession();

useSeoMeta({
  title: "Tipperino",
  description: "Gib Stoff, Junge",
});

const menuItems = [
  { label: "Settings", target: "/settings" },
  { label: "Logout", action: clear },
];
</script>

<template>
  <div class="grid justify-items-center items-center h-dvh">✦ soon ✦</div>
</template>

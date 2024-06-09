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
  <div>
    <nav
      class="absolute w-full px-10 h-16 mb-16 flex items-center border-b border-emerald-400/20"
    >
      <ul class="flex justify-between w-full">
        <li>
          <NuxtLink to="/">
            <UIcon name="i-heroicons-trophy-20-solid w-6 h-6" />
          </NuxtLink>
        </li>
        <li v-if="loggedIn">
          <UserMenu :menu-items="menuItems" />
        </li>
      </ul>
    </nav>
    <NuxtPage class="pt-20 h-dvh px-4" />
    <UNotifications />
  </div>
</template>

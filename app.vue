<script setup lang="ts">
const { loggedIn, clear, user } = useUserSession();

useSeoMeta({
  title: "Tipperino",
  description: "Gib Stoff, Junge",
});

const { data: members, refresh: refreshMembers } = await useFetch(
  "/api/members",
  {
    transform: (data) => {
      return data.map((member) => {
        return {
          label: member.name ?? "",
          target: `/groups/${member.id}`,
        };
      });
    },
  }
);

const menuItems = ref([
  { label: "Settings", target: "/settings" },
  { label: "Logout", action: clear },
]);

const mergedMenuItems = computed(() => [
  ...(members.value ?? []),
  ...menuItems.value,
]);
</script>

<template>
  <div class="bg-amber">
    <nav class="h-16 w-full flex items-center just">
      <ul class="w-full flex justify-between px-4">
        <li>
          <NuxtLink to="/">
            <UIcon name="i-heroicons-trophy-20-solid w-6 h-6" />
          </NuxtLink>
        </li>
        <li v-if="loggedIn">
          <UserMenu :menu-items="mergedMenuItems" @clicked="refreshMembers" />
        </li>
      </ul>
    </nav>
    <NuxtPage class="pt-8 h-dvh px-4" />
    <UNotifications />
  </div>
</template>

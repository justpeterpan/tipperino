<script setup lang="ts">
const { loggedIn, clear } = useUserSession();

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
          target: `/groups/${member.id}/matches`,
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
  <div>
    <nav class="h-16 w-full flex items-center">
      <ul class="w-full flex flex-row-reverse justify-between px-4">
        <li v-if="loggedIn">
          <UserMenu :menu-items="mergedMenuItems" @clicked="refreshMembers" />
        </li>
      </ul>
    </nav>
    <NuxtPage class="pt-2 px-4" />
    <UNotifications />
  </div>
</template>

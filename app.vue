<script setup lang="ts">
const nuxtApp = useNuxtApp();
const { loggedIn, clear, user } = useUserSession();
const router = useRouter();

const isOpen = defineModel("isOpen", { default: false });
const username = defineModel("username", { default: "" });

if (user.value?.name === "") {
  isOpen.value = true;
}

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
          to: `/groups/${member.id}/matches`,
          icon: "i-heroicons-users",
        };
      });
    },
    getCachedData(key) {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
  }
);

const mergedMenuItems = computed(() => [
  [{ label: "Dashboard", to: "/dashboard", icon: "i-heroicons-cog-8-tooth" }],
  [...(members.value ?? [])],
  [
    {
      label: "Logout",
      click: async () => {
        clear();
        await navigateTo("/");
      },
      icon: "i-heroicons-arrow-left-on-rectangle",
    },
  ],
]);

async function saveUsername() {
  await useRequestFetch()("/api/auth/user", {
    method: "PATCH",
    body: { name: username.value },
  });
  isOpen.value = false;
  // we have to reload the page to get the replaced user session
  window.location.reload();
}
</script>

<template>
  <NuxtLoadingIndicator color="#10B981" />
  <div class="antialiased">
    <nav class="h-16 w-full flex items-center">
      <ul class="w-full flex flex-row-reverse justify-between px-4">
        <li v-if="loggedIn">
          <UserMenu :menu-items="mergedMenuItems" />
        </li>
      </ul>
    </nav>
    <NuxtPage class="pt-2 px-4" />
    <UModal
      v-model="isOpen"
      prevent-close
      :ui="{
        overlay: {
          background: 'backdrop-blur-xl dark:bg-black/60',
        },
        container:
          'flex min-h-full items-start sm:items-end sm:items-center justify-center text-center',
      }"
    >
      <UCard>
        <template #header
          ><h2 class="text-lg font-semibold">Username</h2>
        </template>
        <div>
          <div class="text-wrap">
            Before continuing you have to set a unique username.
          </div>
          <div class="flex flex-col gap-4 p-4">
            <UInput v-model="username" placeholder="enter username" size="xl" />
            <UButton
              label="Save"
              @click="saveUsername"
              color="black"
              size="xl"
              :disabled="!username"
            />
          </div>
        </div>
      </UCard>
    </UModal>
    <UNotifications />
  </div>
</template>

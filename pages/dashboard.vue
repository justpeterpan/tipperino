<script lang="ts" setup>
import type { Group } from "../types";

definePageMeta({
  middleware: "auth",
});

const { user } = useUserSession();
const toast = useToast();

const isOpen = defineModel("isOpen", { default: false });
const isLoading = ref(false);

const { data: groups, refresh: refreshGroups } = await useFetch<Group[]>(
  "/api/members"
);
const { data: invites, refresh: refreshInvites } = await useFetch(
  "/api/invites"
);

const adminGroups = computed(() =>
  groups.value?.filter((g) => g.role === "admin")
);

const groupName = defineModel("groupName", { default: "" });

function cancel() {
  isOpen.value = false;
  groupName.value = "";
}

async function create() {
  isLoading.value = true;
  const res = await useRequestFetch()("/api/groups", {
    method: "POST",
    body: {
      name: groupName.value,
      admin: user.value?.id ?? "",
    },
  });
  isLoading.value = false;
  await refreshGroups();
  isOpen.value = false;
  groupName.value = "";
  toast.add({
    title: `Group '${res?.group.name}' created, you're ${res?.member.role}!`,
  });
}

// filter members by admin role
const selected = ref(adminGroups.value?.[0]);
const inviteName = defineModel("inviteName", { default: "" });
async function invite() {
  const res = await $fetch<{ message: string }>("/api/invites", {
    method: "POST",
    body: {
      group: selected.value?.id,
      user: inviteName.value,
      by: user.value?.id,
    },
  });
  toast.add({
    title: res.message,
  });
  inviteName.value = "";
  await refreshInvites();
}

async function accept(id: number, group: number) {
  await useRequestFetch()("/api/invites/accept", {
    method: "POST",
    body: { id, group },
  });
  await refreshInvites();
  await refreshGroups();
}

async function decline(id: number) {
  await useRequestFetch()("/api/invites/decline", {
    method: "POST",
    body: { id },
  });
  await refreshInvites();
  // todo check if refresh is neccessary
  await refreshGroups();
}
</script>

<template>
  <div>
    <h3 class="text-sm font-semibold">
      Welcome,
      <span class="font-serif font-thin italic">{{ user?.name }}</span>
    </h3>
    <h1 class="text-3xl/6 font-black pb-4">Dashboard</h1>

    <UDivider class="w-full py-8" label="✦" />
    <section>
      <div v-if="groups?.length">
        <h2 class="text-xl font-thin mb-2">Member of</h2>
        <div class="grid grid-cols-2 gap-2 pb-2">
          <ULink
            v-for="{ id, name } of groups"
            :key="id"
            class="text-left"
            :to="`/groups/${id}/matches`"
          >
            <UCard class="hover:shadow-md">
              <div>
                <UIcon name="i-heroicons-user-group-20-solid" />
                <div>
                  {{ name }}
                </div>
              </div>
            </UCard>
          </ULink>
        </div>
      </div>

      <div
        v-if="!groups?.length && !invites?.invites.length"
        class="mb-4 text-balance"
      >
        Looks a bit empty here. Create a group and invite people to get started!
      </div>
      <UButton
        label="Create Group"
        @click="isOpen = true"
        class="w-32"
        color="black"
        size="xl"
      />
    </section>

    <section v-if="invites?.invites.length">
      <h2 class="text-xl font-thin mb-2 mt-8">
        Invitations to join these groups
      </h2>
      <div class="pb-4">
        <ul v-if="invites?.invites.length">
          <li
            class="ml-2"
            v-for="invite of invites.invites"
            :key="invite.inviteId"
          >
            <div class="flex w-64 items-center gap-2">
              <UIcon name="i-heroicons-user-group-20-solid" class="text-xl" />
              <div class="w-32">
                {{ invite.name }}
              </div>
              <UButton
                icon="i-heroicons-check"
                class="max-w-fit"
                color="emerald"
                @click="accept(invite.inviteId, invite.groupId)"
              />
              <UButton
                icon="i-heroicons-x-mark"
                class="max-w-fit"
                color="rose"
                variant="outline"
                @click="decline(invite.inviteId)"
              />
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section v-if="invites?.pendingInvites.length">
      <h2 class="text-xl font-thin mb-2 mt-8">Pending invitations you sent</h2>
      <div class="pb-4">
        <ul v-if="invites?.pendingInvites.length">
          <li
            class="ml-2"
            v-for="invite of invites.pendingInvites"
            :key="invite.id"
          >
            <div class="flex w-64 items-center gap-2">
              <UIcon name="i-heroicons-envelope-open" class="text-xl" />
              <div class="w-32">{{ invite.user }}</div>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <UDivider class="w-full py-8" label="✦" />

    <section v-if="groups?.length" class="pb-8">
      <div class="flex gap-1 relative">
        <h2 class="text-xl font-thin mb-2">Invite user</h2>
        <UPopover :popper="{ placement: 'top', offsetDistance: 30 }">
          <UIcon
            name="absolute bottom-5 i-heroicons-exclamation-circle"
            class="text-xl pb-4"
          />
          <template #panel>
            <div class="p-4 text-pretty w-80">
              No email will be sent. If the user registered with the entered
              email, they will receive an invitation directly on their
              dashboard.
            </div>
          </template>
        </UPopover>
      </div>
      <div class="grid grid-cols-1 w-full gap-2 pb-2">
        <USelectMenu
          v-model="selected"
          :options="adminGroups"
          placeholder="Select group"
          option-attribute="name"
          size="xl"
        />
        <UInput v-model="inviteName" placeholder="enter email" size="xl" />
      </div>
      <UButton
        label="Invite"
        :disabled="!inviteName"
        @click="invite()"
        class="w-32"
        color="black"
        size="xl"
      />
    </section>

    <UModal
      v-model="isOpen"
      :ui="{
        container:
          'flex min-h-full items-start sm:items-end sm:items-center justify-center text-center',
      }"
    >
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Create Group</h2>
        </template>
        <div class="flex flex-col gap-2">
          <UInput
            v-model="groupName"
            label="Name"
            placeholder="enter group name"
            size="xl"
          />
          <div class="grid grid-cols-2 gap-2 w-full">
            <UButton
              label="Create"
              @click="create"
              color="black"
              :loading="isLoading"
              :disabled="!groupName"
              size="xl"
            />
            <UButton
              label="Cancel"
              @click="cancel"
              variant="outline"
              color="black"
              size="xl"
            />
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

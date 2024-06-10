<script lang="ts" setup>
definePageMeta({
  middleware: "auth",
});
const { user } = useUserSession();
const toast = useToast();

const isOpen = defineModel("isOpen", { default: false });
const isLoading = ref(false);

const { data: members, refresh: refreshMembers } = await useFetch(
  "/api/members"
);
const { data: groups, refresh: refreshGroups } = await useFetch("/api/groups");
const { data: invites, refresh: refreshInvites } = await useFetch(
  "/api/invites"
);

const groupName = defineModel("groupName", { default: "" });

function cancel() {
  isOpen.value = false;
  groupName.value = "";
}

async function create() {
  isLoading.value = true;
  const res = await $fetch("/api/groups", {
    method: "POST",
    body: {
      name: groupName.value,
      admin: user.value?.id ?? "",
    },
  });
  isLoading.value = false;
  await refreshGroups();
  await refreshMembers();
  isOpen.value = false;
  groupName.value = "";
  toast.add({
    title: `Group '${res?.group.name}' created, you're ${res?.member.role}!`,
  });
}

const selected = ref(groups.value?.[0]);
const inviteName = defineModel("inviteName", { default: "" });
async function invite() {
  const res = await $fetch("/api/invites", {
    method: "POST",
    body: {
      group: selected.value?.id,
      user: inviteName.value,
      by: user.value?.id,
    },
  });
  toast.add({
    title: `Invitation sent to ${res?.id}`,
  });
  inviteName.value = "";
}

async function accept(id: number, group: number) {
  await $fetch("/api/invites/accept", {
    method: "POST",
    body: { id, group },
  });
  await refreshInvites();
  await refreshGroups();
  await refreshMembers();
}

async function decline(id: number) {
  await $fetch("/api/invites/decline", {
    method: "POST",
    body: { id },
  });
  await refreshInvites();
  // todo check if refresh is neccessary
  await refreshGroups();
  await refreshMembers();
}
</script>

<template>
  <div>
    <h1>Settings</h1>
    <UDivider class="w-full py-4" />
    <h2>Your Groups</h2>
    <div class="pb-4">
      <ul>
        <li v-for="group of groups" :key="group.id" class="ml-4">
          {{ group.name }}
        </li>
      </ul>
    </div>
    <h2>Member of</h2>
    <div class="pb-4">
      <ul>
        <li class="ml-4" v-for="{ id, name } of members" :key="id">
          {{ name }}
        </li>
      </ul>
    </div>
    <h2>Invitations to join</h2>
    <div class="pb-4">
      <ul v-if="invites?.length">
        <li class="ml-4" v-for="invite of invites" :key="invite.inviteId">
          <div class="flex w-64 items-center gap-2">
            <div class="w-32">
              {{ invite.status === 0 ? invite.name : "-" }}
            </div>
            <UButton
              icon="i-heroicons-check"
              class="max-w-fit"
              @click="accept(invite.inviteId, invite.groupId)"
            />
            <UButton
              icon="i-heroicons-x-mark"
              class="max-w-fit"
              @click="decline(invite.inviteId)"
            />
          </div>
        </li>
      </ul>
      <div v-else>-</div>
    </div>
    <UDivider class="w-full py-4" />
    <h2>Invite User</h2>
    <div class="grid grid-cols-1 w-64 gap-2">
      <USelectMenu
        v-model="selected"
        :options="groups"
        placeholder="Select group"
        option-attribute="name"
      />
      <UInput v-model="inviteName" placeholder="enter email" />
      <UButton label="Invite" :disabled="!inviteName" @click="invite()" />
    </div>
    <UDivider class="w-full py-4" />
    <UButton label="Create Group" @click="isOpen = true" />
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
          />
          <div class="grid grid-cols-2 gap-2 w-full">
            <UButton
              label="Create"
              @click="create"
              :loading="isLoading"
              :disabled="!groupName"
            />
            <UButton label="Cancel" @click="cancel" />
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

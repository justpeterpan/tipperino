<script lang="ts" setup>
definePageMeta({
  middleware: "auth",
});

const { user } = useUserSession();
const toast = useToast();

const isOpen = defineModel("isOpen", { default: false });
const isLoading = ref(false);

const { data: groups, refresh: refreshGroups } = await useFetch("/api/members");
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
  const res = await useRequestFetch()("/api/invites", {
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
        <h2 class="font-thin mb-2">Member of</h2>
        <div class="grid grid-cols-2 gap-2 pb-8">
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

      <UButton
        label="Create Group"
        @click="isOpen = true"
        class="w-32 mb-8"
        color="black"
        size="xl"
      />
    </section>

    <section v-if="invites?.length">
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
                color="black"
                @click="accept(invite.inviteId, invite.groupId)"
              />
              <UButton
                icon="i-heroicons-x-mark"
                class="max-w-fit"
                color="black"
                @click="decline(invite.inviteId)"
              />
            </div>
          </li>
        </ul>
        <div v-else>-</div>
      </div>
    </section>

    <UDivider class="w-full py-8" label="✦" />

    <section v-if="groups?.length" class="pb-8">
      <h2 class="font-thin mb-2">Invite user</h2>
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

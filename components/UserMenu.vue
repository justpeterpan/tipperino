<script lang="ts" setup>
const isOpen = defineModel("isOpen", { default: false });
defineProps<{
  menuItems: { label: string; target?: string; action?: () => void }[][];
}>();
const emit = defineEmits(["clicked"]);

function handleClick() {
  if (!isOpen.value) {
    emit("clicked");
  }
}
</script>

<template>
  <div>
    <UDropdown
      :items="menuItems"
      :ui="{ item: { disabled: 'cursor-text select-text' } }"
      :popper="{ placement: 'bottom-start' }"
    >
      <UIcon
        name="i-heroicons-user-circle-20-solid w-6 h-6"
        @click="handleClick"
      />

      <template #account="{ item }">
        <div class="text-left">
          <p>Signed in as</p>
          <p class="truncate font-medium text-gray-900 dark:text-white">
            {{ item.label }}
          </p>
        </div>
      </template>

      <template #item="{ item }">
        <span class="truncate">{{ item.label }}</span>

        <UIcon
          :name="item.icon"
          class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
        />
      </template>
    </UDropdown>
  </div>
</template>

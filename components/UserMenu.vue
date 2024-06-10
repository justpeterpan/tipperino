<script lang="ts" setup>
const isOpen = defineModel("isOpen", { default: false });
defineProps<{
  menuItems: { label: string; target?: string; action?: () => void }[];
}>();
const emit = defineEmits(["clicked"]);
function handleClick() {
  if (!isOpen.value) {
    emit("clicked");
  }
}
</script>

<template>
  <UPopover
    v-model:open="isOpen"
    :popper="{ placement: 'bottom-end' }"
    @click="isOpen = true"
  >
    <UIcon
      name="i-heroicons-user-circle-20-solid w-6 h-6"
      @click="handleClick"
    />
    <template #panel>
      <div class="flex flex-col justify-items-center items-center">
        <ULink
          v-for="item of menuItems"
          :key="item.label"
          class="hover:bg-neutral-300/20 py-2 px-6 w-full text-center"
          :to="item.target"
          @click="
            item.action && item.action();
            navigateTo('/');
            isOpen = false;
          "
          >{{ item.label }}</ULink
        >
      </div>
    </template>
  </UPopover>
</template>

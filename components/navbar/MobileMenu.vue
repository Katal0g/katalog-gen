<script setup lang="ts">
import NavLink from "~/components/navbar/NavLink.vue";

const emit = defineEmits(["closeMenu"]);

const closeMenu = () => {
  emit("closeMenu");
};
</script>

<template>
  <div
    class="fixed inset-0 bg-white dark:bg-slate-950 z-50 flex flex-col pt-12"
  >
    <UButton
      @click="closeMenu"
      icon="i-mdi-close"
      class="absolute top-4 right-4"
      variant="soft"
    />
    <div class="flex flex-col gap-4 text-center">
      <NavLink @click="closeMenu" to="/" :text="$t('generator')" size="xl" />
      <NavLink
        @click="closeMenu"
        to="help"
        :text="$t('help')"
        icon="i-heroicons-question-mark-circle"
        size="xl"
      />
    </div>
  </div>
</template>

<style scoped></style>

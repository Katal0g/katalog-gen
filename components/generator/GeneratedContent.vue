<script setup lang="ts">
const props = defineProps({
  content: { type: String, required: true },
  loading: { type: Boolean, required: true },
});

const loading = ref(props.loading);

watch(
  () => props.loading,
  (newValue) => {
    loading.value = newValue;
  },
);

const saveFile = () => {
  const blob = new Blob([props.content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "content.md";
  a.click();
  URL.revokeObjectURL(url);
};
</script>

<template>
  <UCard class="w-full">
    <template #header>
      <div class="flex justify-between">
        <h2 class="text-xl font-semibold">
          📚 {{ $t("generatorPage.content") }}
        </h2>
        <UButton
          icon="i-heroicons-arrow-down-tray-20-solid"
          @click="saveFile"
          variant="soft"
          :disabled="props.content === ''"
        >
          {{ $t("generatorPage.export") }}
        </UButton>
      </div>
    </template>
    <div class="italic text-gray" v-if="!props.content && !props.loading">
      {{ $t("generatorPage.contentPlaceholder") }}
    </div>
    <div class="text-center" v-if="props.loading">
      <span class="italic text-gray">
        {{ $t("generatorPage.robotsWorking") }}
      </span>
      <UProgress size="md" class="lg:w-1/3 m-auto mt-2" animation="swing" />
    </div>
    <div v-else v-html="props.content"></div>
  </UCard>
</template>

<style scoped></style>

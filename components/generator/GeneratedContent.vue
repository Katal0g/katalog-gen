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
    <div class="italic text-gray-400" v-if="!props.content">
      {{ $t("generatorPage.contentPlaceholder") }}
    </div>

    <MDC v-else :value="props.content"></MDC>
  </UCard>
</template>

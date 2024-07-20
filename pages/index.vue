<template>
  <UContainer class="flex-col p-4 flex gap-4 lg:flex-row">
    <UCard class="w-full h-fit lg:w-1/4">
      <template #header>
        <h1 class="text-2xl font-bold">🤖 {{ $t("generator") }}</h1>
      </template>

      <GeneratorForm
          :levels="levels"
          :loading="loading"
          :currentContent="currentContent"
          @update:loading="updateLoading"
          @update:content="updateContent"
      />
    </UCard>

    <GeneratedContent :content="formattedContent" :loading="loading" />
  </UContainer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import GeneratorForm from "~/components/generator/GeneratorForm.vue";
import GeneratedContent from "~/components/generator/GeneratedContent.vue";
import type { FormLevel } from "~/models";

const levels: FormLevel[] = [
  { label: "Primaire", value: "primaire" },
  { label: "Collège", value: "college" },
  { label: "Lycée", value: "lycee" },
  { label: "Supérieur", value: "superieur" },
];

const loading = ref(false);
const currentContent = ref("");

const formattedContent = computed(() => {
  return currentContent.value.replace(/\n/g, "<br>");
});

const updateLoading = (value: boolean) => {
  loading.value = value;
};

const updateContent = (value: string) => {
  currentContent.value = value;
};
</script>

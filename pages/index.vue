<template>
  <UCard class="w-full h-fit lg:w-1/2">
    <template #header>
      <h2 class="text-2xl font-bold">🤖 {{ $t("generator") }}</h2>
    </template>

    <GeneratorForm
      :levels="levels"
      :loading="loading"
      :currentContent="currentContent"
      @update:loading="updateLoading"
      @update:content="updateContent"
    />
  </UCard>

  <GeneratedContent :content="currentContent" :loading="loading" />
</template>

<script setup lang="ts">
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

const updateLoading = (value: boolean) => {
  loading.value = value;
};

const updateContent = (value: string) => {
  currentContent.value = value;
};
</script>

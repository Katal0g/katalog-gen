<template>
  <div class="flex flex-col gap-4 w-full md:flex-row">
    <UCard class="min-w-96 flex-1 h-fit">
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
  </div>
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

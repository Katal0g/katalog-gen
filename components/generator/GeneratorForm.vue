<template>
  <UForm
    class="flex flex-col gap-2"
    :state="state"
    @submit="generateContent"
    :schema="schema"
  >
    <UFormGroup :label="$t('scholar.level')" name="level" required>
      <USelect
        v-model="state.level"
        :options="levels"
        :placeholder="
          $t('utils.select', { field: $t('scholar.level').toLowerCase() })
        "
      />
    </UFormGroup>

    <UFormGroup :label="$t('scholar.subject')" name="subject" required>
      <UInput
        v-model="state.subject"
        :placeholder="
          $t('utils.select', { field: $t('scholar.subject').toLowerCase() })
        "
      />
    </UFormGroup>

    <UFormGroup :label="$t('scholar.title')" name="title" required>
      <UInput
        v-model="state.title"
        :placeholder="
          $t('utils.enter', { field: $t('scholar.title').toLowerCase() })
        "
      />
    </UFormGroup>

    <UFormGroup
      :label="$t('generatorPage.nbQuestions')"
      name="nbQuestions"
      required
    >
      <UInput type="number" placeholder="5" v-model="state.nbQuestions" />
    </UFormGroup>

    <UButton
      class="mt-2 py-2"
      block
      type="submit"
      color="primary"
      icon="i-heroicons-plus-circle"
      :loading="loading"
    >
      {{ $t("generatorPage.generateContent") }}
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { FormLevel, Level, Subject } from "~/models";

defineProps<{
  levels: FormLevel[];
  loading: boolean;
  currentContent: string;
}>();

const emit = defineEmits<{
  (e: "update:loading", value: boolean): void;
  (e: "update:content", value: string): void;
}>();

// Zod schema for form validation
const schema = z.object({
  level: z.string().min(1, { message: "Obligatoire" }) as z.ZodType<Level>,
  subject: z.string().min(1, { message: "Obligatoire" }) as z.ZodType<Subject>,
  title: z.string().min(3, { message: "Minimum 3 caractères" }),
  nbQuestions: z.number().min(1, { message: "Minimum 1 question" }),
});

const state = reactive({
  level: undefined,
  subject: undefined,
  title: undefined,
  nbQuestions: 5,
});

// Async function to generate content
const generateContent = async () => {
  emit("update:loading", true);

  try {
    const response = await $fetch("/api/generate-content", {
      method: "POST",
      body: state,
    });

    if (response.content !== null) {
      emit("update:content", response.content);
    }
  } catch (error) {
    console.error("Error generating content:", error);
  } finally {
    emit("update:loading", false);
  }
};
</script>

<style scoped></style>

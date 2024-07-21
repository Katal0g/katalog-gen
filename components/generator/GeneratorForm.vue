<template>
  <UForm
    class="flex flex-col gap-2"
    :state="state"
    @submit="generateContent"
    :schema="isExpertMode ? null : schema"
  >
    <FormFields :state="state" :levels="levels" />

    <FormExpertModeToggle v-model="isExpertMode" />

    <FormCustomPromptField
      v-if="isExpertMode"
      v-model="state.customPrompt"
      @reset="resetForm"
      @open-modal="isOpen = true"
    />

    <UModal v-model="isOpen">
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Prompts
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isOpen = false"
            />
          </div>
        </template>

        <UContainer class="flex flex-col gap-2">
          <div class="flex flex-col">
            <span class="font-bold">
              {{ $t("generatorPage.systemPrompt") }}
            </span>
            <span>{{ SYSTEM_PROMPT }}</span>
          </div>
          <div class="flex flex-col">
            <span class="font-bold">
              {{ $t("generatorPage.customPrompt") }}
            </span>
            <span>{{ state.customPrompt }}</span>
          </div>
        </UContainer>
      </UCard>
    </UModal>

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
import { useGeneratorForm } from "~/composables/useGeneratorForm";
import type { FormLevel } from "~/models";

const props = defineProps<{
  levels: FormLevel[];
  loading: boolean;
  currentContent: string;
}>();

const emit = defineEmits<{
  (e: "update:loading", value: boolean): void;
  (e: "update:content", value: string): void;
}>();

const { levels, loading } = toRefs(props);

const { isExpertMode, isOpen, schema, state, resetForm } = useGeneratorForm(
  levels.value,
);

const generateContent = async () => {
  emit("update:loading", true);
  try {
    let requestBody;

    if (isExpertMode.value) {
      requestBody = {
        customPrompt: state.customPrompt,
        level: state.level,
        subject: state.subject,
        title: state.title,
        nbQuestions: state.nbQuestions,
      };
    } else {
      try {
        const validatedData = schema.value.parse(state);
        requestBody = {
          level: validatedData.level,
          subject: validatedData.subject,
          title: validatedData.title,
          nbQuestions: validatedData.nbQuestions,
        };
      } catch (validationError) {
        console.error("Validation error:", validationError);
        emit("update:loading", false);
        return;
      }
    }

    const response = await $fetch("/api/generate-content", {
      method: "POST",
      body: requestBody,
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

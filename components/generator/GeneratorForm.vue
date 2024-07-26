<template>
  <UForm
    class="flex flex-col gap-2"
    :state="state"
    @submit="generateContent"
    :schema="isExpertMode ? null : schema"
  >
    <FormFields
      :state="state"
      :levels="levels"
      @update:fileContent="setFileContent"
    />

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
            <div
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Prompts
            </div>
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
            <span class="text-sm">{{ SYSTEM_PROMPT }}</span>
          </div>
          <UDivider />
          <div class="flex flex-col">
            <span class="font-bold">
              {{ $t("generatorPage.customPrompt") }}
            </span>
            <span class="text-sm">{{ state.customPrompt }}</span>
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

const content = ref<string>(props.currentContent);

const { levels, loading } = toRefs(props);

const { isExpertMode, isOpen, schema, state, resetForm } = useGeneratorForm(
  levels.value,
);

const resetContent = () => {
  content.value = "";
  emit("update:content", content.value);
};

const setFileContent = (fileContent: string) => {
  state.fileContent = fileContent;
};

const generateContent = async () => {
  emit("update:loading", true);
  resetContent();
  try {
    let requestBody;

    if (isExpertMode.value) {
      requestBody = {
        customPrompt: state.customPrompt,
        level: state.level,
        subject: state.subject,
        title: state.title,
        nbQuestions: state.nbQuestions,
        fileContent: state.fileContent,
      };
    } else {
      try {
        const validatedData = schema.value.parse(state);
        requestBody = {
          level: validatedData.level,
          subject: validatedData.subject,
          title: validatedData.title,
          nbQuestions: validatedData.nbQuestions,
          fileContent: state.fileContent,
        };
      } catch (validationError) {
        console.error("Validation error:", validationError);
        emit("update:loading", false);
        return;
      }
    }

    const response = await $fetch<ReadableStream>("/api/generate-content", {
      method: "POST",
      body: requestBody,
      responseType: "stream",
    });

    const reader = response.pipeThrough(new TextDecoderStream()).getReader();

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        emit("update:loading", false);
        break;
      }

      // Split the value into lines and process each line
      const lines = value.split("\n");
      let isTitle = false;

      for (const line of lines) {
        // Use regex to match content after "data:"
        const match = line.match(/^data: (.*)$/);
        if (match) {
          if (match[1].startsWith("#")) {
            isTitle = true;
          }

          if (match[1] == "---") {
            content.value += "\n\n";
            emit("update:content", content.value);
          }
          // Check if match[1] is empty, if so, add a new line
          if (match[1].length === 0) {
            content.value += "\n";
            emit("update:content", content.value);
          }
          // Check if match[1] is a title, if so, add a new line
          else if (isTitle) {
            content.value += "\n";
            emit("update:content", content.value);
            isTitle = false;
          }
          content.value += match[1];
          emit("update:content", content.value);
        }
      }
    }
  } catch (error) {
    console.error("Error generating content:", error);
  } finally {
    emit("update:loading", false);
  }
};
</script>

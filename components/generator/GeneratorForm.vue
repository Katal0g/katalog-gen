<template>
  <UForm
      class="flex flex-col gap-2"
      :state="state"
      @submit="generateContent"
      :schema="isExpertMode ? null : schema"
  >

    <div class="flex gap-2 w-full">
      <UFormGroup class="flex-grow" :label="$t('scholar.level')" name="level" required>
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
    </div>

    <div class="flex gap-2 w-full">
      <UFormGroup class="flex-grow" :label="$t('scholar.title')" name="title" required>
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

    </div>

    <!-- Toggle for Expert Mode -->
    <UFormGroup :label="$t('generatorPage.expertMode')">
      <UToggle v-model="isExpertMode" />
    </UFormGroup>

    <!-- Custom prompt (only visible in expert mode) -->
    <div v-if="isExpertMode">
      <UFormGroup required >
        <template #label>
          <span class="pr-1">{{$t('generatorPage.customPrompt')}}</span>
        </template>
        <template #hint>
          <div class="flex gap-2 pb-1">
            <UTooltip
                :text="$t('generatorPage.resetCustomPrompt')"
            >
              <UButton
                  class="p-0"
                  icon="i-heroicons-arrow-path-16-solid"
                  variant="link"
                  color="amber"
                  @click="resetForm"
              />
            </UTooltip>
            <UTooltip
                :text="$t('generatorPage.seeCompletePrompt')"
            >
              <UButton
                  class="p-0"
                  icon="i-heroicons-information-circle"
                  variant="link"
                  @click="state.customPrompt = initialCustomPrompt"
              />
            </UTooltip>

          </div>
        </template>
        <UTextarea
            v-model="state.customPrompt"
            :placeholder="$t('generatorPage.enterCustomPrompt')"
            :rows="7"
        />
      </UFormGroup>
    </div>

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
import { ref, reactive, computed, watch } from "vue";
import type { FormLevel, Level, Subject } from "~/models";
import { buildUserPrompt } from "~/utils/prompt";

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

// Local state
const isExpertMode = ref(false);

const schema = computed(() => {
  const baseSchema = {
    level: z.string().min(1, { message: "Obligatoire" }) as z.ZodType<Level>,
    subject: z.string().min(1, { message: "Obligatoire" }) as z.ZodType<Subject>,
    title: z.string().min(3, { message: "Minimum 3 caractères" }),
    nbQuestions: z.number().min(1, { message: "Minimum 1 question" }),
  };

  return z.object(baseSchema);
});

const state = reactive({
  level: "" as Level,
  subject: "" as Subject,
  title: "" as string,
  nbQuestions: 5,
  customPrompt: "",
});

const initialCustomPrompt = computed(() => {
    const userPrompt = buildUserPrompt(
        state.level ?? "",
        state.subject ?? "",
        state.title ?? "",
        state.nbQuestions ?? 5
    );
    return `${userPrompt}`;
});

const resetForm = () => {
  state.level = "";
  state.subject = "" as Subject;
  state.title = "";
  state.nbQuestions = 5;
};

watch(isExpertMode, (newValue) => {
  if (newValue) {
    state.customPrompt = initialCustomPrompt.value;
  }
});

// Update custom prompt when other fields change
watch(
    () => [state.level, state.subject, state.title, state.nbQuestions],
    () => {
      if (isExpertMode.value) {
        state.customPrompt = buildUserPrompt(
            state.level!,
            state.subject!,
            state.title!,
            state.nbQuestions
        );
      }
    }
);

// Async function to generate content
const generateContent = async () => {
  emit("update:loading", true);
  try {
    let requestBody;

    if (isExpertMode.value) {
      // In expert mode, use the custom prompt without validation
      requestBody = {
        customPrompt: state.customPrompt,
        level: state.level,
        subject: state.subject,
        title: state.title,
        nbQuestions: state.nbQuestions,
      };
    } else {
      // In non-expert mode, validate the form
      try {
        const validatedData = schema.value.parse(state);
        requestBody = {
          level: validatedData.level,
          subject: validatedData.subject,
          title: validatedData.title,
          nbQuestions: validatedData.nbQuestions,
        };
      } catch (validationError) {
        // Handle validation errors (e.g., display error messages)
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
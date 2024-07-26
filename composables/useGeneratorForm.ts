import { ref, reactive, computed, watch } from "vue";
import { z } from "zod";
import type { FormLevel, Level, Subject } from "~/models";
import { buildUserPrompt } from "~/utils/prompt";

export function useGeneratorForm(levels: FormLevel[]) {
  const isExpertMode = ref(false);
  const isOpen = ref(false);

  const schema = computed(() => {
    const baseSchema = {
      level: z.string().min(1, { message: "Obligatoire" }) as z.ZodType<Level>,
      subject: z
        .string()
        .min(1, { message: "Obligatoire" }) as z.ZodType<Subject>,
      title: z.string().min(3, { message: "Minimum 3 caractères" }),
      nbQuestions: z.number().min(1, { message: "Minimum 1 question" }),
    };
    return z.object(baseSchema);
  });

  const state = reactive({
    level: "" as Level,
    subject: "" as Subject,
    title: "",
    nbQuestions: 5,
    customPrompt: "",
    fileContent: "",
  });

  const initialCustomPrompt = computed(() => {
    return buildUserPrompt(
      state.level ?? "",
      state.subject ?? "",
      state.title ?? "",
      state.nbQuestions ?? 5,
    );
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

  watch(
    () => [state.level, state.subject, state.title, state.nbQuestions],
    () => {
      if (isExpertMode.value) {
        state.customPrompt = buildUserPrompt(
          state.level!,
          state.subject!,
          state.title!,
          state.nbQuestions,
        );
      }
    },
  );

  return {
    isExpertMode,
    isOpen,
    schema,
    state,
    initialCustomPrompt,
    resetForm,
    levels,
  };
}

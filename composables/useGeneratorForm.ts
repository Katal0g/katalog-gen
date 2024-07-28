import { ref, reactive, computed, watch } from "vue";
import { z } from "zod";
import type { FormLevel, Level, Subject } from "~/models";
import { buildFilePrompt, buildUserPrompt } from "~/utils/prompt";

export function useGeneratorForm(levels: FormLevel[]) {
  const isExpertMode = ref(false);

  const schema = computed(() => {
    if (state.isFileMode) {
      const fileSchema = {
        nbQuestions: z.number().min(1, { message: "Minimum 1 question" }),
      };
      return z.object(fileSchema);
    } else {
      const baseSchema = {
        level: z
          .string()
          .min(1, { message: "Obligatoire" }) as z.ZodType<Level>,
        subject: z
          .string()
          .min(1, { message: "Obligatoire" }) as z.ZodType<Subject>,
        title: z.string().min(3, { message: "Minimum 3 caractères" }),
        nbQuestions: z.number().min(1, { message: "Minimum 1 question" }),
      };
      return z.object(baseSchema);
    }
  });

  const state = reactive({
    level: "" as Level,
    subject: "" as Subject,
    title: "",
    nbQuestions: 5,
    finalPrompt: buildFilePrompt(5),
    fileContent: "",
    isFileMode: true,
  });

  const resetForm = () => {
    state.level = "";
    state.subject = "" as Subject;
    state.title = "";
    state.nbQuestions = 5;
  };

  // Update prompt on expert mode change
  watch(isExpertMode, (newValue) => {
    if (newValue) {
      if (state.isFileMode) {
        state.finalPrompt = buildFilePrompt(state.nbQuestions);
      } else {
        state.finalPrompt = buildUserPrompt(
          state.level,
          state.subject,
          state.title,
          state.nbQuestions,
        );
      }
    }
  });

  // Detect changes on isFileMode
  watch(
    () => state.isFileMode,
    (newValue) => {
      console.log("isFileMode changed to", newValue);
    },
  );

  // Update prompt on form changes
  watch(
    () => [
      state.level,
      state.subject,
      state.title,
      state.nbQuestions,
      state.isFileMode,
    ],
    () => {
      if (state.isFileMode) {
        state.finalPrompt = buildFilePrompt(state.nbQuestions);
      } else {
        state.finalPrompt = buildUserPrompt(
          state.level,
          state.subject,
          state.title,
          state.nbQuestions,
        );
      }
    },
  );

  return {
    isExpertMode,
    schema,
    state,
    resetForm,
    levels,
  };
}

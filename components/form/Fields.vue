<template>
  <div>
    <div class="flex flex-col sm:flex-row gap-2 w-full">
      <UFormGroup :label="$t('scholar.level')" name="level" required>
        <USelect
          v-model="state.level"
          :options="levels"
          :placeholder="
            $t('utils.select', { field: $t('scholar.level').toLowerCase() })
          "
        />
      </UFormGroup>

      <UFormGroup
        class="flex-grow"
        :label="$t('scholar.subject')"
        name="subject"
        required
      >
        <UInput
          v-model="state.subject"
          :placeholder="
            $t('utils.enter', { field: $t('scholar.subject').toLowerCase() })
          "
        />
      </UFormGroup>
    </div>

    <div class="flex flex-col sm:flex-row gap-2 w-full mt-2">
      <UFormGroup
        class="w-full sm:w-4/5"
        :label="$t('scholar.title')"
        name="title"
        required
      >
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
    <div class="mt-2">
      <UFormGroup
        class="w-full sm:w-4/5"
        :label="$t('generatorPage.file')"
        name="File"
      >
        <UInput type="file" @change="uploadFile" />
      </UFormGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormLevel } from "~/models";
const emit = defineEmits(["update:fileContent"]);

defineProps<{
  state: any;
  levels: FormLevel[];
}>();

const uploadFile = async (fileList: FileList) => {
  const file = fileList[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  const response = await $fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  emit("update:fileContent", response);
};
</script>

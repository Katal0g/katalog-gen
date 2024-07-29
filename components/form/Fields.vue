<template>
  <div>
    <!-- Toggle for file/manual mode -->
    <UTabs :items="items" class="w-full" @change="onChange">
      <template #item="{ item }">
        <div v-if="item.key === 'file'">
          <div class="mt-2">
            <UFormGroup
              class="w-full"
              :label="$t('generatorPage.file') + ' (.pdf)'"
              name="File"
              required
            >
              <UInput type="file" @change="uploadFile" accept=".pdf" />
            </UFormGroup>
          </div>
        </div>

        <div v-if="item.key === 'manual'">
          <div class="flex flex-col sm:flex-row gap-2 w-full">
            <UFormGroup
              :class="{
                'opacity-40': isExpertMode,
              }"
              :label="$t('scholar.level')"
              name="level"
              required
            >
              <USelect
                :disabled="isExpertMode"
                v-model="state.level"
                :options="levels"
                :placeholder="
                  $t('utils.select', {
                    field: $t('scholar.level').toLowerCase(),
                  })
                "
              />
            </UFormGroup>

            <UFormGroup
              class="flex-grow"
              :class="{
                'opacity-40': isExpertMode,
              }"
              :label="$t('scholar.subject')"
              name="subject"
              required
            >
              <UInput
                :disabled="isExpertMode"
                v-model="state.subject"
                :placeholder="
                  $t('utils.enter', {
                    field: $t('scholar.subject').toLowerCase(),
                  })
                "
              />
            </UFormGroup>
          </div>

          <div class="flex flex-col sm:flex-row gap-2 w-full mt-2">
            <UFormGroup
              class="w-full"
              :class="{
                'opacity-40': isExpertMode,
              }"
              :label="$t('scholar.title')"
              name="title"
              required
            >
              <UInput
                :disabled="isExpertMode"
                v-model="state.title"
                :placeholder="
                  $t('utils.enter', {
                    field: $t('scholar.title').toLowerCase(),
                  })
                "
              />
            </UFormGroup>
          </div>
        </div>
      </template>
    </UTabs>

    <!-- Fields common to both modes -->
    <div class="flex flex-col sm:flex-row gap-2 w-full mt-2">
      <UFormGroup
        :class="{
          'opacity-40': isExpertMode,
        }"
        :label="$t('generatorPage.nbQuestions')"
        name="nbQuestions"
        required
      >
        <UInput
          :disabled="isExpertMode"
          type="number"
          placeholder="5"
          v-model="state.nbQuestions"
        />
      </UFormGroup>
    </div>

    <div v-if="state.expertMode" class="mt-2">
      <UFormGroup
        class="w-full"
        :class="{
          'opacity-40': isExpertMode,
        }"
        :label="$t('generatorPage.customPrompt')"
        name="finalPrompt"
      >
        <UInput type="text" v-model="state.finalPrompt" />
      </UFormGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormLevel } from "~/models";
const emit = defineEmits(["update:fileContent"]);

const props = defineProps<{
  state: any;
  isExpertMode: boolean;
  levels: FormLevel[];
}>();

const { t } = useI18n();

const items = computed(() => [
  {
    key: "file",
    label: t("generatorPage.file"),
  },
  {
    key: "manual",
    label: t("generatorPage.manual"),
  },
]);

const isExpertMode = computed(() => {
  return props.isExpertMode;
});

const uploadFile = async (fileList: FileList) => {
  if (fileList.length === 0) {
    emit("update:fileContent", "");
  }
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

const onChange = (index: number) => {
  const key = items.value[index].key;
  if (key === "file") {
    props.state.isFileMode = true;
  } else if (key === "manual") {
    props.state.isFileMode = false;
  }
};
</script>

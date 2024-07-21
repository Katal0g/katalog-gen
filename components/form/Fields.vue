<template>
  <div>
    <div class="flex gap-2 w-full">
      <UFormGroup
        class="flex-grow"
        :label="$t('scholar.level')"
        name="level"
        required
      >
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
      <UFormGroup
        class="w-4/5"
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
  </div>
</template>

<script setup lang="ts">
import type { FormLevel } from "~/models";

defineProps<{
  state: any;
  levels: FormLevel[];
}>();
</script>

<template>
  <UFormGroup required>
    <template #label>
      <span class="pr-1">{{ $t("generatorPage.customPrompt") }}</span>
    </template>
    <template #hint>
      <div class="flex gap-2 pb-1">
        <UTooltip :text="$t('generatorPage.resetCustomPrompt')">
          <UButton
            class="p-0"
            icon="i-heroicons-arrow-path-16-solid"
            variant="link"
            color="amber"
            @click="$emit('reset')"
          />
        </UTooltip>
        <UTooltip :text="$t('generatorPage.seeCompletePrompt')">
          <UButton
            class="p-0"
            icon="i-heroicons-information-circle"
            variant="link"
            @click="$emit('openModal')"
          />
        </UTooltip>
      </div>
    </template>
    <UTextarea
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :placeholder="$t('generatorPage.enterCustomPrompt')"
      :rows="7"
    />
  </UFormGroup>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
}>();
defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "reset"): void;
  (e: "openModal"): void;
}>();
</script>

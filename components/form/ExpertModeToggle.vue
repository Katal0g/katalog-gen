<template>
  <UFormGroup :label="$t('generatorPage.expertMode')">
    <UToggle
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </UFormGroup>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
}>();
defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
</script>

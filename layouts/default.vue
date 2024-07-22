<script setup lang="ts"></script>

<template>
  <div>
    <Navbar />
    <UContainer class="flex flex-col gap-2">
      <UContainer
        class="flex-col flex gap-4 w-full md:flex-row"
        :ui="{ padding: 'px-0 sm:px-0 lg:px-0' }"
      >
        <slot /> </UContainer
    ></UContainer>
  </div>
</template>

<style scoped></style>

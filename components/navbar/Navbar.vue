<script setup lang="ts">
import { ref } from "vue";
import NavLink from "~/components/navbar/NavLink.vue";
import MobileMenu from "~/components/navbar/MobileMenu.vue";
const { setLocale } = useI18n();

type LanguageType = { label: string; value: string };
const languages = [
  { label: "Français", value: "fr" },
  { label: "English", value: "en" },
] as LanguageType[];

const isMenuOpen = ref(false);
const languageSelected = ref({ label: "Français", value: "fr" });
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

watch(languageSelected, (newValue: LanguageType) => {
  setLocale(newValue.value);
});
</script>

<template>
  <nav class="hidden m-4 pb-2 md:flex justify-between border-b">
    <div class="w-1/5">katalog-gen</div>
    <div class="flex gap-4">
      <NavLink to="/" :text="$t('generator')" />
    </div>
    <div class="flex gap-2 w-1/5 justify-end">
      <USelectMenu v-model="languageSelected" :options="languages" />
      <NavLink
          to="help"
          :text="$t('help')"
          icon="i-heroicons-question-mark-circle"
      />
    </div>
  </nav>

  <!-- Mobile Nav -->
  <nav class="flex pb-2 my-4 justify-between border-b md:hidden">
    <div>katalog-gen</div>
    <div class="flex gap-4">
      <USelectMenu v-model="languageSelected" :options="languages" />
      <UButton @click="toggleMenu" icon="i-mdi-menu" variant="soft" />
    </div>
  </nav>

  <!-- Full-Screen Mobile Menu -->
  <MobileMenu v-if="isMenuOpen" @closeMenu="closeMenu" />
</template>

<template>
  <UCard class="h-fit w-full overflow-auto mb-6">
    <template #header>
      <div class="flex justify-between">
        <h2 class="text-xl font-semibold">
          📚 {{ $t("generatorPage.content") }}
        </h2>
        <UButton
          icon="i-heroicons-arrow-down-tray-20-solid"
          @click="saveFile"
          variant="soft"
          :disabled="props.content === ''"
        >
          {{ $t("generatorPage.export") }}
        </UButton>
      </div>
    </template>
    <div class="italic text-gray-400" v-if="!props.content">
      {{ $t("generatorPage.contentPlaceholder") }}
    </div>

    <div v-else v-html="parseAPIResponse(props.content)" class="w-full"></div>
  </UCard>
</template>

<script setup lang="ts">
import markdownit from "markdown-it";

// Actual default values
const md = markdownit();
const props = defineProps({
  content: { type: String, required: true },
  loading: { type: Boolean, required: true },
});

const loading = ref(props.loading);

watch(
  () => props.loading,
  (newValue) => {
    loading.value = newValue;
  },
);

const saveFile = () => {
  const blob = new Blob([props.content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "content.md";
  a.click();
  URL.revokeObjectURL(url);
};

// Function to parse the API response
// <Q> is a Question and ends by <Q/> -> The question should be in bold (do not add anything else)
// <A> is an Answer and ends by <A/> -> The answer should be in italic (do not add anything else)
// <C lang='LANGUAGE'> is a Code block with LANGUAGE as the language and ends by <C/>
// Transform the content to markdown
const parseAPIResponse = (response: string): string => {
  if (!response) {
    throw new Error("Response cannot be empty or undefined");
  }

  let formattedContent = response;

  // Replace Question and Answer tags
  const replacements: [RegExp, string][] = [
    [/<Q>/g, "\n\n**"],
    [/<\/Q>/g, "**\n"],
    [/<A>/g, "\n\n*"],
    [/<\/A>/g, "*\n\n"],
  ];

  replacements.forEach(([pattern, replacement]) => {
    formattedContent = formattedContent.replace(pattern, replacement);
  });

  // Replace Code block tags with language detection
  formattedContent = formattedContent.replace(
    /<C lang='(.*?)'>/g,
    (_, lang) => `\n\n\`\`\`${lang}\n`,
  );
  formattedContent = formattedContent.replace(/<\/C>/g, "\n```\n");

  // Parse the Markdown content
  return md.render(formattedContent);
};
</script>

<style>
pre {
  background-color: #eaeaea;
  padding: 1rem;
  border-radius: 0.25rem;
  overflow: auto;
  font-size: 85%;
  margin: 1rem 0;
  max-width: 100%;
}

code {
  width: fit-content;
}

p {
  margin: 0.2rem 0;
}
</style>

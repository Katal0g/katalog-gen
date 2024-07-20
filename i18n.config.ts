export default defineI18nConfig(() => ({
  legacy: false,
  locale: "fr",
  messages: {
    en: {
      generator: "Generator",
      help: "Help",
      generatorPage: {
        content: "Content",
        export: "Export",
        contentPlaceholder: "Your content will be generated here...",
        generateContent: "Generate the content",
        nbQuestions: "Nb of questions",
        robotsWorking:
            "Our little robots are working hard to generate the content...",
        expertMode: "Expert Mode",
        customPrompt: "Custom Prompt",
        enterCustomPrompt: "Enter your custom prompt here..."
      },
      scholar: {
        level: "Level",
        subject: "Subject",
        title: "Title",
      },
      utils: {
        simpleSearch: "Search",
        select: "Select a {field}",
        search: "Search by {field}",
        enter: "Enter your {field}",
        required: "Required",
      },
    },
    fr: {
      generator: "Générateur",
      help: "Aide",
      generatorPage: {
        content: "Contenu",
        export: "Exporter",
        contentPlaceholder: "Votre contenu sera généré ici...",
        generateContent: "Générer le contenu",
        nbQuestions: "Nb de questions",
        robotsWorking:
            "Nos petits robots travaillent dur pour générer le contenu...",
        expertMode: "Mode Expert",
        customPrompt: "Prompt personnalisé",
        enterCustomPrompt: "Entrez votre prompt personnalisé ici..."
      },
      scholar: {
        level: "Niveau",
        subject: "Matière",
        title: "Titre",
      },
      utils: {
        simpleSearch: "Rechercher",
        select: "Sélectionner un {field}",
        search: "Rechercher par {field}",
        enter: "Entrez votre {field}",
        required: "Obligatoire",
      },
    },
  },
}));

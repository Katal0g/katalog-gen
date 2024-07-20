// Define FormLevel type
export type FormLevel = {
  value: string;
  label: string;
};

// LEVELS array with correct typing
export const LEVELS: FormLevel[] = [
  { value: "primaire", label: "Primaire" },
  { value: "college", label: "Collège" },
  { value: "lycee", label: "Lycée" },
  { value: "superieur", label: "Supérieur" },
];

// subjects array with constant assertion
export const SUBJECTS = [
  "Maths",
  "Français",
  "Histoire",
  "Géographie",
  "Physique",
  "Chimie",
  "SVT",
  "Technologie",
] as const;

// Define types for Level and Subject
export type Level = (typeof LEVELS)[number]["label"];
export type Subject = (typeof SUBJECTS)[number];
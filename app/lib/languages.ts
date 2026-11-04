// app/lib/languages.ts
export type LanguageGroup = "indian" | "english" | "foreign";

export interface CatalogLanguage {
  name: string;
  native: string;
  group: LanguageGroup;
}

// The 22 languages of the Eighth Schedule of the Constitution of India
const INDIAN: [string, string][] = [
  ["Assamese", "অসমীয়া"],
  ["Bengali", "বাংলা"],
  ["Bodo", "बड़ो"],
  ["Dogri", "डोगरी"],
  ["Gujarati", "ગુજરાતી"],
  ["Hindi", "हिंदी"],
  ["Kannada", "ಕನ್ನಡ"],
  ["Kashmiri", "कॉशुर"],
  ["Konkani", "कोंकणी"],
  ["Maithili", "मैथिली"],
  ["Malayalam", "മലയാളം"],
  ["Manipuri", "মৈতৈলোন্"],
  ["Marathi", "मराठी"],
  ["Nepali", "नेपाली"],
  ["Odia", "ଓଡ଼ିଆ"],
  ["Punjabi", "ਪੰਜਾਬੀ"],
  ["Sanskrit", "संस्कृतम्"],
  ["Santali", "ᱥᱟᱱᱛᱟᱲᱤ"],
  ["Sindhi", "سنڌي"],
  ["Tamil", "தமிழ்"],
  ["Telugu", "తెలుగు"],
  ["Urdu", "اردو"],
];

// In-demand foreign languages (edit this list freely)
const FOREIGN: [string, string][] = [
  ["German", "Deutsch"],
  ["French", "Français"],
  ["Spanish", "Español"],
  ["Japanese", "日本語"],
  ["Korean", "한국어"],
  ["Mandarin Chinese", "普通话"],
  ["Arabic", "العربية"],
  ["Russian", "Русский"],
  ["Portuguese", "Português"],
  ["Italian", "Italiano"],
];

export const LANGUAGE_CATALOG: CatalogLanguage[] = [
  ...INDIAN.map(([name, native]) => ({ name, native, group: "indian" as const })),
  { name: "English", native: "English", group: "english" as const },
  ...FOREIGN.map(([name, native]) => ({ name, native, group: "foreign" as const })),
];

// Other spellings that mean the same language
const ALIASES: Record<string, string> = {
  oriya: "Odia",
  meitei: "Manipuri",
  meiteilon: "Manipuri",
  mandarin: "Mandarin Chinese",
  chinese: "Mandarin Chinese",
};

const BY_KEY = new Map(LANGUAGE_CATALOG.map((l) => [l.name.toLowerCase(), l]));

export const slugify = (name: string) => name.trim().toLowerCase().replace(/\s+/g, "-");

export const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export function canonicalLanguage(name: string): string {
  const key = name.trim().toLowerCase();
  return BY_KEY.get(key)?.name ?? ALIASES[key] ?? name.trim();
}

export const isCataloged = (name: string) => BY_KEY.has(canonicalLanguage(name).toLowerCase());

export function languageNameFromSlug(slug: string, extraNames: string[] = []): string {
  const all = [...LANGUAGE_CATALOG.map((l) => l.name), ...extraNames];
  const hit = all.find((n) => slugify(n) === slug);
  return hit ? canonicalLanguage(hit) : capitalize(slug.replace(/-/g, " "));
}

const GROUP_COLORS: Record<LanguageGroup, string> = {
  indian: "from-orange-500 to-red-500",
  english: "from-blue-500 to-cyan-500",
  foreign: "from-purple-500 to-pink-500",
};

// Presentation only: native script name, a glyph for the tile, a gradient.
export function presentationFor(name: string) {
  const entry = BY_KEY.get(canonicalLanguage(name).toLowerCase());
  const native = entry?.native ?? name;
  return {
    native,
    icon: Array.from(native)[0] ?? "🌐",
    color: GROUP_COLORS[entry?.group ?? "indian"],
  };
}
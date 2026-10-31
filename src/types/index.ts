/* ============================================================
   Shared type definitions used across the application.
   ============================================================ */

/** Three learning depth levels, switchable at any time. */
export type LearningLevel = "beginner" | "practical" | "technical";

export const LEARNING_LEVELS: LearningLevel[] = [
  "beginner",
  "practical",
  "technical",
];

/** Visual / interaction theme. */
export type Theme = "dark" | "light";

/** Rough device capability classification for 3D / motion degradation. */
export type DeviceTier = "high" | "medium" | "low";

/* ---------- Glossary / Translator ---------- */

export interface GlossaryTerm {
  term: string;
  /** Lowercased for case-insensitive lookup. */
  aliases?: string[];
  shortDef: string;
  levels?: Partial<Record<LearningLevel, string>>;
  related?: string[];
}

/* ---------- Atlas content ---------- */

export type AtlasCategory =
  | "fundamentals"
  | "kernel"
  | "terminal"
  | "scripting"
  | "filesystem"
  | "permissions"
  | "networking"
  | "security"
  | "package-management"
  | "distributions"
  | "desktop-environments"
  | "window-managers"
  | "software-installation"
  | "development"
  | "programming"
  | "servers-admin"
  | "containers-virtualization"
  | "gaming"
  | "multimedia"
  | "troubleshooting"
  | "boot-recovery"
  | "customization";

export type ContentType =
  | "dictionary"
  | "concept"
  | "command-reference"
  | "tutorial"
  | "documentation"
  | "troubleshooting"
  | "comparison"
  | "visual"
  | "learning-path";

export interface ArticleExample {
  command?: string;
  output?: string;
  note?: string;
}

export interface ArticleReference {
  title: string;
  url: string;
  type: "official" | "community" | "man-page" | "kernel-doc";
}

export interface AtlasArticleMeta {
  id: string;
  slug: string;
  category: AtlasCategory;
  title: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  contentType: ContentType;
  prerequisites: string[];
  related: string[];
  estimatedMinutes: number;
  references: ArticleReference[];
  lastVerified: string; // ISO date
  verifiedAgainst: string;
  limitations?: string;
}

export interface AtlasArticle extends AtlasArticleMeta {
  /** Raw markdown body containing ## Beginner / ## Practical / ## Technical sections. */
  body: string;
}

/* ---------- Distro profiles ---------- */

export interface DistroProfile {
  id: string;
  slug: string;
  name: string;
  basedOn: string | null;
  desktops: string[];
  packageManager: string;
  releaseModel: "rolling" | "point";
  beginnerFriendly: boolean;
  targetUsers: string;
  pros: string[];
  cons: string[];
  tradeoffs: string;
  hardwareRequirements: string;
  idealFor: string[];
  maintenanceLevel: "low" | "medium" | "high";
  officialSite: string;
  downloadNote: string;
  lastVerified: string;
  sources: string[];
}

/* ---------- Terminal playground ---------- */

export interface VirtualFile {
  type: "file" | "dir";
  content?: string;
  children?: Record<string, VirtualFile>;
  permissions?: string;
}

export interface MissionCheck {
  /** Path in the VFS that must exist (or not). */
  pathExists?: string;
  pathNotExists?: string;
  /** Expected stdout substring. */
  outputContains?: string;
  /** File content must contain. */
  fileContains?: { path: string; content: string };
}

export interface TerminalMission {
  id: string;
  title: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  objectives: string[];
  initialFs: Record<string, VirtualFile>;
  checks: MissionCheck[];
  hints: string[];
  explanation: string;
}

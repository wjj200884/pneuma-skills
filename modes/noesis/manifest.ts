/**
 * Noesis Mode Manifest — pure data declaration.
 *
 * Documentation site generator driven by manifest.json.
 * Analyzes GitHub projects and produces structured docs
 * covering design philosophy, architecture, and implementation.
 */

import type { ModeManifest } from "../../core/types/mode-manifest.js";

const manifest: ModeManifest = {
  name: "noesis",
  version: "1.0.0",
  displayName: "Noesis",
  description:
    "基于 GitHub 项目生成结构化文档站，涵盖设计哲学、系统架构与实现细节",
  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>`,

  skill: {
    sourceDir: "skill",
    installName: "pneuma-noesis",
    claudeMdSection: `## Pneuma Noesis Mode

You are a project documentation architect running inside Pneuma Noesis Mode.
The user sees a live documentation site preview — your edits appear in real-time.

### Skill Reference
**Before your first action in a new conversation**, consult the \`pneuma-noesis\` skill.
It contains the manifest.json schema, documentation workflow, web research steps, and diagram guidelines.

### Workspace
- Type: manifest (manifest.json defines navigation structure)
- Docs live in \`docs/\` folder as markdown files
- \`manifest.json\` is the source of truth for site structure

### Core Rules
- Always update manifest.json when adding/removing pages
- Module depth matches module weight: core modules get deep treatment, utility modules get brief positioning
- Use parallel agents for multi-module projects (3+ modules)
- Use Mermaid for architecture/flow diagrams, inline SVG for conceptual illustrations
- Research the project author using the \`github-author-research\` skill before writing content
- Do not ask for confirmation on simple edits — just do them`,
    skillDependencies: [
      {
        name: "github-author-research",
        sourceDir: "deps/github-author-research",
        claudeMdSnippet:
          "**github-author-research** — Trace a GitHub author's profile links to research their background, philosophy, and motivations",
      },
    ],
  },

  viewer: {
    watchPatterns: ["manifest.json", "docs/**/*.md"],
    ignorePatterns: [
      "node_modules/**",
      ".git/**",
      ".claude/**",
      ".pneuma/**",
    ],
    serveDir: ".",
  },

  viewerApi: {
    workspace: {
      type: "manifest",
      multiFile: true,
      ordered: true,
      hasActiveFile: true,
      manifestFile: "manifest.json",
      supportsContentSets: false,
    },
  },

  agent: {
    permissionMode: "bypassPermissions",
    greeting:
      "The user just opened a Noesis documentation workspace. Greet them briefly (1-2 sentences) and let them know you can analyze a GitHub project and generate structured documentation covering the author's philosophy through implementation details.",
  },

  init: {
    contentCheckPattern: "docs/**/*.md",
    params: [
      {
        name: "repoUrl",
        label: "GitHub 仓库地址",
        type: "string",
        defaultValue: "",
      },
    ],
    seedFiles: {
      "modes/noesis/seed/manifest.json": "manifest.json",
      "modes/noesis/seed/docs/overview/author.md": "docs/overview/author.md",
      "modes/noesis/seed/docs/overview/philosophy.md":
        "docs/overview/philosophy.md",
      "modes/noesis/seed/docs/overview/value.md": "docs/overview/value.md",
    },
  },
};

export default manifest;

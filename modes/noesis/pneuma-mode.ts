/**
 * Noesis Mode — ModeDefinition binding manifest + viewer.
 *
 * Manifest-driven documentation site mode.
 * Navigation structure comes from manifest.json,
 * content from docs/ markdown files.
 */

import type { ModeDefinition } from "../../core/types/mode-definition.js";
import type {
  ViewerSelectionContext,
  ViewerFileContent,
} from "../../core/types/viewer-contract.js";
import Preview from "./viewer/Preview.js";
import manifest from "./manifest.js";

interface SiteManifest {
  title: string;
  repo?: string;
  sections: {
    id: string;
    title: string;
    pages: { title: string; file: string }[];
  }[];
}

function parseManifest(files: ViewerFileContent[]): SiteManifest | null {
  const f = files.find((f) => f.path === "manifest.json");
  if (!f) return null;
  try {
    return JSON.parse(f.content);
  } catch {
    return null;
  }
}

const mode: ModeDefinition = {
  manifest,

  viewer: {
    PreviewComponent: Preview,

    workspace: {
      type: "manifest",
      multiFile: true,
      ordered: true,
      hasActiveFile: true,
      manifestFile: "manifest.json",
      topBarNavigation: true,

      resolveItems(files) {
        const site = parseManifest(files);
        if (!site) return [];
        let idx = 0;
        return site.sections.flatMap((section) =>
          section.pages.map((page) => ({
            path: page.file,
            label: page.title,
            index: idx++,
          })),
        );
      },

      createEmpty(files) {
        const existing = new Set(files.map((f) => f.path));
        let name = "docs/untitled.md";
        let n = 1;
        while (existing.has(name)) {
          name = `docs/untitled-${n++}.md`;
        }
        return [{ path: name, content: `# 新页面\n\n` }];
      },
    },

    extractContext(
      selection: ViewerSelectionContext | null,
      files: ViewerFileContent[],
    ): string {
      const file =
        selection?.file ||
        files.find((f) => f.path.startsWith("docs/"))?.path ||
        "";
      if (!file) return "";

      const attrs = [`mode="noesis"`, `file="${file}"`];
      const lines: string[] = [];

      // Find section/page context from manifest
      const site = parseManifest(files);
      if (site) {
        for (const section of site.sections) {
          const page = section.pages.find((p) => p.file === file);
          if (page) {
            lines.push(`Section: ${section.title}`);
            lines.push(`Page: ${page.title}`);
            break;
          }
        }
        const totalPages = site.sections.reduce(
          (n, s) => n + s.pages.length,
          0,
        );
        lines.push(
          `Docs: ${totalPages} pages in ${site.sections.length} sections`,
        );
      }

      // Selection info
      if (selection && selection.type !== "viewing") {
        lines.push(`Selected: ${selection.type} "${selection.content}"`);
      }

      return `<viewer-context ${attrs.join(" ")}>\n${lines.join("\n")}\n</viewer-context>`;
    },

    updateStrategy: "full-reload",
  },
};

export default mode;

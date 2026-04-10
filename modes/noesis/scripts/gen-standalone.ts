#!/usr/bin/env bun
/**
 * Generates standalone/src/App.tsx from viewer/Preview.tsx
 *
 * Replaces:
 * - ViewerPreviewProps import → removed
 * - Pneuma shell (Preview component) → Standalone shell (App component with fetch)
 *
 * Usage: bun scripts/gen-standalone.ts
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";

const root = dirname(dirname(import.meta.path));
const src = join(root, "viewer", "Preview.tsx");
const dst = join(root, "standalone", "src", "App.tsx");

let code = readFileSync(src, "utf-8");

// Remove ViewerPreviewProps import
code = code.replace(
  /import type \{ ViewerPreviewProps \}.*;\n/,
  ""
);

// Replace everything from @shell-start marker to end of file
const shellMarker = "/*  @shell-start";
const shellIdx = code.indexOf(shellMarker);
if (shellIdx === -1) {
  console.error("ERROR: @shell-start marker not found in Preview.tsx");
  process.exit(1);
}

// Find the comment block start (the /* ==== line before @shell-start)
const sectionStart = code.lastIndexOf("/* ===", shellIdx);

const sharedCode = code.slice(0, sectionStart);

const standaloneShell = `/* ================================================================== */
/*  Standalone Shell — auto-generated from Preview.tsx                 */
/*  Do not edit directly. Run: bun scripts/gen-standalone.ts           */
/* ================================================================== */

export default function App() {
  const [dark, toggleTheme] = useTheme();
  const [manifest, setManifest] = useState<SiteManifest | null>(null);
  const [activeFile, setActiveFile] = useState("");
  const [rawContent, setRawContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/manifest.json")
      .then((r) => r.json())
      .then((m: SiteManifest) => {
        setManifest(m);
        document.title = m.title;
        const first = m.sections[0]?.pages[0]?.file;
        if (first) setActiveFile(first);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeFile) return;
    fetch("/" + activeFile)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.text();
      })
      .then(setRawContent)
      .catch(() => setRawContent(""));
  }, [activeFile]);

  const allPages = useMemo(
    () => manifest?.sections.flatMap((s) => s.pages) ?? [],
    [manifest],
  );

  if (loading) {
    return <EmptyState title="Loading…" subtitle="" />;
  }

  if (!manifest) {
    return <EmptyState title="Missing manifest.json" subtitle="" />;
  }

  if (allPages.length === 0) {
    return <EmptyState title={manifest.title} subtitle="manifest.json 中还没有页面" />;
  }

  return (
    <DocumentViewer
      manifest={manifest}
      activeContent={rawContent}
      activeFile={activeFile}
      allPages={allPages}
      onSelect={setActiveFile}
      dark={dark}
      toggleTheme={toggleTheme}
    />
  );
}
`;

// Update header comment
const header = `/**
 * Noesis Standalone App — auto-generated from viewer/Preview.tsx
 * Do not edit directly. Run: bun scripts/gen-standalone.ts
 */

`;

const finalCode =
  header +
  sharedCode.replace(/\/\*\*[\s\S]*?\*\/\n\n/, "") + // remove original header comment
  standaloneShell;

writeFileSync(dst, finalCode, "utf-8");
console.log(`✓ Generated ${dst}`);
console.log(`  Source: ${src}`);

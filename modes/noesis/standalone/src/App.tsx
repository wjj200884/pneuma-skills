/**
 * Noesis Standalone App — auto-generated from viewer/Preview.tsx
 * Do not edit directly. Run: bun scripts/gen-standalone.ts
 */

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Markdoc from "@markdoc/markdoc";
import React from "react";
import mermaid from "mermaid";

/* ================================================================== */
/*  Theme CSS (injected via <style> tag)                               */
/* ================================================================== */

const themeCSS = `
:root {
  --ns-bg: #ffffff;
  --ns-sidebar: #fafafa;
  --ns-card: #ffffff;
  --ns-code: #f5f5f5;
  --ns-text: #0d0d0d;
  --ns-dim: #333333;
  --ns-faint: #888888;
  --ns-accent: #18E299;
  --ns-accent-deep: #0fa76e;
  --ns-border: #e5e5e5;
  --ns-divider: #f0f0f0;
  --ns-surface: #f5f5f5;
  --ns-code-text: #1e1e1e;
}
.dark {
  --ns-bg: #0d0d0d;
  --ns-sidebar: #0d0d0d;
  --ns-card: #141414;
  --ns-code: #0e0e0f;
  --ns-text: #ededed;
  --ns-dim: #a0a0a0;
  --ns-faint: #666666;
  --ns-border: #262626;
  --ns-divider: #1a1a1a;
  --ns-surface: #171717;
  --ns-code-text: #f0f0f0;
}
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");
.noesis-root {
  font-family: "Inter", ui-sans-serif, -apple-system, system-ui, sans-serif;
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  -webkit-font-smoothing: antialiased;
}
.noesis-content { font-size: 16px; line-height: 1.6; color: var(--ns-dim); }
.noesis-content p { margin-bottom: 1.25em; }
.noesis-content p:last-child { margin-bottom: 0; }
.noesis-content a { color: var(--ns-accent-deep); text-decoration: none; transition: color 0.15s; }
.dark .noesis-content a { color: var(--ns-accent); }
.noesis-content a:hover { text-decoration: underline; }
.noesis-content strong { color: var(--ns-text); font-weight: 600; }
.noesis-content ul, .noesis-content ol { margin-bottom: 1.25em; padding-left: 1.5em; }
.noesis-content li { margin-bottom: 0.375em; }
.noesis-content ul > li { list-style-type: disc; }
.noesis-content ol > li { list-style-type: decimal; }
.noesis-content li::marker { color: var(--ns-faint); }
.noesis-content > blockquote { border-left: 2px solid var(--ns-accent); padding-left: 1.25em; margin: 1.5em 0; color: var(--ns-dim); font-size: 1.05em; line-height: 1.6; }
.noesis-content > blockquote:first-child { margin-bottom: 2.5em; font-size: 1.1em; }
.noesis-content hr { border: none; border-top: 1px solid var(--ns-divider); margin: 2.5em 0; }
.noesis-content code { background: var(--ns-surface); color: var(--ns-text); padding: 0.125em 0.5em; border-radius: 6px; font-size: 0.85em; font-family: ui-monospace, "SF Mono", Menlo, monospace; border: 1px solid var(--ns-border); }
.noesis-content pre code { background: none; padding: 0; border-radius: 0; font-size: inherit; color: inherit; border: none; }
.noesis-content table { width: 100%; border-collapse: collapse; margin: 1.5em 0; font-size: 0.875em; }
.noesis-content th { background: var(--ns-surface); color: var(--ns-text); font-weight: 600; text-align: left; padding: 0.75em 1em; border-bottom: 1px solid var(--ns-border); }
.noesis-content td { padding: 0.75em 1em; border-bottom: 1px solid var(--ns-divider); color: var(--ns-dim); }
.noesis-content tr:last-child td { border-bottom: none; }
.noesis-content img { max-width: 100%; border-radius: 16px; margin: 1.5em auto; display: block; }
.noesis-content s { color: var(--ns-faint); }
`;

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

interface ManifestAuthor {
  name: string;
  avatar?: string;
  bio?: string;
}

interface ManifestPage {
  title: string;
  file: string;
}

interface ManifestSection {
  id: string;
  title: string;
  icon?: string;
  pages: ManifestPage[];
}

interface SiteManifest {
  title: string;
  repo?: string;
  author?: ManifestAuthor;
  sections: ManifestSection[];
}

interface TocItem {
  level: number;
  text: string;
  id: string;
}

/* ================================================================== */
/*  Helpers                                                            */
/* ================================================================== */

function collectText(node: any): string {
  let text = "";
  for (const child of node.walk()) {
    if (child.type === "text") text += child.attributes?.content ?? "";
  }
  return text;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff\u3400-\u4dbf]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ================================================================== */
/*  Theme                                                              */
/* ================================================================== */

function useTheme() {
  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem("noesis-theme");
      if (stored) return stored === "dark";
    } catch {}
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("noesis-theme", dark ? "dark" : "light");
    } catch {}
  }, [dark]);

  return [dark, () => setDark((d) => !d)] as const;
}

function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        padding: 6, borderRadius: 8, color: "var(--ns-faint)",
        background: "transparent", border: "none", cursor: "pointer",
        transition: "color 0.15s",
      }}
      title={dark ? "亮色模式" : "暗色模式"}
    >
      {dark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

/* ================================================================== */
/*  Mermaid                                                            */
/* ================================================================== */

let mermaidReady = false;

function initMermaid() {
  if (mermaidReady) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    themeVariables: {
      primaryColor: "#18E299",
      primaryTextColor: "#ededed",
      primaryBorderColor: "#0fa76e",
      lineColor: "#333",
      secondaryColor: "#141414",
      tertiaryColor: "#0d0d0d",
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      fontSize: "13px",
    },
  });
  mermaidReady = true;
}

function MermaidBlock({ code }: { code: string }) {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    initMermaid();
    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
    mermaid
      .render(id, code)
      .then((r) => { setSvg(r.svg); setError(""); })
      .catch((e) => { setError(String(e)); setSvg(""); });
  }, [code]);

  if (error) {
    return <pre style={{ color: "#ef4444", fontSize: 12, padding: 12, background: "var(--ns-surface)", borderRadius: 16, border: "1px solid var(--ns-border)" }}>{error}</pre>;
  }

  return (
    <figure style={{ margin: "2em 0" }}>
      <div
        style={{ display: "flex", justifyContent: "center", borderRadius: 16, background: "var(--ns-surface)", padding: 24, border: "1px solid var(--ns-border)" }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </figure>
  );
}

/* ================================================================== */
/*  Markdoc Config                                                     */
/* ================================================================== */

const MTag = Markdoc.Tag;

const markdocConfig: any = {
  tags: {
    callout: {
      render: "Callout",
      attributes: {
        type: { type: String, default: "note", matches: ["note", "insight", "warning", "error", "tip"] },
      },
      children: ["paragraph", "list", "tag", "fence"],
    },
    figure: {
      render: "Figure",
      selfClosing: true,
      attributes: {
        src: { type: String, required: true },
        caption: { type: String },
        alt: { type: String },
        width: { type: String },
      },
    },
    comparison: {
      render: "Comparison",
      attributes: { title: { type: String } },
      children: ["tag"],
    },
    item: {
      render: "ComparisonItem",
      selfClosing: true,
      attributes: {
        name: { type: String, required: true },
        pros: { type: Array },
        cons: { type: Array },
      },
    },
    quote: {
      render: "Quote",
      attributes: { source: { type: String } },
      children: ["paragraph", "inline"],
    },
  },
  nodes: {
    heading: {
      render: "Heading",
      children: ["inline"],
      attributes: { level: { type: Number, required: true } },
      transform(node: any, config: any) {
        const children = node.transformChildren(config);
        const text = collectText(node);
        return new MTag("Heading", { level: node.attributes.level, id: slugify(text) }, children);
      },
    },
    fence: {
      render: "CodeBlock",
      attributes: {
        content: { type: String, required: true },
        language: { type: String },
      },
      transform(node: any) {
        return new MTag("CodeBlock", {
          language: node.attributes.language || "",
          content: node.attributes.content || "",
        });
      },
    },
  },
};

/* ================================================================== */
/*  Content Components (inline styles for Pneuma compatibility)        */
/* ================================================================== */

function Heading({ level, id, children }: { level: number; id: string; children: React.ReactNode }) {
  const H = `h${level}` as keyof React.JSX.IntrinsicElements;
  const base: React.CSSProperties = { color: "var(--ns-text)", fontFamily: "inherit" };
  const styles: Record<number, React.CSSProperties> = {
    1: { ...base, fontSize: 32, fontWeight: 600, paddingBottom: 16, marginBottom: 32, borderBottom: "1px solid var(--ns-divider)", lineHeight: 1.15, letterSpacing: "-0.02em" },
    2: { ...base, fontSize: 22, fontWeight: 500, lineHeight: 1.3, letterSpacing: "-0.01em" },
    3: { ...base, fontSize: 18, fontWeight: 600, marginTop: 40, marginBottom: 12, lineHeight: 1.3, letterSpacing: "-0.01em" },
    4: { ...base, fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 8 },
  };

  if (level === 2) {
    return (
      <div style={{ marginTop: 56, marginBottom: 20, paddingTop: 32, borderTop: "1px solid var(--ns-divider)" }}>
        <H id={id} style={styles[2]}>{children}</H>
      </div>
    );
  }

  return <H id={id} style={styles[level] || styles[4]}>{children}</H>;
}

function CodeBlock({ language, content }: { language: string; content: string }) {
  if (language === "mermaid") return <MermaidBlock code={content} />;

  return (
    <div style={{ margin: "20px 0 32px" }}>
      {language && (
        <div style={{ display: "flex", alignItems: "center", borderRadius: "16px 16px 0 0", background: "var(--ns-surface)", border: "1px solid var(--ns-border)", borderBottom: "none", padding: "6px 16px" }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: "var(--ns-faint)", lineHeight: "24px" }}>{language}</span>
        </div>
      )}
      <pre style={{ background: "var(--ns-code)", border: "1px solid var(--ns-border)", padding: 16, overflowX: "auto", borderRadius: language ? "0 0 16px 16px" : 16, borderTop: language ? "none" : undefined, margin: 0 }}>
        <code style={{ fontSize: 14, lineHeight: "24px", color: "var(--ns-code-text)", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', whiteSpace: "pre" }}>{content}</code>
      </pre>
    </div>
  );
}

const calloutConfig: Record<string, { icon: string; lightBg: string; lightBorder: string; lightText: string; darkBg: string; darkBorder: string; darkText: string }> = {
  note:    { icon: "ℹ",  lightBg: "#eff6ff", lightBorder: "#bfdbfe", lightText: "#1e40af", darkBg: "rgba(37,99,235,0.2)",  darkBorder: "#1e3a5f", darkText: "#93c5fd" },
  tip:     { icon: "💡", lightBg: "#f0fdf4", lightBorder: "#bbf7d0", lightText: "#166534", darkBg: "rgba(22,163,74,0.2)",  darkBorder: "#14532d", darkText: "#86efac" },
  insight: { icon: "✦",  lightBg: "#f0fdf4", lightBorder: "#bbf7d0", lightText: "#166534", darkBg: "rgba(22,163,74,0.2)",  darkBorder: "#14532d", darkText: "#86efac" },
  warning: { icon: "⚠",  lightBg: "#fefce8", lightBorder: "#fde68a", lightText: "#854d0e", darkBg: "rgba(202,138,4,0.2)",  darkBorder: "#713f12", darkText: "#fde047" },
  error:   { icon: "✗",  lightBg: "#fef2f2", lightBorder: "#fecaca", lightText: "#991b1b", darkBg: "rgba(220,38,38,0.2)",  darkBorder: "#7f1d1d", darkText: "#fca5a5" },
};

function Callout({ type = "note", children }: { type?: string; children: React.ReactNode }) {
  const c = calloutConfig[type] || calloutConfig.note;
  const isDark = document.documentElement.classList.contains("dark");
  const bg = isDark ? c.darkBg : c.lightBg;
  const border = isDark ? c.darkBorder : c.lightBorder;
  const color = isDark ? c.darkText : c.lightText;

  return (
    <div style={{ margin: "16px 0", borderRadius: 16, background: bg, border: `1px solid ${border}`, padding: "16px 20px", color }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{ fontSize: 14, flexShrink: 0, marginTop: 2 }}>{c.icon}</span>
        <div style={{ minWidth: 0, fontSize: 14 }}>{children}</div>
      </div>
    </div>
  );
}

function Figure({ src, caption, alt, width }: { src: string; caption?: string; alt?: string; width?: string }) {
  return (
    <figure style={{ margin: "2em 0" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src={src} alt={alt || caption || ""} style={{ borderRadius: 16, border: "1px solid var(--ns-border)", maxWidth: width || "100%" }} />
      </div>
      {caption && <figcaption style={{ textAlign: "center", fontSize: 14, color: "var(--ns-faint)", marginTop: 12 }}>{caption}</figcaption>}
    </figure>
  );
}

function Comparison({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div style={{ margin: "2em 0", borderRadius: 16, border: "1px solid var(--ns-border)", overflow: "hidden" }}>
      {title && (
        <div style={{ padding: "14px 24px", background: "var(--ns-surface)", borderBottom: "1px solid var(--ns-border)" }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--ns-text)", margin: 0 }}>{title}</h4>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>{children}</div>
    </div>
  );
}

function ComparisonItem({ name, pros, cons }: { name: string; pros?: string[]; cons?: string[] }) {
  return (
    <div style={{ padding: 20, borderRight: "1px solid var(--ns-border)" }}>
      <h5 style={{ fontWeight: 600, color: "var(--ns-text)", fontSize: 14, marginBottom: 12, marginTop: 0 }}>{name}</h5>
      {pros?.map((p, i) => (
        <div key={i} style={{ fontSize: 14, display: "flex", gap: 8, marginBottom: 6 }}>
          <span style={{ color: "#22c55e", flexShrink: 0 }}>✓</span>
          <span style={{ color: "var(--ns-dim)" }}>{p}</span>
        </div>
      ))}
      {cons?.map((c, i) => (
        <div key={i} style={{ fontSize: 14, display: "flex", gap: 8, marginBottom: 6 }}>
          <span style={{ color: "#f59e0b", flexShrink: 0 }}>✗</span>
          <span style={{ color: "var(--ns-dim)" }}>{c}</span>
        </div>
      ))}
    </div>
  );
}

function Quote({ source, children }: { source?: string; children: React.ReactNode }) {
  return (
    <blockquote style={{ margin: "1.5em 0", borderLeft: "2px solid rgba(24,226,153,0.4)", paddingLeft: 20, paddingTop: 4, paddingBottom: 4 }}>
      <div style={{ color: "var(--ns-dim)", fontStyle: "italic" }}>{children}</div>
      {source && <cite style={{ display: "block", fontSize: 14, color: "var(--ns-faint)", marginTop: 8, fontStyle: "normal" }}>— {source}</cite>}
    </blockquote>
  );
}

const markdocComponents: Record<string, React.ComponentType<any>> = {
  Heading, CodeBlock, Callout, Figure, Comparison, ComparisonItem, Quote,
};

/* ================================================================== */
/*  ToC                                                                */
/* ================================================================== */

function extractToc(ast: any): TocItem[] {
  const items: TocItem[] = [];
  for (const node of ast.walk()) {
    if (node.type === "heading" && node.attributes.level <= 3) {
      const text = collectText(node);
      items.push({ level: node.attributes.level, text, id: slugify(text) });
    }
  }
  return items;
}

function TableOfContents({ items, activeId }: { items: TocItem[]; activeId: string }) {
  const filtered = items.filter((i) => i.level >= 2);
  if (filtered.length === 0) return null;

  return (
    <nav style={{ width: 180, flexShrink: 0 }}>
      <div style={{ position: "sticky", top: 0, paddingTop: 80, paddingBottom: 32, paddingRight: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: "var(--ns-faint)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16, paddingLeft: 12 }}>On this page</p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {filtered.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => { e.preventDefault(); document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" }); }}
                style={{
                  display: "block", fontSize: 13, padding: "4px 12px", borderRadius: 8,
                  paddingLeft: item.level === 3 ? 24 : 12,
                  color: activeId === item.id ? "var(--ns-accent-deep)" : "var(--ns-faint)",
                  fontWeight: activeId === item.id ? 500 : 400,
                  background: activeId === item.id ? "var(--ns-surface)" : "transparent",
                  textDecoration: "none", transition: "color 0.15s",
                }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/* ================================================================== */
/*  Sidebar                                                            */
/* ================================================================== */

function Sidebar({
  manifest, activeFile, onSelect, dark, onToggleTheme,
}: {
  manifest: SiteManifest; activeFile: string; onSelect: (file: string) => void;
  dark: boolean; onToggleTheme: () => void;
}) {
  return (
    <nav style={{ width: 240, flexShrink: 0, borderRight: "1px solid var(--ns-border)", overflowY: "auto", padding: "20px 16px", background: "var(--ns-sidebar)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px", marginBottom: 24 }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: 14, fontWeight: 600, color: "var(--ns-text)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{manifest.title}</h1>
          {manifest.repo && (
            <a href={manifest.repo} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "var(--ns-faint)", display: "block", marginTop: 4, textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {manifest.repo.replace("https://github.com/", "")}
            </a>
          )}
        </div>
        <ThemeToggle dark={dark} onToggle={onToggleTheme} />
      </div>

      {manifest.sections.map((section) => (
        <div key={section.id} style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px" }}>
            {section.icon && <span style={{ fontSize: 12, color: "var(--ns-faint)", width: 16, textAlign: "center", flexShrink: 0 }}>{section.icon}</span>}
            <span style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ns-faint)" }}>{section.title}</span>
          </div>
          {section.pages.map((page) => {
            const isActive = page.file === activeFile;
            return (
              <button
                key={page.file}
                onClick={() => onSelect(page.file)}
                style={{
                  width: "100%", textAlign: "left", fontSize: 13.5, padding: "6px 12px", marginLeft: 20,
                  borderRadius: 8, border: "none", cursor: "pointer",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  transition: "all 0.15s",
                  color: isActive ? "var(--ns-accent-deep)" : "var(--ns-dim)",
                  fontWeight: isActive ? 500 : 400,
                  background: isActive ? "var(--ns-surface)" : "transparent",
                }}
              >
                {page.title}
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

/* ================================================================== */
/*  DocumentViewer — shared rendering core                             */
/*  Used by both Pneuma Preview and standalone App                     */
/* ================================================================== */

function DocumentViewer({
  manifest,
  activeContent,
  activeFile,
  allPages,
  onSelect,
  dark,
  toggleTheme,
}: {
  manifest: SiteManifest;
  activeContent: string;
  activeFile: string;
  allPages: ManifestPage[];
  onSelect: (file: string) => void;
  dark: boolean;
  toggleTheme: () => void;
}) {
  const [activeHeadingId, setActiveHeadingId] = useState("");
  const mainRef = useRef<HTMLElement>(null);

  const { rendered, toc } = useMemo(() => {
    if (!activeContent) return { rendered: null, toc: [] };
    const ast = Markdoc.parse(activeContent);
    const tocItems = extractToc(ast);
    const content = Markdoc.transform(ast, markdocConfig);
    const reactContent = Markdoc.renderers.react(content, React, { components: markdocComponents });
    return { rendered: reactContent, toc: tocItems };
  }, [activeContent]);

  useEffect(() => {
    const root = mainRef.current;
    if (!root || toc.length === 0) return;
    const handleScroll = () => {
      const headings = root.querySelectorAll<HTMLElement>("h1[id], h2[id], h3[id]");
      let current = "";
      const rootTop = root.getBoundingClientRect().top;
      for (const h of headings) {
        if (h.getBoundingClientRect().top - rootTop <= 120) current = h.id;
      }
      setActiveHeadingId(current);
    };
    root.addEventListener("scroll", handleScroll, { passive: true });
    const t = setTimeout(handleScroll, 100);
    return () => { root.removeEventListener("scroll", handleScroll); clearTimeout(t); };
  }, [toc, activeContent]);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [activeFile]);

  const currentContext = useMemo(() => {
    for (const s of manifest.sections) {
      const p = s.pages.find((p) => p.file === activeFile);
      if (p) return { section: s, page: p };
    }
    return null;
  }, [manifest, activeFile]);

  const prevNext = useMemo(() => {
    const idx = allPages.findIndex((p) => p.file === activeFile);
    return { prev: idx > 0 ? allPages[idx - 1] : null, next: idx < allPages.length - 1 ? allPages[idx + 1] : null };
  }, [allPages, activeFile]);

  return (
    <div className="noesis-root" style={{ display: "flex", height: "100%", background: "var(--ns-bg)", color: "var(--ns-text)", transition: "background 0.2s, color 0.2s" }}>
      <style>{themeCSS}</style>

      <Sidebar manifest={manifest} activeFile={activeFile} onSelect={onSelect} dark={dark} onToggleTheme={toggleTheme} />

      <main ref={mainRef} style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {currentContext && (
              <div style={{ maxWidth: 768, margin: "0 auto", padding: "32px 40px 0" }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ns-faint)", display: "flex", alignItems: "center", gap: 6 }}>
                  {currentContext.section.icon && <span style={{ opacity: 0.5 }}>{currentContext.section.icon}</span>}
                  <span>{currentContext.section.title}</span>
                  <span style={{ opacity: 0.3 }}>/</span>
                  <span style={{ color: "var(--ns-dim)" }}>{currentContext.page.title}</span>
                </div>
              </div>
            )}

            {manifest.author?.name && activeFile === allPages[0]?.file && (
              <div style={{ maxWidth: 768, margin: "0 auto", padding: "24px 40px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--ns-divider)" }}>
                  {manifest.author.avatar && <img src={manifest.author.avatar} alt={manifest.author.name} style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--ns-surface)" }} />}
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "var(--ns-text)", margin: 0 }}>{manifest.author.name}</p>
                    {manifest.author.bio && <p style={{ fontSize: 12, color: "var(--ns-dim)", margin: "2px 0 0" }}>{manifest.author.bio}</p>}
                  </div>
                </div>
              </div>
            )}

            <article style={{ maxWidth: 768, margin: "0 auto", padding: "32px 40px" }}>
              <div className="noesis-content">{rendered}</div>
            </article>

            {(prevNext.prev || prevNext.next) && (
              <div style={{ maxWidth: 768, margin: "0 auto", padding: "0 40px 64px" }}>
                <div style={{ display: "flex", gap: 16, borderTop: "1px solid var(--ns-divider)", paddingTop: 32 }}>
                  {prevNext.prev ? (
                    <button onClick={() => onSelect(prevNext.prev!.file)} style={{ flex: 1, textAlign: "left", padding: 16, borderRadius: 16, border: "1px solid var(--ns-border)", background: "transparent", cursor: "pointer", color: "var(--ns-dim)", transition: "border-color 0.15s" }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: "var(--ns-faint)", display: "block", marginBottom: 4 }}>← 上一篇</span>
                      <span style={{ fontSize: 14 }}>{prevNext.prev.title}</span>
                    </button>
                  ) : <div style={{ flex: 1 }} />}
                  {prevNext.next ? (
                    <button onClick={() => onSelect(prevNext.next!.file)} style={{ flex: 1, textAlign: "right", padding: 16, borderRadius: 16, border: "1px solid var(--ns-border)", background: "transparent", cursor: "pointer", color: "var(--ns-dim)", transition: "border-color 0.15s" }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: "var(--ns-faint)", display: "block", marginBottom: 4 }}>下一篇 →</span>
                      <span style={{ fontSize: 14 }}>{prevNext.next.title}</span>
                    </button>
                  ) : <div style={{ flex: 1 }} />}
                </div>
              </div>
            )}
          </div>

          <TableOfContents items={toc} activeId={activeHeadingId} />
        </div>
      </main>
    </div>
  );
}

/* ================================================================== */
/*  Empty state                                                        */
/* ================================================================== */

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="noesis-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--ns-faint)", background: "var(--ns-bg)" }}>
      <style>{themeCSS}</style>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 18, marginBottom: 8 }}>{title}</p>
        <p style={{ fontSize: 14 }}>{subtitle}</p>
      </div>
    </div>
  );
}

/* ================================================================== */
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

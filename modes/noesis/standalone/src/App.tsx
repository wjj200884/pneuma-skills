import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import mermaid from "mermaid";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Mermaid                                                            */
/* ------------------------------------------------------------------ */

let mermaidReady = false;

function initMermaid() {
  if (mermaidReady) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    themeVariables: {
      primaryColor: "#3b82f6",
      primaryTextColor: "#e4e4e7",
      primaryBorderColor: "#3b82f6",
      lineColor: "#52525b",
      secondaryColor: "#27272a",
      tertiaryColor: "#18181b",
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
      fontSize: "14px",
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
    return (
      <pre className="text-red-400 text-xs p-3 bg-red-950/30 rounded border border-red-900/40">
        {error}
      </pre>
    );
  }

  return (
    <div
      className="my-4 flex justify-center [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function CodeBlock({
  className,
  children,
}: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) {
  const lang = /language-(\w+)/.exec(className || "")?.[1];
  const code = String(children).replace(/\n$/, "");

  if (lang === "mermaid") return <MermaidBlock code={code} />;

  return <code className={className}>{children}</code>;
}

/* ------------------------------------------------------------------ */
/*  Sidebar                                                            */
/* ------------------------------------------------------------------ */

function Sidebar({
  manifest,
  activeFile,
  onSelect,
}: {
  manifest: SiteManifest;
  activeFile: string;
  onSelect: (file: string) => void;
}) {
  return (
    <nav className="w-56 shrink-0 border-r border-zinc-800/60 overflow-y-auto py-4 px-3 bg-zinc-950/80">
      <div className="px-2 mb-4">
        <h1 className="text-sm font-semibold text-zinc-200 truncate">
          {manifest.title}
        </h1>
        {manifest.repo && (
          <a
            href={manifest.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-zinc-600 hover:text-zinc-400 truncate mt-0.5 block transition-colors"
          >
            {manifest.repo.replace("https://github.com/", "")}
          </a>
        )}
      </div>

      {manifest.sections.map((section) => (
        <div key={section.id} className="mb-3">
          <div className="flex items-center gap-1.5 px-2 py-1.5">
            {section.icon && (
              <span className="text-xs opacity-50 w-4 text-center shrink-0">
                {section.icon}
              </span>
            )}
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {section.title}
            </span>
          </div>

          {section.pages.map((page) => {
            const isActive = page.file === activeFile;
            return (
              <button
                key={page.file}
                onClick={() => onSelect(page.file)}
                className={`
                  w-full text-left text-sm px-2 py-1 ml-5 rounded-md truncate transition-colors
                  ${isActive
                    ? "text-blue-400 bg-blue-500/10"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                  }
                `}
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

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */

export default function App() {
  const [manifest, setManifest] = useState<SiteManifest | null>(null);
  const [activeFile, setActiveFile] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load manifest
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

  // Load active file content
  useEffect(() => {
    if (!activeFile) return;
    fetch(`/${activeFile}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.text();
      })
      .then(setContent)
      .catch(() => setContent(""));

    // Scroll to top on page change
    contentRef.current?.scrollTo(0, 0);
  }, [activeFile]);

  const allPages = useMemo(
    () => manifest?.sections.flatMap((s) => s.pages) ?? [],
    [manifest],
  );

  const currentContext = useMemo(() => {
    if (!manifest) return null;
    for (const section of manifest.sections) {
      const page = section.pages.find((p) => p.file === activeFile);
      if (page) return { section, page };
    }
    return null;
  }, [manifest, activeFile]);

  const prevNext = useMemo(() => {
    const idx = allPages.findIndex((p) => p.file === activeFile);
    return {
      prev: idx > 0 ? allPages[idx - 1] : null,
      next: idx < allPages.length - 1 ? allPages[idx + 1] : null,
    };
  }, [allPages, activeFile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-zinc-500">
        Loading...
      </div>
    );
  }

  if (!manifest) {
    return (
      <div className="flex items-center justify-center h-screen text-zinc-500">
        <p>Missing manifest.json</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-950">
      <Sidebar
        manifest={manifest}
        activeFile={activeFile}
        onSelect={setActiveFile}
      />

      <main ref={contentRef} className="flex-1 overflow-y-auto">
        {currentContext && (
          <div className="px-8 pt-5 pb-0">
            <div className="text-xs text-zinc-500 flex items-center gap-1.5">
              <span className="opacity-60">{currentContext.section.icon}</span>
              <span>{currentContext.section.title}</span>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-400">{currentContext.page.title}</span>
            </div>
          </div>
        )}

        {manifest.author?.name && activeFile === allPages[0]?.file && (
          <div className="px-8 pt-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800/50">
              {manifest.author.avatar && (
                <img
                  src={manifest.author.avatar}
                  alt={manifest.author.name}
                  className="w-10 h-10 rounded-full bg-zinc-800"
                />
              )}
              <div>
                <p className="text-sm font-medium text-zinc-200">
                  {manifest.author.name}
                </p>
                {manifest.author.bio && (
                  <p className="text-xs text-zinc-500">{manifest.author.bio}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <article className="px-8 py-6 max-w-3xl mx-auto">
          <div className="prose prose-invert prose-zinc max-w-none prose-headings:font-semibold prose-h1:text-2xl prose-h1:border-b prose-h1:border-zinc-800 prose-h1:pb-3 prose-h1:mb-6 prose-h2:text-xl prose-h2:mt-8 prose-h3:text-lg prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-blue-500/40 prose-blockquote:text-zinc-400 prose-code:text-emerald-400 prose-code:bg-zinc-800/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-table:text-sm prose-th:text-zinc-300 prose-td:text-zinc-400 prose-img:rounded-lg prose-hr:border-zinc-800">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{ code: CodeBlock as any }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </article>

        {(prevNext.prev || prevNext.next) && (
          <div className="px-8 pb-8 max-w-3xl mx-auto">
            <div className="flex justify-between items-center border-t border-zinc-800/50 pt-4">
              {prevNext.prev ? (
                <button
                  onClick={() => setActiveFile(prevNext.prev!.file)}
                  className="text-sm text-zinc-400 hover:text-blue-400 transition-colors"
                >
                  <span className="text-xs text-zinc-600 block">上一篇</span>
                  {prevNext.prev.title}
                </button>
              ) : (
                <div />
              )}
              {prevNext.next ? (
                <button
                  onClick={() => setActiveFile(prevNext.next!.file)}
                  className="text-sm text-zinc-400 hover:text-blue-400 transition-colors text-right"
                >
                  <span className="text-xs text-zinc-600 block">下一篇</span>
                  {prevNext.next.title}
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

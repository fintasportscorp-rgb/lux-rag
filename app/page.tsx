"use client";

import { useState, useRef, useCallback, useEffect } from "react";

/* ─── i18n dictionaries ─── */
const dict = {
  en: {
    tagline: "LUX \u2022 TIAFT 2026 \u2022 NOTEBOOKLM RAG",
    title: "Lux",
    subtitle: "Illuminate. Ground. Reveal.",
    headerNote: "Each row = source\nCitations only",
    focusLabel: "FOCUS QUERY",
    optional: "(optional)",
    focusPlaceholder:
      "Which low-cost AI writing tools have the strongest user ratings in 2026?",
    pathsLabel: "STRATEGIC PATHS",
    path1: "Performance Audit",
    path1sub: "ratings vs features \u2022 what actually delivers",
    path2: "Market Gap Scout",
    path2sub: "related_topics + competitor pain points",
    path3: "Traction Reality Check",
    path3sub: "pricing vs real adoption",
    path4: "Competitive Edge Brief",
    path4sub: "pros vs alternatives in same task",
    tagsLabel: "TAGS \u2014 insert at cursor",
    promptLabel: "RAG PROMPT",
    promptPlaceholder:
      "1. (Optional) Enter focus query\n2. Click a path\n3. Insert tags where needed",
    copyBtn: "COPY PROMPT",
    launchBtn: "LAUNCH IN NOTEBOOKLM \u2192",
    footer: "Lux \u2022 grounded NotebookLM RAG \u2022 TIAFT Feb 2026",
    copied: "Copied to clipboard",
    copiedFallback: "Copied (fallback)",
    copiedFail: "Select text manually & copy",
    nothingToCopy: "Nothing to copy",
    noPrompt: "No prompt ready",
    consoleReady: "Lux RAG prompt ready",
    checkConsole: "CHECK CONSOLE \u2192",
    /* templates */
    focusSuffix_0: " \u2014 centered on the user focus",
    focusSuffix_1: " \u2014 answering the focus",
    focusSuffix_2: " responding to focus",
    focusSuffix_3: " \u2014 centered on the focus",
  },
  fr: {
    tagline: "LUX \u2022 TIAFT 2026 \u2022 NOTEBOOKLM RAG",
    title: "Lux",
    subtitle: "\u00c9clairer. Ancrer. R\u00e9v\u00e9ler.",
    headerNote: "Chaque ligne = source\nCitations uniquement",
    focusLabel: "REQU\u00caTE FOCUS",
    optional: "(optionnel)",
    focusPlaceholder:
      "Quels outils d'\u00e9criture IA \u00e0 faible co\u00fbt ont les meilleures \u00e9valuations en 2026 ?",
    pathsLabel: "CHEMINS STRAT\u00c9GIQUES",
    path1: "Audit de Performance",
    path1sub: "\u00e9valuations vs fonctionnalit\u00e9s \u2022 ce qui livre vraiment",
    path2: "\u00c9claireur de March\u00e9",
    path2sub: "related_topics + faiblesses concurrentes",
    path3: "V\u00e9rification de Traction",
    path3sub: "tarification vs adoption r\u00e9elle",
    path4: "Brief Avantage Comp\u00e9titif",
    path4sub: "avantages vs alternatives pour la m\u00eame t\u00e2che",
    tagsLabel: "TAGS \u2014 ins\u00e9rer au curseur",
    promptLabel: "PROMPT RAG",
    promptPlaceholder:
      "1. (Optionnel) Entrez la requ\u00eate focus\n2. Cliquez un chemin\n3. Ins\u00e9rez les tags o\u00f9 n\u00e9cessaire",
    copyBtn: "COPIER LE PROMPT",
    launchBtn: "LANCER DANS NOTEBOOKLM \u2192",
    footer: "Lux \u2022 NotebookLM RAG ancr\u00e9 \u2022 TIAFT f\u00e9vrier 2026",
    copied: "Copi\u00e9 dans le presse-papiers",
    copiedFallback: "Copi\u00e9 (m\u00e9thode alt.)",
    copiedFail: "S\u00e9lectionnez le texte et copiez manuellement",
    nothingToCopy: "Rien \u00e0 copier",
    noPrompt: "Aucun prompt pr\u00eat",
    consoleReady: "Prompt Lux RAG pr\u00eat",
    checkConsole: "VOIR LA CONSOLE \u2192",
    focusSuffix_0: " \u2014 centr\u00e9 sur le focus utilisateur",
    focusSuffix_1: " \u2014 en r\u00e9ponse au focus",
    focusSuffix_2: " en r\u00e9ponse au focus",
    focusSuffix_3: " \u2014 centr\u00e9 sur le focus",
  },
} as const;

type Lang = keyof typeof dict;

/* ─── base prompt templates (always English — RAG instructions) ─── */
const baseTemplates = [
  `You are a senior AI analyst inside NotebookLM.

Sources: "There Is an AI for That" February 2026 CSV — each row is one source document.
Use ONLY these sources. Never add external knowledge.

STRATEGIC PATH: Performance Audit

User focus:
{{FOCUS}}

Task: Compare ratings against features and task alignment — centered on the user focus.

Rules:
- Start with exact [ai_name] + [task_label]
- Quote [description] verbatim when summarizing
- Turn [features] into markdown bullets
- Always cite [rating], [rating_count], [pros], [cons]

Output (markdown):
• Tool header
• Performance table: Feature | Evidence | Rating impact
• 3–5 insights answering the focus
• Verdict: Strong / Solid / Overhyped`,

  `You are a senior AI analyst inside NotebookLM.

Sources: "There Is an AI for That" February 2026 CSV — each row is one source document.
Use ONLY these sources. Never add external knowledge.

STRATEGIC PATH: Market Gap Scout

User focus:
{{FOCUS}}

Task: Find white-space opportunities via related_topics and competitor cons — answering the focus.

Rules:
- Group by [task_label]
- Use exact [related_topics] phrases
- Quote [cons] from alternatives
- Link [pros]/[features] to gap closure

Output (markdown):
• Category landscape
• White-space gaps (bullets + citations)
• Top 2–3 fits for the focus
• Suggested new positioning`,

  `You are a senior AI analyst inside NotebookLM.

Sources: "There Is an AI for That" February 2026 CSV — each row is one source document.
Use ONLY these sources. Never add external knowledge.

STRATEGIC PATH: Traction Reality Check

User focus:
{{FOCUS}}

Task: Confront pricing with actual traction — directly informing the focus.

Rules:
- State [pricing_model], [pricing_from], [billing_frequency]
- Compare to [rating_count] + [rating]
- Flag anomalies

Output (markdown):
• Pricing snapshot
• Traction table
• ROI verdict + justification
• Insights responding to focus`,

  `You are a senior AI analyst inside NotebookLM.

Sources: "There Is an AI for That" February 2026 CSV — each row is one source document.
Use ONLY these sources. Never add external knowledge.

STRATEGIC PATH: Competitive Edge Brief

User focus:
{{FOCUS}}

Task: Identify differentiation vs alternatives — centered on the focus.

Rules:
- Start with [task_label] + [rank_2026]
- List [pros] as advantages
- Contrast [cons] and [alternatives]
- Highlight unique [features]

Output (markdown):
• Battlefield: [task_label]
• This tool's edge (bullets)
• Head-to-head vs top alternatives
• Positioning recommendation for the focus`,
];

const tagMap: Record<string, string> = {
  ai_name: "Start sections with exact [ai_name] as canonical name.\n",
  task_label: "Anchor analysis to exact [task_label].\n",
  ai_top_link: "End tool sections with [ai_top_link].\n",
  rank_2026: "Include exact [rank_2026] when relevant.\n",
  description: "Quote [description] verbatim — no paraphrase.\n",
  features: "Convert [features] to markdown bullets.\n",
  pros: "Present [pros] items as cited strengths.\n",
  cons: "Quote [cons] directly for balance/risks.\n",
  alternatives: "Use [alternatives] for competitive context.\n",
  related_topics: "Use [related_topics] phrases as opportunity signals.\n",
  rating: "Always pair [rating] (out of 5) with [rating_count].\n",
  pricing_model: "State [pricing_model] + [pricing_from] together.\n",
};

const tagKeys = Object.keys(tagMap);

const tagLabels: Record<string, string> = {
  rating: "rating + count",
};

/* ─── component ─── */
export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [notification, setNotification] = useState<string | null>(null);
  const [launchLabel, setLaunchLabel] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const focusRef = useRef<HTMLInputElement>(null);
  const t = dict[lang];

  /* notification helper */
  const notify = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2200);
  }, []);

  /* set strategy */
  const setStrategy = useCallback(
    (n: number) => {
      let tpl = baseTemplates[n];
      const q = focusRef.current?.value.trim() || "";

      if (q) {
        tpl = tpl.replace("{{FOCUS}}", q);
      } else {
        tpl = tpl.replace(/\nUser focus:\n\{\{FOCUS\}\}\n\n/, "\n");
        tpl = tpl.replace(/ — centered on the user focus/g, "");
        tpl = tpl.replace(/ — answering the focus/g, "");
        tpl = tpl.replace(/ responding to focus/g, "");
      }

      if (textareaRef.current) {
        textareaRef.current.value = tpl;
        textareaRef.current.focus();
        textareaRef.current.selectionStart =
          textareaRef.current.selectionEnd =
            textareaRef.current.value.length;
      }
    },
    []
  );

  /* insert tag */
  const insertTag = useCallback((key: string) => {
    const ins = tagMap[key];
    if (!ins || !textareaRef.current) return;
    const ta = textareaRef.current;
    const s = ta.selectionStart;
    const e = ta.selectionEnd;
    const txt = ta.value;
    ta.value = txt.substring(0, s) + ins + txt.substring(e);
    ta.selectionStart = ta.selectionEnd = s + ins.length;
    ta.focus();
  }, []);

  /* copy */
  const copyPrompt = useCallback(() => {
    const text = textareaRef.current?.value.trim() || "";
    if (!text) {
      notify(t.nothingToCopy);
      return;
    }

    const fallbackCopy = (txt: string) => {
      const ta = document.createElement("textarea");
      ta.value = txt;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      ta.setSelectionRange(0, 99999);
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
      if (ok) {
        notify(t.copiedFallback);
      } else {
        notify(t.copiedFail);
        textareaRef.current?.select();
      }
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => notify(t.copied))
        .catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }, [notify, t]);

  /* launch */
  const launchRAG = useCallback(() => {
    const text = textareaRef.current?.value.trim() || "";
    if (!text) {
      alert(t.noPrompt);
      return;
    }
    console.clear();
    console.log(`%c${t.consoleReady}`, "color:#10b981;font-weight:bold");
    console.log(text);
    setLaunchLabel(t.checkConsole);
    setTimeout(() => setLaunchLabel(null), 3000);
  }, [t]);

  /* keyboard shortcut */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "Enter") launchRAG();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [launchRAG]);

  const pathColors = [
    { num: "text-emerald-400", border: "hover:border-emerald-600" },
    { num: "text-sky-400", border: "hover:border-sky-600" },
    { num: "text-amber-400", border: "hover:border-amber-600" },
    { num: "text-rose-400", border: "hover:border-rose-600" },
  ];

  const paths = [
    { name: t.path1, sub: t.path1sub },
    { name: t.path2, sub: t.path2sub },
    { name: t.path3, sub: t.path3sub },
    { name: t.path4, sub: t.path4sub },
  ];

  return (
    <>
      <style>{`
        .lux-btn { cursor: pointer; background: none; font-family: inherit; }
        .lux-btn:focus-visible { outline: 2px solid #10b981; outline-offset: 2px; }
        .path-btn { width: 100%; text-align: left; padding: 1.25rem; border: 1px solid #27272a; background: #09090b; display: flex; gap: 1.5rem; cursor: pointer; font-family: inherit; color: inherit; }
        .path-btn:hover { border-color: var(--hover-c); }
        .tag-btn { background: #18181b; border: 1px solid #3f3f46; color: #d4d4d8; padding: 0.375rem 0.75rem; font-size: 0.75rem; cursor: pointer; font-family: inherit; }
        .tag-btn:hover { border-color: #71717a; }
        .action-btn { flex: 1; padding: 1rem; font-size: 0.875rem; letter-spacing: 0.05em; cursor: pointer; font-family: inherit; border: none; }
        .action-copy { background: transparent; border: 1px solid #3f3f46 !important; color: #d1d5db; }
        .action-copy:hover { background: #18181b; }
        .action-launch { background: #059669; color: #000; }
        .action-launch:hover { background: #34d399; }
        .lang-btn { font-size: 0.65rem; letter-spacing: 0.1em; padding: 0.25rem 0.5rem; border: 1px solid #27272a; background: transparent; color: #71717a; cursor: pointer; font-family: inherit; }
        .lang-btn[data-active="true"] { border-color: #059669; color: #34d399; }
      `}</style>

      <div
        style={{
          maxWidth: "48rem",
          margin: "0 auto",
          padding: "3rem 1.5rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderBottom: "1px solid #27272a",
            paddingBottom: "2rem",
            marginBottom: "2.5rem",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "0.125em",
                color: "#34d399",
                marginBottom: "0.25rem",
              }}
            >
              {t.tagline}
            </div>
            <h1
              style={{
                fontSize: "1.875rem",
                fontWeight: 600,
                color: "#fff",
                margin: 0,
              }}
            >
              {t.title}
            </h1>
            <p
              style={{
                color: "#a1a1aa",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
              }}
            >
              {t.subtitle}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#71717a",
                whiteSpace: "pre-line",
                marginBottom: "0.5rem",
              }}
            >
              {t.headerNote}
            </div>
            <div style={{ display: "flex", gap: "0.25rem", justifyContent: "flex-end" }}>
              <button
                className="lang-btn"
                data-active={lang === "en"}
                onClick={() => setLang("en")}
                aria-label="Switch to English"
              >
                EN
              </button>
              <button
                className="lang-btn"
                data-active={lang === "fr"}
                onClick={() => setLang("fr")}
                aria-label="Passer en fran\u00e7ais"
              >
                FR
              </button>
            </div>
          </div>
        </div>

        {/* Focus Query */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div className="section-header" style={{ marginBottom: "0.75rem" }}>
            {t.focusLabel}{" "}
            <span style={{ color: "#71717a" }}>{t.optional}</span>
          </div>
          <input
            ref={focusRef}
            type="text"
            placeholder={t.focusPlaceholder}
            style={{
              width: "100%",
              background: "#09090b",
              border: "1px solid #27272a",
              padding: "1.25rem",
              fontSize: "0.875rem",
              color: "#d1d5db",
              outline: "none",
              fontFamily: "inherit",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "#059669")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "#27272a")
            }
          />
        </div>

        {/* Strategic Paths */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div className="section-header" style={{ marginBottom: "1rem" }}>
            {t.pathsLabel}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {paths.map((p, i) => (
              <button
                key={i}
                className="path-btn"
                style={
                  { "--hover-c": ["#059669", "#0284c7", "#d97706", "#e11d48"][i] } as React.CSSProperties
                }
                onClick={() => setStrategy(i)}
              >
                <div
                  className={pathColors[i].num}
                  style={{ fontWeight: 500, fontSize: "0.75rem", width: "1.5rem" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, color: "#f4f4f5" }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#a1a1aa" }}>
                    {p.sub}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tag Cloud */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div className="section-header" style={{ marginBottom: "1rem" }}>
            {t.tagsLabel}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
            {tagKeys.map((key) => (
              <button
                key={key}
                className="tag-btn"
                onClick={() => insertTag(key)}
              >
                {tagLabels[key] || key}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Area */}
        <div style={{ marginBottom: "2rem" }}>
          <div className="section-header" style={{ marginBottom: "0.75rem" }}>
            {t.promptLabel}
          </div>
          <textarea
            ref={textareaRef}
            placeholder={t.promptPlaceholder}
            style={{
              width: "100%",
              minHeight: "500px",
              background: "#09090b",
              border: "1px solid #27272a",
              padding: "1.5rem",
              fontSize: "0.875rem",
              resize: "vertical",
              outline: "none",
              lineHeight: 1.625,
              color: "#d1d5db",
              fontFamily: "inherit",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "#059669")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "#27272a")
            }
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="action-btn action-copy" onClick={copyPrompt}>
            {t.copyBtn}
          </button>
          <button className="action-btn action-launch" onClick={launchRAG}>
            {launchLabel || t.launchBtn}
          </button>
        </div>

        <div
          style={{
            marginTop: "3rem",
            textAlign: "center",
            fontSize: "10px",
            color: "#52525b",
          }}
        >
          {t.footer}
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: "1.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#18181b",
            border: "1px solid #065f46",
            color: "#6ee7b7",
            fontSize: "0.875rem",
            padding: "1rem 2rem",
            borderRadius: "0.375rem",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,.3)",
            zIndex: 50,
          }}
        >
          {notification}
        </div>
      )}
    </>
  );
}

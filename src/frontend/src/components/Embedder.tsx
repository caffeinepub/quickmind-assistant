import { ExternalLink, Globe, Search, X } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";

const QUICK_LINKS = [
  { label: "DuckDuckGo", url: "https://duckduckgo.com" },
  { label: "Geography Lesson", url: "https://geography-lesson-11.us" },
  { label: "Poxel", url: "https://poxel.io" },
  { label: "2v2", url: "https://2v2.io" },
  { label: "Fall Zone", url: "https://fallzone.io" },
  { label: "Bloxd", url: "https://bloxd.io" },
];

const POPUP_FEATURES =
  "width=1150,height=611,directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no";

function openInPopup(src: string) {
  const win = window.open("", "", POPUP_FEATURES);
  if (!win) return;
  win.document.write(
    `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}html,body{width:100%;height:100%;overflow:hidden}iframe{width:100%;height:100%;border:none}</style></head><body><iframe src="${src}" allowfullscreen></iframe></body></html>`,
  );
  win.document.close();
}

export default function Embedder({ onClose }: { onClose: () => void }) {
  const [url, setUrl] = useState("https://duckduckgo.com");
  const [loadedUrl, setLoadedUrl] = useState("https://duckduckgo.com");
  const [inputVal, setInputVal] = useState("https://duckduckgo.com");
  const inputRef = useRef<HTMLInputElement>(null);

  const normalize = useCallback((dest: string) => {
    let target = dest.trim();
    if (!target) return "";
    if (!target.startsWith("http://") && !target.startsWith("https://")) {
      if (target.includes(" ") || !target.includes(".")) {
        target = `https://duckduckgo.com/?q=${encodeURIComponent(target)}`;
      } else {
        target = `https://${target}`;
      }
    }
    return target;
  }, []);

  const navigate = useCallback(
    (dest: string) => {
      const target = normalize(dest);
      if (!target) return;
      setUrl(target);
      setLoadedUrl(target);
      setInputVal(target);
    },
    [normalize],
  );

  const handleOpen = useCallback(() => {
    const target = normalize(inputVal);
    if (target) openInPopup(target);
  }, [inputVal, normalize]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") navigate(inputVal);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 16 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="fixed inset-4 sm:inset-8 z-[150] rounded-2xl overflow-hidden shadow-2xl border border-border/60 flex flex-col"
      style={{ background: "oklch(0.11 0.012 255)" }}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/40 shrink-0">
        <Globe className="w-4 h-4 text-primary shrink-0" />
        <div className="flex-1 flex items-center gap-1 bg-[oklch(0.18_0.012_255)] rounded-xl px-3 py-1.5 border border-border/40 focus-within:border-primary/50">
          <input
            ref={inputRef}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search DuckDuckGo or enter a URL..."
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none font-mono"
          />
          <button
            type="button"
            onClick={() => navigate(inputVal)}
            className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
            title="Go"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Open in popup window */}
        <button
          type="button"
          onClick={handleOpen}
          title="Open in popup window (no toolbar)"
          className="shrink-0 flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-[oklch(0.55_0.18_150/0.25)] hover:bg-[oklch(0.55_0.18_150/0.4)] border border-accent/30 text-accent transition-all whitespace-nowrap"
        >
          <ExternalLink className="w-3 h-3" />
          <span className="hidden sm:inline">Open</span>
        </button>

        {/* Quick links */}
        <div className="hidden lg:flex items-center gap-1">
          {QUICK_LINKS.map((ql) => (
            <button
              key={ql.url}
              type="button"
              onClick={() => navigate(ql.url)}
              className={`text-xs px-2.5 py-1 rounded-lg transition-all border ${
                loadedUrl === ql.url
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "bg-[oklch(0.18_0.012_255)] border-border/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              {ql.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable quick links for smaller screens */}
      <div className="flex lg:hidden items-center gap-1.5 px-3 py-2 border-b border-border/30 overflow-x-auto shrink-0">
        {QUICK_LINKS.map((ql) => (
          <div key={ql.url} className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => navigate(ql.url)}
              className={`text-xs px-2.5 py-1 rounded-lg transition-all border whitespace-nowrap ${
                loadedUrl === ql.url
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "bg-[oklch(0.18_0.012_255)] border-border/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              {ql.label}
            </button>
            <button
              type="button"
              onClick={() => openInPopup(ql.url)}
              title={`Open ${ql.label} in popup`}
              className="text-muted-foreground/50 hover:text-accent transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* iframe */}
      <iframe
        key={url}
        src={url}
        title="Embedder"
        className="flex-1 w-full border-0"
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
        allow="fullscreen"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </motion.div>
  );
}

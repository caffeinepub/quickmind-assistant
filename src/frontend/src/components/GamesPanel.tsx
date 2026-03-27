import { ExternalLink, Gamepad2, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { CATEGORIES, GAMES, type GameEntry } from "./gamesData";

function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    "IO Games": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    Arcade: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    Puzzle: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    Sports: "bg-green-500/20 text-green-300 border-green-500/30",
    Action: "bg-red-500/20 text-red-300 border-red-500/30",
    Strategy: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    Classics: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    Platformer: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    Portals: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  };
  return map[category] ?? "bg-muted/30 text-muted-foreground border-border/30";
}

function GameOverlay({
  game,
  onClose,
}: {
  game: GameEntry;
  onClose: () => void;
}) {
  const [embedError, setEmbedError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      data-ocid="games.modal"
      className="fixed inset-0 z-[200] flex flex-col bg-black"
    >
      {/* Header bar */}
      <div
        className="flex items-center gap-3 px-4 shrink-0 border-b border-white/10"
        style={{ height: 48, background: "oklch(0.10 0.012 255)" }}
      >
        <span className="text-xl">{game.emoji}</span>
        <span className="font-semibold text-sm text-white truncate">
          {game.title}
        </span>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-md border shrink-0 ${getCategoryColor(game.category)}`}
        >
          {game.category}
        </span>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            data-ocid="games.open_modal_button"
            onClick={() => window.open(game.url, "_blank")}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open in Tab
          </button>
          <button
            type="button"
            data-ocid="games.close_button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Game iframe or error */}
      <div className="flex-1 relative">
        {embedError ? (
          <div
            data-ocid="games.error_state"
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black text-white"
          >
            <span className="text-5xl">🚫</span>
            <p className="text-base font-semibold">
              This game blocked embedding
            </p>
            <p className="text-sm text-white/50">
              Click below to play in a new tab
            </p>
            <button
              type="button"
              onClick={() => window.open(game.url, "_blank")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              <ExternalLink className="w-4 h-4" />
              Open in Tab
            </button>
          </div>
        ) : (
          <iframe
            key={game.url}
            src={game.url}
            title={game.title}
            allowFullScreen
            allow="autoplay; fullscreen; encrypted-media; gamepad"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-top-navigation"
            onError={() => setEmbedError(true)}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

export default function GamesPanel({ onClose }: { onClose: () => void }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeGame, setActiveGame] = useState<GameEntry | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return GAMES.filter((g) => {
      const matchCat =
        activeCategory === "All" || g.category === activeCategory;
      const matchSearch =
        !q ||
        g.title.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        data-ocid="games.panel"
        className="fixed inset-3 sm:inset-6 z-[150] rounded-2xl overflow-hidden shadow-2xl border border-border/60 flex flex-col"
        style={{ background: "oklch(0.11 0.012 255)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
            <Gamepad2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base leading-none text-foreground">
              Games Library
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {filtered.length} / {GAMES.length} games
            </p>
          </div>

          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-[oklch(0.18_0.012_255)] rounded-xl px-3 py-1.5 border border-border/40 focus-within:border-primary/50 transition-colors max-w-sm ml-auto">
            <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search games..."
              data-ocid="games.search_input"
              className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
              autoComplete="off"
            />
          </div>

          <button
            type="button"
            onClick={onClose}
            data-ocid="games.close_button"
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border/30 overflow-x-auto shrink-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              data-ocid={"games.tab"}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-primary/20 border-primary/40 text-primary font-medium"
                  : "bg-[oklch(0.18_0.012_255)] border-border/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-40 gap-3"
                data-ocid="games.empty_state"
              >
                <span className="text-4xl">🎮</span>
                <p className="text-sm text-muted-foreground">No games found</p>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
              >
                {filtered.map((game, i) => (
                  <GameTile
                    key={`${game.url}-${i}`}
                    game={game}
                    index={i}
                    onPlay={() => setActiveGame(game)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Fullscreen game overlay */}
      <AnimatePresence>
        {activeGame && (
          <GameOverlay game={activeGame} onClose={() => setActiveGame(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

function GameTile({
  game,
  index,
  onPlay,
}: {
  game: GameEntry;
  index: number;
  onPlay: () => void;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.015, 0.4), duration: 0.2 }}
      onClick={onPlay}
      data-ocid={`games.item.${index + 1}`}
      className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-border/40 bg-[oklch(0.16_0.012_255)] hover:bg-[oklch(0.22_0.015_255)] hover:border-primary/30 transition-all text-center active:scale-95 cursor-pointer"
    >
      <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
        {game.emoji}
      </span>
      <span className="text-xs font-medium text-foreground leading-tight line-clamp-2">
        {game.title}
      </span>
      <span
        className={`text-[10px] px-1.5 py-0.5 rounded-md border ${getCategoryColor(game.category)}`}
      >
        {game.category}
      </span>
    </motion.button>
  );
}

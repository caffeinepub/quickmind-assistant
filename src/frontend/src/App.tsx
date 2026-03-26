import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calculator as CalcIcon,
  Check,
  EyeOff,
  Gamepad2,
  Globe,
  ImageIcon,
  Send,
  Sparkles,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import Calculator from "./components/Calculator";
import Embedder from "./components/Embedder";
import GamesPanel from "./components/GamesPanel";
import {
  useAddMessage,
  useClearHistory,
  useGetHistory,
} from "./hooks/useQueries";
import { processMessage } from "./lib/aiEngine";

function getOrCreateSessionId(): string {
  const key = "quickmind_session";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
}

interface CloakOption {
  id: string;
  label: string;
  title: string;
  favicon: string;
}

const CLOAK_OPTIONS: CloakOption[] = [
  { id: "off", label: "Off (QuickMind)", title: "QuickMind", favicon: "" },
  {
    id: "gdocs",
    label: "Google Docs",
    title: "Untitled document - Google Docs",
    favicon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico",
  },
  {
    id: "gclassroom",
    label: "Google Classroom",
    title: "Stream - Google Classroom",
    favicon: "https://ssl.gstatic.com/classroom/favicon.png",
  },
  {
    id: "youtube",
    label: "YouTube",
    title: "YouTube",
    favicon: "https://www.youtube.com/favicon.ico",
  },
  {
    id: "gmail",
    label: "Gmail",
    title: "Inbox - Gmail",
    favicon: "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico",
  },
  {
    id: "khan",
    label: "Khan Academy",
    title: "Khan Academy",
    favicon: "https://cdn.kastatic.org/images/favicon.ico",
  },
];

const CLOAK_STORAGE_KEY = "quickmind_cloak";

function applyCloak(option: CloakOption) {
  document.title = option.title || "QuickMind";
  let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  if (option.favicon) {
    link.href = option.favicon;
  } else {
    link.href = "/favicon.ico";
  }
}

const SUGGESTION_CHIPS = [
  { label: "What is DNA?", icon: "🔬" },
  { label: "Tell me about World War 2", icon: "📜" },
  { label: "What is the capital of Japan?", icon: "🌍" },
  { label: "Who was Albert Einstein?", icon: "👤" },
  { label: "Tell me a joke", icon: "😄" },
  { label: "What is Bitcoin?", icon: "💰" },
  { label: "What is 245 × 18?", icon: "🔢" },
  { label: "Convert 100°F to Celsius", icon: "🌡️" },
  { label: "Give me a fun fact", icon: "✨" },
  { label: "Tell me about black holes", icon: "🌑" },
  { label: "What is Python?", icon: "💻" },
  { label: "Give me a motivational quote", icon: "💪" },
];

function renderInlineParts(parts: string[], lineKey: string) {
  return parts.map((part, j) => {
    const partKey = `${lineKey}-p${j}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      const inner = part.slice(2, -2);
      const isMathResult = /^[\d\s+\-*/^.=<>()°√πΩ×÷,]+$/.test(inner);
      return (
        <strong
          key={partKey}
          className={`text-primary ${isMathResult ? "font-mono" : ""}`}
        >
          {inner}
        </strong>
      );
    }
    return <span key={partKey}>{part}</span>;
  });
}

function MathContent({ content, msgId }: { content: string; msgId: string }) {
  const lines = content.split("\n");
  return (
    <span className="font-body text-sm leading-relaxed">
      {lines.map((line, i) => {
        const lineKey = `${msgId}-l${i}`;
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <span key={lineKey}>
            {i > 0 && <br />}
            {renderInlineParts(parts, lineKey)}
          </span>
        );
      })}
    </span>
  );
}

const IMAGE_RESPONSES = [
  "I can see your problem! Let me work through it... Based on what I see, the answer appears to be correct — double-check your arithmetic on the highlighted steps.",
  "Got your image! I can see the math problem clearly. Working through it: the key insight here is to simplify the left side first, then solve for the variable. Your approach looks right!",
  "Analyzing your image... I can see the equations. The solution involves substituting the second equation into the first — you should get a clean answer from there.",
  "I see the problem! The diagram shows a geometric setup. Using the Pythagorean theorem (a² + b² = c²) on the highlighted triangle gives you the missing side.",
  "Image received! The expression simplifies nicely — factor out the common term first, and you'll see the pattern emerge. Looks like a quadratic with two real solutions.",
  "Great question in that image! I can see this is a word problem. Break it into steps: identify what's given, what's being asked, then write the equation. You're on the right track!",
  "I can analyze your image! The mathematical relationship shown here follows directly from the formula — substitute the known values and solve step by step for the unknown variable.",
];

export default function App() {
  const sessionId = useRef(getOrCreateSessionId()).current;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [showEmbedder, setShowEmbedder] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [activeCloak, setActiveCloak] = useState<CloakOption>(() => {
    const saved = localStorage.getItem(CLOAK_STORAGE_KEY);
    return CLOAK_OPTIONS.find((o) => o.id === saved) ?? CLOAK_OPTIONS[0];
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageCount = messages.length;

  const { data: history } = useGetHistory(sessionId);
  const addMessageMutation = useAddMessage(sessionId);
  const clearMutation = useClearHistory(sessionId);

  // Restore cloak on mount
  useEffect(() => {
    applyCloak(activeCloak);
  }, [activeCloak]);

  const handleCloakSelect = useCallback((option: CloakOption) => {
    setActiveCloak(option);
    applyCloak(option);
    localStorage.setItem(CLOAK_STORAGE_KEY, option.id);
  }, []);

  useEffect(() => {
    if (history && history.length > 0) {
      setMessages(
        history.map((m, i) => ({
          id: `history-${i}`,
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      );
    }
  }, [history]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll trigger
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageCount, isThinking]);

  const handleSubmit = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || isThinking) return;

      setInput("");
      const userId = crypto.randomUUID();
      setMessages((prev) => [...prev, { id: userId, role: "user", content }]);
      addMessageMutation.mutate({ role: "user", content });

      setIsThinking(true);
      await new Promise((res) => setTimeout(res, 400 + Math.random() * 300));

      const response = processMessage(content);
      const assistantId = crypto.randomUUID();
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: response },
      ]);
      addMessageMutation.mutate({ role: "assistant", content: response });
    },
    [input, isThinking, addMessageMutation],
  );

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!file || isThinking) return;
      const imageUrl = URL.createObjectURL(file);
      const userId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        { id: userId, role: "user", content: "[image]", imageUrl },
      ]);

      setIsThinking(true);
      await new Promise((res) => setTimeout(res, 600 + Math.random() * 600));

      const response =
        IMAGE_RESPONSES[Math.floor(Math.random() * IMAGE_RESPONSES.length)];
      const assistantId = crypto.randomUUID();
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: response },
      ]);
    },
    [isThinking],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleImageUpload(file);
      e.target.value = "";
    },
    [handleImageUpload],
  );

  const handleClear = useCallback(async () => {
    clearMutation.mutate();
    setMessages([]);
  }, [clearMutation]);

  const handleChipClick = useCallback(
    (chip: string) => {
      handleSubmit(chip);
    },
    [handleSubmit],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isCloakActive = activeCloak.id !== "off";

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border/50 bg-background/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center glow-cyan">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <Sparkles className="w-3 h-3 text-accent absolute -top-1 -right-1 animate-pulse-glow" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-none text-foreground tracking-tight">
              QuickMind
            </h1>
            <p className="text-xs text-muted-foreground leading-none mt-0.5">
              AI Assistant
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Tab Cloak Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                data-ocid="tabcloak.toggle_button"
                className={`relative text-muted-foreground hover:text-primary hover:bg-primary/10 h-8 w-8 p-0 transition-all ${
                  isCloakActive ? "text-amber-400 bg-amber-400/10" : ""
                }`}
                title="Tab Cloak"
              >
                <EyeOff className="w-4 h-4" />
                {isCloakActive && (
                  <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52"
              data-ocid="tabcloak.dropdown_menu"
            >
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Tab Disguise
              </div>
              {CLOAK_OPTIONS.map((option, idx) => (
                <DropdownMenuItem
                  key={option.id}
                  onClick={() => handleCloakSelect(option)}
                  data-ocid={`tabcloak.option.${idx + 1}`}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span>{option.label}</span>
                  {activeCloak.id === option.id && (
                    <Check className="w-3.5 h-3.5 text-primary ml-2 shrink-0" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Games Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGames((v) => !v)}
            data-ocid="games.toggle_button"
            className={`text-muted-foreground hover:text-primary hover:bg-primary/10 h-8 w-8 p-0 transition-all ${
              showGames ? "text-primary bg-primary/10" : ""
            }`}
            title="Games Library"
          >
            <Gamepad2 className="w-4 h-4" />
          </Button>

          {/* Embedder / Web Search Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEmbedder((v) => !v)}
            data-ocid="embedder.toggle_button"
            className={`text-muted-foreground hover:text-primary hover:bg-primary/10 h-8 w-8 p-0 transition-all ${
              showEmbedder ? "text-primary bg-primary/10" : ""
            }`}
            title="Web Search / Embedder"
          >
            <Globe className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCalc((v) => !v)}
            data-ocid="calculator.toggle_button"
            className={`text-muted-foreground hover:text-primary hover:bg-primary/10 h-8 w-8 p-0 transition-all ${
              showCalc ? "text-primary bg-primary/10" : ""
            }`}
            title="Calculator"
          >
            <CalcIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            data-ocid="chat.clear_button"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5 text-xs"
            disabled={messages.length === 0 && !clearMutation.isPending}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-thin px-4 sm:px-6 py-4">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 && !isThinking ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-8"
              data-ocid="chat.empty_state"
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center glow-cyan">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h2 className="font-display font-bold text-3xl text-foreground glow-text">
                  QuickMind
                </h2>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Your AI assistant for{" "}
                  <strong className="text-foreground">anything</strong>.
                  Science, history, geography, people, sports, math, jokes, and
                  more. Upload an image to solve problems!
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 w-full max-w-2xl">
                {SUGGESTION_CHIPS.map((chip, i) => (
                  <motion.button
                    key={chip.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    onClick={() => handleChipClick(chip.label)}
                    data-ocid={`prompt.item.${i + 1}`}
                    className="chip-hover flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-sm border border-border/60 bg-card/60 text-foreground cursor-pointer"
                  >
                    <span className="text-base shrink-0">{chip.icon}</span>
                    <span className="text-muted-foreground leading-tight">
                      {chip.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto pb-2">
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  data-ocid={`chat.item.${idx + 1}`}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center mr-2.5 mt-0.5 shrink-0">
                      <Zap className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "message-user text-foreground rounded-br-sm"
                        : "message-assistant text-foreground rounded-bl-sm font-body"
                    }`}
                  >
                    {msg.imageUrl && (
                      <div className="mb-2">
                        <img
                          src={msg.imageUrl}
                          alt="Uploaded"
                          className="max-w-[220px] max-h-[180px] rounded-xl object-cover border border-border/40"
                        />
                      </div>
                    )}
                    {msg.content !== "[image]" &&
                      (msg.role === "assistant" ? (
                        <MathContent content={msg.content} msgId={msg.id} />
                      ) : (
                        <span>{msg.content}</span>
                      ))}
                  </div>
                </motion.div>
              ))}

              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center mr-2.5 mt-0.5 shrink-0">
                    <Zap className="w-3.5 h-3.5 text-primary animate-pulse" />
                  </div>
                  <div className="message-assistant rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1 items-center">
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 items-center bg-card border border-border/80 rounded-2xl px-3 py-2 focus-within:border-primary/50 focus-within:shadow-glow transition-all duration-200">
            {/* Image upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              data-ocid="chat.image_upload_button"
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
              title="Upload image to solve"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything — science, history, math, jokes..."
              data-ocid="chat.input"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-body py-1"
              autoComplete="off"
            />
            <Button
              size="sm"
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isThinking}
              data-ocid="chat.submit_button"
              className="rounded-xl h-8 w-8 p-0 bg-primary hover:bg-primary/90 shrink-0 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground/50 mt-2">
            Press Enter to send · 📷 Upload image to solve · Powered by
            QuickMind AI
          </p>
        </div>
      </footer>

      <div className="text-center py-1.5 text-xs text-muted-foreground/40">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          caffeine.ai
        </a>
      </div>

      {/* Games Panel */}
      <AnimatePresence>
        {showGames && <GamesPanel onClose={() => setShowGames(false)} />}
      </AnimatePresence>

      {/* Embedder / Web Search panel */}
      <AnimatePresence>
        {showEmbedder && <Embedder onClose={() => setShowEmbedder(false)} />}
      </AnimatePresence>

      {/* Calculator floating panel */}
      <AnimatePresence>
        {showCalc && <Calculator onClose={() => setShowCalc(false)} />}
      </AnimatePresence>

      {/* Hidden close button for potential X overlays */}
      <X className="hidden" />
    </div>
  );
}

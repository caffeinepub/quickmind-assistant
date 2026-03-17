import { Lock, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

type CalcOp = "+" | "-" | "*" | "/" | null;

interface CalcState {
  display: string;
  prev: number | null;
  op: CalcOp;
  waitingForOperand: boolean;
}

const initState: CalcState = {
  display: "0",
  prev: null,
  op: null,
  waitingForOperand: false,
};

function calculate(a: number, b: number, op: CalcOp): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b !== 0 ? a / b : 0;
    default:
      return b;
  }
}

function formatDisplay(val: string): string {
  const n = Number.parseFloat(val);
  if (Number.isNaN(n)) return val;
  if (val.includes(".") && !val.endsWith(".")) return val;
  return n.toLocaleString("en-US", { maximumFractionDigits: 10 });
}

const PIN_KEYS = [
  { label: "1", id: "pk1" },
  { label: "2", id: "pk2" },
  { label: "3", id: "pk3" },
  { label: "4", id: "pk4" },
  { label: "5", id: "pk5" },
  { label: "6", id: "pk6" },
  { label: "7", id: "pk7" },
  { label: "8", id: "pk8" },
  { label: "9", id: "pk9" },
  { label: "", id: "pkx" },
  { label: "0", id: "pk0" },
  { label: "\u232b", id: "pkb" },
];

export default function Calculator({ onClose }: { onClose: () => void }) {
  const [calc, setCalc] = useState<CalcState>(initState);
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");
  const [pinShake, setPinShake] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const pinInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showPin) {
      setTimeout(() => pinInputRef.current?.focus(), 100);
    }
  }, [showPin]);

  const pressDigit = useCallback((d: string) => {
    setCalc((prev) => {
      if (prev.waitingForOperand) {
        return { ...prev, display: d, waitingForOperand: false };
      }
      const newDisplay = prev.display === "0" ? d : `${prev.display}${d}`;
      if (newDisplay.length > 12) return prev;
      return { ...prev, display: newDisplay };
    });
  }, []);

  const pressDecimal = useCallback(() => {
    setCalc((prev) => {
      if (prev.waitingForOperand)
        return { ...prev, display: "0.", waitingForOperand: false };
      if (prev.display.includes(".")) return prev;
      return { ...prev, display: `${prev.display}.` };
    });
  }, []);

  const pressOp = useCallback((op: CalcOp) => {
    setCalc((prev) => {
      const current = Number.parseFloat(prev.display);
      if (prev.prev !== null && prev.op && !prev.waitingForOperand) {
        const result = calculate(prev.prev, current, prev.op);
        const resultStr = String(Number.parseFloat(result.toPrecision(12)));
        return {
          display: resultStr,
          prev: result,
          op,
          waitingForOperand: true,
        };
      }
      return { ...prev, prev: current, op, waitingForOperand: true };
    });
  }, []);

  const pressEquals = useCallback(() => {
    setCalc((prev) => {
      if (prev.prev === null || !prev.op) return prev;
      const current = Number.parseFloat(prev.display);
      const result = calculate(prev.prev, current, prev.op);
      const resultStr = String(Number.parseFloat(result.toPrecision(12)));
      return {
        display: resultStr,
        prev: null,
        op: null,
        waitingForOperand: true,
      };
    });
  }, []);

  const pressToggleSign = useCallback(() => {
    setCalc((prev) => {
      const n = Number.parseFloat(prev.display) * -1;
      return { ...prev, display: String(n) };
    });
  }, []);

  const pressPercent = useCallback(() => {
    setCalc((prev) => {
      const n = Number.parseFloat(prev.display) / 100;
      return { ...prev, display: String(Number.parseFloat(n.toPrecision(10))) };
    });
  }, []);

  const pressClear = useCallback(() => setCalc(initState), []);

  const handlePinKey = useCallback((digit: string) => {
    setPin((prev) => {
      const next = `${prev}${digit}`.slice(0, 4);
      if (next.length === 4) {
        if (next === "0000") {
          setShowPin(false);
          setPin("");
          setTimeout(() => setShowIframe(true), 200);
        } else {
          setPinShake(true);
          setTimeout(() => {
            setPinShake(false);
            setPin("");
          }, 600);
          return next;
        }
      }
      return next;
    });
  }, []);

  const handlePinInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.replace(/\D/g, "").slice(-1);
      if (val) handlePinKey(val);
      e.target.value = "";
    },
    [handlePinKey],
  );

  type BtnVariant = "digit" | "op" | "func" | "equals" | "code";
  const btns: { label: string; variant: BtnVariant; action: () => void }[] = [
    { label: "C", variant: "func", action: pressClear },
    { label: "\u00b1", variant: "func", action: pressToggleSign },
    { label: "%", variant: "func", action: pressPercent },
    { label: "\u00f7", variant: "op", action: () => pressOp("/") },
    { label: "7", variant: "digit", action: () => pressDigit("7") },
    { label: "8", variant: "digit", action: () => pressDigit("8") },
    { label: "9", variant: "digit", action: () => pressDigit("9") },
    { label: "\u00d7", variant: "op", action: () => pressOp("*") },
    { label: "4", variant: "digit", action: () => pressDigit("4") },
    { label: "5", variant: "digit", action: () => pressDigit("5") },
    { label: "6", variant: "digit", action: () => pressDigit("6") },
    { label: "\u2212", variant: "op", action: () => pressOp("-") },
    { label: "1", variant: "digit", action: () => pressDigit("1") },
    { label: "2", variant: "digit", action: () => pressDigit("2") },
    { label: "3", variant: "digit", action: () => pressDigit("3") },
    { label: "+", variant: "op", action: () => pressOp("+") },
    {
      label: "CODE",
      variant: "code",
      action: () => {
        setPin("");
        setShowPin(true);
      },
    },
    { label: "0", variant: "digit", action: () => pressDigit("0") },
    { label: ".", variant: "digit", action: pressDecimal },
    { label: "=", variant: "equals", action: pressEquals },
  ];

  const variantClass: Record<BtnVariant, string> = {
    digit:
      "bg-[oklch(0.22_0.012_255)] hover:bg-[oklch(0.28_0.015_255)] text-foreground",
    op: "bg-[oklch(0.78_0.18_195/0.25)] hover:bg-[oklch(0.78_0.18_195/0.4)] text-primary border border-primary/30",
    func: "bg-[oklch(0.26_0.02_255)] hover:bg-[oklch(0.32_0.025_255)] text-muted-foreground",
    equals: "bg-primary hover:bg-primary/90 text-primary-foreground",
    code: "bg-[oklch(0.55_0.18_150/0.3)] hover:bg-[oklch(0.55_0.18_150/0.5)] text-accent border border-accent/40 text-xs font-bold",
  };

  return (
    <>
      {/* Iframe overlay */}
      <AnimatePresence>
        {showIframe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black"
          >
            <iframe
              src="https://poxel.io"
              title="Poxel"
              className="w-full h-full border-0"
              style={{
                willChange: "transform",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
              allow="fullscreen"
            />
            <button
              type="button"
              onClick={() => setShowIframe(false)}
              data-ocid="iframe.close_button"
              className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-black/70 hover:bg-black/90 text-white text-sm px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/20 transition-all"
            >
              <X className="w-4 h-4" /> Back
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calculator panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        data-ocid="calculator.panel"
        className="fixed bottom-24 right-4 sm:right-8 z-50 w-72 rounded-2xl overflow-hidden shadow-2xl border border-border/60"
        style={{ background: "oklch(0.14 0.01 255)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40">
          <span className="text-xs text-muted-foreground font-body font-medium tracking-wider uppercase">
            Calculator
          </span>
          <button
            type="button"
            onClick={onClose}
            data-ocid="calculator.close_button"
            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Display */}
        <div className="px-4 py-3 text-right">
          <div className="text-muted-foreground text-xs h-4 mb-1 font-mono">
            {calc.op && calc.prev !== null ? `${calc.prev} ${calc.op}` : ""}
          </div>
          <div className="text-3xl font-mono font-light text-foreground truncate">
            {formatDisplay(calc.display)}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-1 p-3">
          {btns.map((btn) => (
            <button
              key={btn.label}
              type="button"
              onClick={btn.action}
              data-ocid={
                btn.variant === "code" ? "calculator.code_button" : undefined
              }
              className={`h-14 rounded-xl text-lg font-medium transition-all active:scale-95 flex items-center justify-center gap-1 ${
                variantClass[btn.variant]
              }`}
            >
              {btn.variant === "code" && <Lock className="w-3 h-3" />}
              {btn.label}
            </button>
          ))}
        </div>

        {/* PIN overlay */}
        <AnimatePresence>
          {showPin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 rounded-2xl"
              style={{
                background: "oklch(0.11 0.012 255 / 0.97)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="text-center">
                <Lock className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Enter Code</p>
              </div>

              <motion.div
                animate={pinShake ? { x: [-8, 8, -8, 8, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="flex gap-3"
                data-ocid="calculator.pin_input"
              >
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-xl font-mono transition-all ${
                      pin.length > i
                        ? "border-accent bg-accent/10 text-foreground"
                        : "border-border/60 bg-transparent text-transparent"
                    }`}
                  >
                    {pin.length > i ? "\u25cf" : "\u25cb"}
                  </div>
                ))}
              </motion.div>

              {/* Hidden input for keyboard */}
              <input
                ref={pinInputRef}
                type="tel"
                inputMode="numeric"
                onChange={handlePinInput}
                className="absolute opacity-0 w-0 h-0"
                maxLength={1}
              />

              {/* On-screen numpad */}
              <div className="grid grid-cols-3 gap-2">
                {PIN_KEYS.map((pk) => (
                  <button
                    key={pk.id}
                    type="button"
                    onClick={() => {
                      if (!pk.label) return;
                      if (pk.label === "\u232b") {
                        setPin((p) => p.slice(0, -1));
                      } else {
                        handlePinKey(pk.label);
                      }
                    }}
                    disabled={!pk.label}
                    className={`w-14 h-10 rounded-lg text-base font-mono transition-all active:scale-95 ${
                      pk.label
                        ? "bg-[oklch(0.2_0.012_255)] hover:bg-[oklch(0.28_0.015_255)] text-foreground"
                        : "opacity-0 pointer-events-none"
                    }`}
                  >
                    {pk.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowPin(false);
                  setPin("");
                }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}


import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const LOGO = "https://cdn.poehali.dev/projects/3056daaf-9ac7-4923-8d17-8291d5ab8cd2/bucket/01d0c1d5-6c45-4cb0-95fb-1b90edd87102.png";

const queryClient = new QueryClient();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 600);
    const t2 = setTimeout(() => setPhase("out"), 2000);
    const t3 = setTimeout(() => onDone(), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#111111",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        transition: "opacity 0.5s ease",
        opacity: phase === "out" ? 0 : 1,
      }}
    >
      {/* жёлтый круг-вспышка */}
      <div style={{
        position: "absolute",
        width: 300, height: 300,
        borderRadius: "50%",
        background: "#FFD600",
        filter: "blur(80px)",
        opacity: phase === "in" ? 0 : phase === "hold" ? 0.18 : 0,
        transition: "opacity 0.6s ease",
        pointerEvents: "none",
      }} />

      {/* логотип + кольца вокруг него */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* расходящиеся кольца — точно по размеру логотипа */}
        {phase === "hold" && [0, 1, 2].map((i) => (
          <div key={i} style={{
            position: "absolute",
            width: 160, height: 160,
            borderRadius: 36,
            border: "2px solid #FFD600",
            opacity: 0,
            animation: `ripple 2s ease-out ${i * 0.55}s infinite`,
            pointerEvents: "none",
          }} />
        ))}

        <div style={{
          transform: phase === "in" ? "scale(0.7)" : phase === "hold" ? "scale(1)" : "scale(1.05)",
          opacity: phase === "in" ? 0 : 1,
          transition: "transform 0.55s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease",
          animation: phase === "hold" ? "logoPulse 2s ease-in-out infinite" : "none",
        }}>
          <img src={LOGO} alt="МастерОФФ" style={{ height: 160, width: "auto", borderRadius: 32, display: "block" }} />
        </div>
      </div>

      <style>{`
        @keyframes ripple {
          0%   { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes logoPulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0px #FFD600); }
          50%       { transform: scale(1.04); filter: drop-shadow(0 0 18px #FFD600bb); }
        }
      `}</style>

      {/* подпись */}
      <div style={{
        marginTop: 20,
        opacity: phase === "hold" ? 1 : 0,
        transform: phase === "hold" ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s",
        textAlign: "center",
      }}>
        <p style={{ color: "#FFD600", fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Montserrat, sans-serif" }}>
          Усть-Кут
        </p>
        <p style={{ color: "#444", fontSize: 10, marginTop: 4, fontFamily: "Golos Text, sans-serif" }}>
          Первый сервис бытовых услуг
        </p>
      </div>

      {/* прогресс-бар */}
      <div style={{
        position: "absolute", bottom: 60, left: "50%", transform: "translateX(-50%)",
        width: 120, height: 2, background: "#222", borderRadius: 2, overflow: "hidden",
      }}>
        <div style={{
          height: "100%", background: "#FFD600", borderRadius: 2,
          width: phase === "in" ? "0%" : phase === "hold" ? "70%" : "100%",
          transition: phase === "in" ? "width 0.6s ease" : phase === "hold" ? "width 1.2s ease" : "width 0.4s ease",
        }} />
      </div>
    </div>
  );
}

const App = () => {
  const [ready, setReady] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!ready && <SplashScreen onDone={() => setReady(true)} />}
        <div style={{ opacity: ready ? 1 : 0, transition: "opacity 0.4s ease" }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
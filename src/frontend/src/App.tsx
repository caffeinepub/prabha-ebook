import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import {
  Award,
  BookOpen,
  Brain,
  CheckCircle,
  ChevronRight,
  Code2,
  LineChart,
  Menu,
  MessageSquare,
  Rocket,
  Sparkles,
  Star,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Book3D from "./components/Book3D";
import ThreeBackground from "./components/ThreeBackground";
import { useSubmitInquiry } from "./hooks/useQueries";

// ── Helpers ──────────────────────────────────────────────────────────────────

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function NeonButton({
  children,
  onClick,
  className = "",
  size = "md",
  variant = "primary",
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "outline";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const sizes = {
    sm: "px-5 py-2 text-sm",
    md: "px-7 py-3 text-base",
    lg: "px-10 py-4 text-lg",
  };
  const cls = variant === "outline" ? "btn-neon-outline" : "btn-neon";
  return (
    <button
      // biome-ignore lint/a11y/useButtonType: controlled by prop
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${cls} font-bold tracking-wide ${sizes[size]} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

// ── Purchase Modal ───────────────────────────────────────────────────────────

// ── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "Home", href: "#hero" },
    { label: "Features", href: "#features" },
    { label: "Inside", href: "#inside" },
    { label: "Reviews", href: "#testimonials" },
    { label: "About", href: "#about" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header
      data-ocid="nav.panel"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl border-b" : "bg-transparent"
      }`}
      style={
        scrolled
          ? {
              background: "oklch(0.09 0.025 265 / 0.95)",
              borderColor: "oklch(0.65 0.28 290 / 0.15)",
            }
          : {}
      }
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-display text-xl font-bold tracking-tight">
          <span className="text-white">PRABHA</span>
          <span className="text-purple ml-1" style={{ color: "var(--purple)" }}>
            EBOOK
          </span>
        </span>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-ocid="nav.link"
              className="text-sm text-muted-foreground hover:text-white transition-colors font-medium"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="md:hidden p-2 text-muted-foreground hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-b"
            style={{
              background: "oklch(0.11 0.03 265)",
              borderColor: "oklch(0.65 0.28 290 / 0.2)",
            }}
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  data-ocid="nav.link"
                  className="text-muted-foreground hover:text-white transition-colors font-medium"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection({ onBuy }: { onBuy: () => void }) {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center pt-20 pb-16 px-6 relative overflow-hidden"
    >
      {/* BG glow orbs */}
      <div
        className="absolute top-1/4 right-1/3 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.28 290 / 0.12) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.7 0.25 340 / 0.1) 0%, transparent 65%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute top-1/2 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.22 200 / 0.08) 0%, transparent 65%)",
          filter: "blur(70px)",
        }}
      />

      <div className="max-w-[1200px] mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{
              background: "oklch(0.65 0.28 290 / 0.1)",
              border: "1px solid oklch(0.65 0.28 290 / 0.3)",
            }}
          >
            <Sparkles
              className="w-3.5 h-3.5"
              style={{ color: "var(--purple)" }}
            />
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "var(--purple)" }}
            >
              New Release 2026
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl font-bold leading-[1.05] mb-5 tracking-tight">
            <span className="text-white">Master the Art</span>
            <br />
            <span className="text-white">of </span>
            <span
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.65 0.28 290), oklch(0.7 0.28 310), oklch(0.75 0.25 340))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Prompt
            </span>
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.7 0.28 310), oklch(0.75 0.25 340))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Engineering
            </span>
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
            The complete guide to crafting powerful AI prompts. Go from beginner
            to expert — unlock the full potential of ChatGPT, Claude, and
            Gemini.
          </p>

          {/* Stats pills */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              {
                label: "150+ Pages",
                icon: <BookOpen className="w-3.5 h-3.5" />,
              },
              {
                label: "50+ Templates",
                icon: <Sparkles className="w-3.5 h-3.5" />,
              },
              {
                label: "2.4k Students",
                icon: <Users className="w-3.5 h-3.5" />,
              },
              { label: "4.9★ Rating", icon: <Star className="w-3.5 h-3.5" /> },
            ].map((s) => (
              <div
                key={s.label}
                className="stat-pill flex items-center gap-2 text-sm font-medium"
                style={{ color: "oklch(0.78 0.15 290)" }}
              >
                <span style={{ color: "var(--purple)" }}>{s.icon}</span>
                {s.label}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <NeonButton
              onClick={onBuy}
              size="lg"
              data-ocid="hero.primary_button"
            >
              Get Instant Access — ₹149
            </NeonButton>
            <NeonButton
              onClick={() => {
                document
                  .getElementById("inside")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              size="lg"
              variant="outline"
              data-ocid="hero.secondary_button"
            >
              Preview Inside
            </NeonButton>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span style={{ color: "oklch(0.65 0.15 140)" }}>✓</span> 7-day
            money-back guarantee
            <span className="mx-2 opacity-30">|</span>
            <span style={{ color: "oklch(0.65 0.15 140)" }}>✓</span> Instant PDF
            delivery
            <span className="mx-2 opacity-30">|</span>
            <span style={{ color: "oklch(0.65 0.15 140)" }}>✓</span> Lifetime
            access
          </div>
        </motion.div>

        {/* Right — 3D Book */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="relative flex flex-col items-center">
            {/* Outer glow */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at center, oklch(0.65 0.28 290 / 0.25) 0%, transparent 65%)",
                filter: "blur(50px)",
                transform: "scale(1.4)",
              }}
            />
            {/* Real book photo */}
            <img
              src="/assets/img_20260401_195946_382-019d49a7-f8ae-7526-8c26-7323bd656417.jpg"
              alt="Prabha Ebook Cover"
              className="rounded-xl shadow-2xl mb-4"
              style={{
                width: "220px",
                height: "auto",
                border: "2px solid oklch(0.65 0.28 290 / 0.6)",
                boxShadow: "0 0 40px oklch(0.65 0.28 290 / 0.5)",
              }}
            />
            <Book3D />
            <div
              className="mt-4 px-6 py-3 rounded-xl text-center"
              style={{
                background: "oklch(0.12 0.03 265 / 0.85)",
                border: "1.5px solid oklch(0.65 0.28 290 / 0.5)",
                backdropFilter: "blur(12px)",
              }}
            >
              <p className="font-display font-bold text-white text-base">
                Prompt Engineering Mastery
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                by Prabhav · PDF · 150+ Pages
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  {["s1", "s2", "s3", "s4", "s5"].map((k) => (
                    <Star
                      key={k}
                      className="w-3 h-3 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">
                    4.9
                  </span>
                </div>
                <span className="text-muted-foreground text-xs">·</span>
                <span
                  className="text-xs font-bold"
                  style={{ color: "oklch(0.85 0.25 290)" }}
                >
                  🏆 Best Seller · ₹149
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Marquee / Partners Strip ──────────────────────────────────────────────────

function MarqueeStrip() {
  const tools = [
    "ChatGPT",
    "Claude",
    "Gemini",
    "Copilot",
    "OpenAI",
    "Anthropic",
    "Midjourney",
    "Perplexity",
    "Sora 2026",
    "GPT-5",
    "Gemini Ultra 2",
    "Claude 4",
    "Grok 3",
    "Llama 5",
    "Runway Gen-4",
    "Kling 2026",
  ];
  return (
    <div
      className="py-5 overflow-hidden"
      style={{
        borderTop: "1px solid oklch(0.65 0.28 290 / 0.1)",
        borderBottom: "1px solid oklch(0.65 0.28 290 / 0.1)",
        background: "oklch(0.10 0.025 265)",
      }}
    >
      <div className="flex" style={{ width: "max-content" }}>
        <div className="animate-marquee flex items-center gap-10">
          {tools.slice(0, 8).map((t) => (
            <span
              key={`a-${t}`}
              className="text-sm font-semibold whitespace-nowrap px-2"
              style={{ color: "oklch(0.55 0.08 265)" }}
            >
              {t}
              <span className="ml-10 opacity-20">✦</span>
            </span>
          ))}
          {tools.slice(0, 8).map((t) => (
            <span
              key={`b-${t}`}
              className="text-sm font-semibold whitespace-nowrap px-2"
              style={{ color: "oklch(0.55 0.08 265)" }}
            >
              {t}
              <span className="ml-10 opacity-20">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Features Section ──────────────────────────────────────────────────────────

function FeaturesSection() {
  const ref = useScrollReveal();
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-First Thinking",
      desc: "Learn to think in prompts. Understand how LLMs process language and craft inputs that get precise, high-quality outputs every time.",
      color: "oklch(0.65 0.28 290)",
      bg: "oklch(0.65 0.28 290 / 0.15)",
      border: "1px solid oklch(0.65 0.28 290 / 0.3)",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Real-World Use Cases",
      desc: "Practical templates for coding, writing, marketing, data analysis, and business automation — ready to use immediately.",
      color: "oklch(0.7 0.25 340)",
      bg: "oklch(0.7 0.25 340 / 0.15)",
      border: "1px solid oklch(0.7 0.25 340 / 0.3)",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Advanced Techniques",
      desc: "Chain-of-thought, few-shot prompting, role-based instructions, and system prompts mastered in a structured, beginner-friendly way.",
      color: "oklch(0.72 0.22 200)",
      bg: "oklch(0.72 0.22 200 / 0.15)",
      border: "1px solid oklch(0.72 0.22 200 / 0.3)",
    },
  ];

  return (
    <section id="features" className="py-20 px-6">
      <div ref={ref} className="fade-in-up max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <p
            className="text-xs font-bold tracking-[0.2em] uppercase mb-3"
            style={{ color: "var(--purple)" }}
          >
            What&apos;s Inside This Week
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-white font-bold">
            Why{" "}
            <span
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.65 0.28 290), oklch(0.7 0.28 310))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Choose
            </span>{" "}
            This Guide?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              data-ocid={`features.item.${i + 1}`}
              className="card-neon p-8 group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-5"
                style={{
                  background: f.bg,
                  border: f.border,
                  color: f.color,
                }}
              >
                {f.icon}
              </div>
              <h3 className="font-display text-xl text-white font-bold mb-3">
                {f.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── What's Inside Section ─────────────────────────────────────────────────────

function InsideSection() {
  const ref = useScrollReveal();
  const chapters = [
    {
      num: "01",
      title: "Foundations of Prompting",
      items: [
        "What is prompt engineering?",
        "How LLMs understand context",
        "The anatomy of a perfect prompt",
        "Common beginner mistakes",
        "Setting up your AI workspace",
      ],
    },
    {
      num: "02",
      title: "Advanced Techniques",
      items: [
        "Chain-of-thought prompting",
        "Few-shot & zero-shot examples",
        "Role-based system prompts",
        "Iterative prompt refinement",
        "Temperature & parameter tuning",
      ],
    },
    {
      num: "03",
      title: "Real-World Mastery",
      items: [
        "50+ ready-to-use templates",
        "Prompts for coding & debugging",
        "Content & marketing automation",
        "Data analysis workflows",
        "Building custom AI assistants",
      ],
    },
  ];

  return (
    <section
      id="inside"
      className="py-20 px-6"
      style={{ background: "oklch(0.10 0.025 265)" }}
    >
      <div ref={ref} className="fade-in-up max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <p
            className="text-xs font-bold tracking-[0.2em] uppercase mb-3"
            style={{ color: "var(--purple)" }}
          >
            Table of Contents
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-white font-bold">
            What&apos;s{" "}
            <span
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.65 0.28 290), oklch(0.7 0.28 310))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Inside?
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {chapters.map((ch, i) => (
            <motion.div
              key={ch.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              data-ocid={`inside.item.${i + 1}`}
              className="relative card-neon p-7 overflow-hidden"
            >
              <div
                className="absolute top-4 right-4 font-display text-6xl font-bold leading-none pointer-events-none select-none"
                style={{ color: "oklch(0.65 0.28 290 / 0.07)" }}
              >
                {ch.num}
              </div>
              <div
                className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-bold font-display mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.55 0.3 290), oklch(0.7 0.28 310))",
                  color: "white",
                  boxShadow: "0 0 15px oklch(0.65 0.28 290 / 0.4)",
                }}
              >
                {ch.num}
              </div>
              <h3 className="font-display text-xl text-white font-bold mb-4">
                {ch.title}
              </h3>
              <ul className="space-y-2">
                {ch.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: "var(--purple)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────

function TestimonialsSection() {
  const ref = useScrollReveal();
  const testimonials = [
    {
      name: "Arjun Mehta",
      role: "Software Engineer, Bangalore",
      avatar: "AM",
      quote:
        "This ebook completely changed how I use AI in my daily workflow. The chain-of-thought chapter alone saved me hours every week. Worth 10x the price!",
    },
    {
      name: "Priya Krishnan",
      role: "Content Creator, Chennai",
      avatar: "PK",
      quote:
        "I went from copy-pasting random prompts to having a full system. My content quality improved dramatically. Prabhav explains everything so clearly.",
    },
    {
      name: "Rohit Gupta",
      role: "Entrepreneur, Mumbai",
      avatar: "RG",
      quote:
        "The 50+ templates are gold. I use them daily for business emails, marketing copy, and data analysis. Best ₹149 I&apos;ve ever spent on learning.",
    },
  ];

  return (
    <section id="testimonials" className="py-20 px-6">
      <div ref={ref} className="fade-in-up max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <p
            className="text-xs font-bold tracking-[0.2em] uppercase mb-3"
            style={{ color: "var(--purple)" }}
          >
            Reviews
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-white font-bold">
            What{" "}
            <span
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.65 0.28 290), oklch(0.7 0.28 310))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Students
            </span>{" "}
            Say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              data-ocid={`testimonials.item.${i + 1}`}
              className="card-neon p-7"
              style={{
                borderTop: "2px solid oklch(0.65 0.28 290 / 0.5)",
              }}
            >
              <div className="flex items-center gap-1 mb-4">
                {["s1", "s2", "s3", "s4", "s5"].map((k) => (
                  <Star
                    key={k}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.55 0.3 290), oklch(0.7 0.28 310))",
                    boxShadow: "0 0 12px oklch(0.65 0.28 290 / 0.4)",
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-muted-foreground text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Topics Grid ───────────────────────────────────────────────────────────────

function TopicsSection() {
  const ref = useScrollReveal();
  const topics = [
    {
      label: "AI Writing",
      count: "25+ prompts",
      icon: <MessageSquare className="w-6 h-6" />,
      from: "oklch(0.55 0.3 290)",
      to: "oklch(0.65 0.28 310)",
    },
    {
      label: "Coding Prompts",
      count: "30+ prompts",
      icon: <Code2 className="w-6 h-6" />,
      from: "oklch(0.6 0.25 200)",
      to: "oklch(0.65 0.22 220)",
    },
    {
      label: "Marketing",
      count: "20+ prompts",
      icon: <Rocket className="w-6 h-6" />,
      from: "oklch(0.6 0.3 340)",
      to: "oklch(0.65 0.28 310)",
    },
    {
      label: "Data Analysis",
      count: "15+ prompts",
      icon: <LineChart className="w-6 h-6" />,
      from: "oklch(0.55 0.25 150)",
      to: "oklch(0.6 0.22 170)",
    },
    {
      label: "Productivity",
      count: "18+ prompts",
      icon: <Zap className="w-6 h-6" />,
      from: "oklch(0.65 0.28 80)",
      to: "oklch(0.65 0.25 60)",
    },
    {
      label: "Business",
      count: "22+ prompts",
      icon: <Award className="w-6 h-6" />,
      from: "oklch(0.6 0.28 310)",
      to: "oklch(0.65 0.28 290)",
    },
  ];

  return (
    <section
      id="topics"
      className="py-20 px-6"
      style={{ background: "oklch(0.10 0.025 265)" }}
    >
      <div ref={ref} className="fade-in-up max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <p
            className="text-xs font-bold tracking-[0.2em] uppercase mb-3"
            style={{ color: "var(--purple)" }}
          >
            Explore
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-white font-bold">
            Topics{" "}
            <span
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.65 0.28 290), oklch(0.7 0.28 310))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Covered
            </span>
          </h2>
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-5"
          style={{ perspective: "1000px" }}
        >
          {topics.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ rotateY: 8, z: 20, scale: 1.04 }}
              data-ocid={`topics.item.${i + 1}`}
              className="relative rounded-2xl p-6 overflow-hidden group cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${t.from} 0%, ${t.to} 100%)`,
                opacity: 0.9,
                transformStyle: "preserve-3d",
                transition: "transform 0.3s ease",
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "rgba(0,0,0,0.15)" }}
              />
              <div className="relative">
                <div className="text-white mb-3 opacity-90">{t.icon}</div>
                <h3 className="font-display font-bold text-white text-lg mb-1">
                  {t.label}
                </h3>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                >
                  {t.count}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── About + Offer Section ─────────────────────────────────────────────────────

function AboutSection({ onBuy }: { onBuy: () => void }) {
  const ref = useScrollReveal();
  return (
    <section id="about" className="py-20 px-6">
      <div ref={ref} className="fade-in-up max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* About author */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
              style={{ color: "var(--purple)" }}
            >
              The Author
            </p>
            <h2 className="font-display text-4xl text-white font-bold mb-5">
              Meet{" "}
              <span
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.65 0.28 290), oklch(0.7 0.28 310))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Prabhav
              </span>
            </h2>

            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold font-display text-white shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.55 0.3 290), oklch(0.7 0.28 310))",
                  boxShadow: "0 0 25px oklch(0.65 0.28 290 / 0.4)",
                }}
              >
                P
              </div>
              <div>
                <p className="text-white font-semibold">Prabhav</p>
                <p className="text-sm" style={{ color: "var(--purple)" }}>
                  AI & Prompt Engineering Expert
                </p>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-4">
              Prabhav is an AI enthusiast and prompt engineering expert with 3+
              years of experience helping professionals master AI tools. He has
              trained over 2,400 students across India in leveraging AI for
              productivity, content creation, and software development.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              His hands-on, practical approach — built on real-world
              experimentation — makes this guide the most actionable resource on
              prompt engineering available today.
            </p>

            <div className="flex gap-6 mt-6">
              {[
                { label: "Students", val: "2,400+" },
                { label: "Years Exp.", val: "3+" },
                { label: "Templates", val: "50+" },
              ].map((s) => (
                <div key={s.label}>
                  <p
                    className="font-display text-2xl font-bold"
                    style={{ color: "var(--purple)" }}
                  >
                    {s.val}
                  </p>
                  <p className="text-muted-foreground text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Offer card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            data-ocid="offer.card"
            className="relative rounded-2xl p-8 overflow-hidden"
            style={{
              background: "oklch(0.12 0.03 265)",
              border: "1.5px solid oklch(0.65 0.28 290 / 0.35)",
              boxShadow:
                "0 0 50px oklch(0.65 0.28 290 / 0.15), 0 20px 50px rgba(0,0,0,0.5)",
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.55 0.3 290), oklch(0.7 0.28 310), oklch(0.7 0.25 340))",
              }}
            />

            <div className="text-center">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                style={{
                  background: "oklch(0.65 0.28 290 / 0.1)",
                  border: "1px solid oklch(0.65 0.28 290 / 0.3)",
                }}
              >
                <Award className="w-4 h-4" style={{ color: "var(--purple)" }} />
                <span
                  className="text-xs font-bold tracking-wider uppercase"
                  style={{ color: "var(--purple)" }}
                >
                  Limited Time Offer
                </span>
              </div>

              <h3 className="font-display text-3xl text-white font-bold mb-2">
                Grab The Guide
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Complete Prompt Engineering Ebook by Prabhav
              </p>

              <div className="flex items-center justify-center gap-3 mb-2">
                <span
                  className="font-display text-6xl font-bold"
                  style={{
                    background:
                      "linear-gradient(90deg, oklch(0.65 0.28 290), oklch(0.7 0.28 310))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 20px oklch(0.65 0.28 290 / 0.5))",
                  }}
                >
                  ₹149
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-8">
                <span className="line-through">₹599</span>{" "}
                <span
                  className="font-semibold"
                  style={{ color: "oklch(0.65 0.22 140)" }}
                >
                  Save ₹450
                </span>
              </p>

              <ul className="space-y-3 text-left mb-8">
                {[
                  "150+ pages of expert content",
                  "50+ copy-paste-ready templates",
                  "Lifetime PDF access",
                  "Free future updates included",
                  "WhatsApp support community",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle
                      className="w-4 h-4 shrink-0"
                      style={{ color: "var(--purple)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <NeonButton
                onClick={onBuy}
                size="lg"
                className="w-full justify-center"
                data-ocid="offer.primary_button"
              >
                Grab the Guide — ₹149
              </NeonButton>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── CTA Banner ────────────────────────────────────────────────────────────────

function CTABanner({ onBuy }: { onBuy: () => void }) {
  return (
    <section className="py-16 px-6">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl p-12 text-center overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.18 0.08 290) 0%, oklch(0.20 0.07 310) 50%, oklch(0.18 0.06 290) 100%)",
            border: "1px solid oklch(0.65 0.28 290 / 0.3)",
            boxShadow: "0 0 60px oklch(0.65 0.28 290 / 0.15)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, oklch(0.65 0.28 290 / 0.15) 0%, transparent 70%)",
            }}
          />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl text-white font-bold mb-4">
              Join 2,400+ Students Learning
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.72 0.25 290), oklch(0.78 0.22 310), oklch(0.78 0.22 340))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Prompt Engineering
              </span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Get instant access to 150+ pages of actionable content, templates,
              and techniques for just ₹149.
            </p>
            <NeonButton
              onClick={onBuy}
              size="lg"
              data-ocid="cta.primary_button"
            >
              Start Learning Today — ₹149
            </NeonButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────

function FAQSection() {
  const ref = useScrollReveal();
  const faqs = [
    {
      q: "Is this suitable for complete beginners?",
      a: "Absolutely! The ebook starts from the very basics of what prompt engineering is, requiring no prior AI experience. It progressively builds to advanced techniques.",
    },
    {
      q: "Which AI tools does this cover?",
      a: "The guide covers ChatGPT (GPT-4/4o), Claude, Gemini, and Copilot. The techniques are universal and work with any large language model.",
    },
    {
      q: "How will I receive the ebook?",
      a: "After confirming your order, you'll receive a WhatsApp or email with the PDF download link within 24 hours. It's also accessible instantly on any device.",
    },
    {
      q: "Is there a refund policy?",
      a: "Yes! If you're not satisfied within 7 days of purchase, we'll issue a full refund — no questions asked.",
    },
    {
      q: "Do I need any special software?",
      a: "No. You only need a PDF reader (free on all devices) and access to any AI tool like ChatGPT (free tier works perfectly).",
    },
  ];

  return (
    <section id="faq" className="py-20 px-6">
      <div ref={ref} className="fade-in-up max-w-[700px] mx-auto">
        <div className="text-center mb-12">
          <p
            className="text-xs font-bold tracking-[0.2em] uppercase mb-3"
            style={{ color: "var(--purple)" }}
          >
            Got Questions?
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-white font-bold">
            Frequently Asked{" "}
            <span
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.65 0.28 290), oklch(0.7 0.28 310))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Questions
            </span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={faq.q}
              value={`faq-${i}`}
              data-ocid={`faq.item.${i + 1}`}
              className="border-0 overflow-hidden rounded-xl px-6"
              style={{
                background: "oklch(0.12 0.03 265)",
                border: "1px solid oklch(0.65 0.28 290 / 0.15)",
              }}
            >
              <AccordionTrigger className="font-display font-semibold text-white hover:no-underline text-left hover:text-purple">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer({ onBuy }: { onBuy: () => void }) {
  const year = new Date().getFullYear();
  return (
    <footer
      data-ocid="footer.panel"
      style={{
        background: "oklch(0.09 0.02 265)",
        borderTop: "1px solid oklch(0.65 0.28 290 / 0.15)",
      }}
      className="pt-16 pb-6 px-6"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div className="md:col-span-1">
            <p className="font-display text-xl font-bold mb-3">
              <span className="text-white">PRABHA</span>
              <span className="ml-1" style={{ color: "var(--purple)" }}>
                EBOOK
              </span>
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your complete guide to mastering prompt engineering and unlocking
              the full power of AI.
            </p>
          </div>

          {/* Explore */}
          <div>
            <p className="text-white font-semibold text-sm mb-3 font-display">
              Explore
            </p>
            {["#features", "#inside", "#topics", "#about"].map((href) => (
              <a
                key={href}
                href={href}
                data-ocid="footer.link"
                className="block text-muted-foreground hover:text-white text-sm mb-2 transition-colors capitalize"
              >
                {href.replace("#", "")}
              </a>
            ))}
          </div>

          {/* My Account */}
          <div>
            <p className="text-white font-semibold text-sm mb-3 font-display">
              My Account
            </p>
            {["#testimonials", "#faq"].map((href) => (
              <a
                key={href}
                href={href}
                data-ocid="footer.link"
                className="block text-muted-foreground hover:text-white text-sm mb-2 transition-colors capitalize"
              >
                {href.replace("#", "")}
              </a>
            ))}
          </div>

          {/* Get Copy */}
          <div>
            <p className="text-white font-semibold text-sm mb-3 font-display">
              Resources
            </p>
            <NeonButton
              onClick={onBuy}
              size="sm"
              data-ocid="footer.primary_button"
            >
              BUY NOW — ₹149
            </NeonButton>
            <p className="text-muted-foreground text-xs mt-3">
              30-day money-back guarantee
            </p>
          </div>
        </div>

        <div
          className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground"
          style={{ borderColor: "oklch(0.65 0.28 290 / 0.1)" }}
        >
          <p>© {year} Prabha Ebook. All rights reserved.</p>
          <div className="flex gap-5">
            {[
              { label: "Terms", href: "#hero" },
              { label: "Privacy", href: "#hero" },
              { label: "Contact", href: "#about" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                data-ocid="footer.link"
                className="hover:text-white transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
          <p>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="hover:underline"
              style={{ color: "var(--purple)" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Sticky Promo Bar ──────────────────────────────────────────────────────────

function StickyPromoBar({ onBuy }: { onBuy: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          data-ocid="promo.panel"
          className="fixed bottom-0 left-0 right-0 z-40 px-6 py-3"
          style={{
            background: "oklch(0.11 0.03 265 / 0.95)",
            borderTop: "1px solid oklch(0.65 0.28 290 / 0.3)",
            backdropFilter: "blur(16px)",
            boxShadow:
              "0 -4px 30px rgba(0,0,0,0.5), 0 -1px 0 oklch(0.65 0.28 290 / 0.2)",
          }}
        >
          <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BookOpen
                className="w-5 h-5 shrink-0"
                style={{ color: "var(--purple)" }}
              />
              <p className="text-sm text-foreground">
                <span className="font-semibold">Prabha Ebook</span>
                <span className="text-muted-foreground">
                  {" "}
                  — Prompt Engineering Guide{" "}
                </span>
                <span className="font-bold" style={{ color: "var(--purple)" }}>
                  ₹149 only
                </span>
                <span className="text-muted-foreground"> (was ₹599)</span>
              </p>
            </div>
            <NeonButton
              onClick={onBuy}
              size="sm"
              data-ocid="promo.primary_button"
            >
              BUY NOW <ChevronRight className="inline w-4 h-4" />
            </NeonButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div
      className="min-h-screen font-sans"
      style={{ position: "relative", zIndex: 0 }}
    >
      <ThreeBackground />
      <Toaster richColors position="top-center" />
      <Navbar />

      <main>
        <HeroSection
          onBuy={() =>
            window.open(
              "https://t.me/Whyprabhav?text=Hi%2C%20I%20want%20to%20buy%20your%20ebook%20%22Prabha%20Ebook%22%20for%20%E2%82%B9149.%20I%20came%20from%20your%20website%20to%20purchase%20it.",
              "_blank",
            )
          }
        />
        <MarqueeStrip />
        <FeaturesSection />
        <InsideSection />
        <TestimonialsSection />
        <TopicsSection />
        <AboutSection
          onBuy={() =>
            window.open(
              "https://t.me/Whyprabhav?text=Hi%2C%20I%20want%20to%20buy%20your%20ebook%20%22Prabha%20Ebook%22%20for%20%E2%82%B9149.%20I%20came%20from%20your%20website%20to%20purchase%20it.",
              "_blank",
            )
          }
        />
        <CTABanner
          onBuy={() =>
            window.open(
              "https://t.me/Whyprabhav?text=Hi%2C%20I%20want%20to%20buy%20your%20ebook%20%22Prabha%20Ebook%22%20for%20%E2%82%B9149.%20I%20came%20from%20your%20website%20to%20purchase%20it.",
              "_blank",
            )
          }
        />
        <FAQSection />
      </main>

      <Footer
        onBuy={() =>
          window.open(
            "https://t.me/Whyprabhav?text=Hi%2C%20I%20want%20to%20buy%20your%20ebook%20%22Prabha%20Ebook%22%20for%20%E2%82%B9149.%20I%20came%20from%20your%20website%20to%20purchase%20it.",
            "_blank",
          )
        }
      />
      <StickyPromoBar
        onBuy={() =>
          window.open(
            "https://t.me/Whyprabhav?text=Hi%2C%20I%20want%20to%20buy%20your%20ebook%20%22Prabha%20Ebook%22%20for%20%E2%82%B9149.%20I%20came%20from%20your%20website%20to%20purchase%20it.",
            "_blank",
          )
        }
      />
    </div>
  );
}

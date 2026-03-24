import React from "react";
import { useAuthState } from "../../hooks/use-auth";
import type { UserRole } from "../../types/api";

/* ------------------------------------------------------------------ */
/*  Role-specific content definitions                                  */
/* ------------------------------------------------------------------ */

type StepItem = {
  icon: string;
  label: string;
  title: string;
  desc: string;
  accent: string;
  accentBg: string;
};

type HeroContent = {
  eyebrow: string;
  headline: React.ReactNode;
  copy: string;
  primaryCta: { label: string; icon: string };
  secondaryCta: { label: string };
  steps: StepItem[];
  trustItems?: { icon: string; text: string }[];
  insight?: { text: string; action?: string };
  showChart?: boolean;
};

const content: Record<UserRole, HeroContent> = {
  STUDENT: {
    eyebrow: "EduPayTrack • Track Your Payments",
    headline: (
      <>
        Upload receipts and <br className="hidden md:block" />
        stay updated.
      </>
    ),
    copy: "Submit payments and monitor your status from one dashboard. Our AI-driven engine verifies documents in real-time for instant feedback.",
    primaryCta: { label: "Upload New Receipt", icon: "upload_file" },
    secondaryCta: { label: "View History" },
    steps: [
      {
        icon: "add_to_photos",
        label: "01 Submit",
        title: "Upload receipts in seconds",
        desc: "Snap a photo or drop a PDF. Our OCR extracts data instantly for your ledger.",
        accent: "text-primary",
        accentBg: "bg-primary/10",
      },
      {
        icon: "verified",
        label: "02 Review",
        title: "Verify details before sending",
        desc: "Check amount, date, and institution details match your statement flawlessly.",
        accent: "text-secondary",
        accentBg: "bg-secondary/10",
      },
      {
        icon: "monitoring",
        label: "03 Track",
        title: "Check payment status anytime",
        desc: "Get real-time alerts when your payment is approved by the registrar office.",
        accent: "text-tertiary",
        accentBg: "bg-tertiary-fixed/30",
      },
    ],
    trustItems: [
      { icon: "security", text: "Bank-grade Encryption" },
      { icon: "auto_awesome", text: "AI Receipt Matching" },
      { icon: "schedule", text: "24/7 Monitoring" },
    ],
  },

  ADMIN: {
    eyebrow: "EduPayTrack • Manage Payments",
    headline: (
      <>
        Review and verify{" "}
        <span className="text-primary">submissions.</span>
      </>
    ),
    copy: "Approve or reject payments with full visibility in one place. Ensure institutional integrity with our real-time editorial ledger.",
    primaryCta: { label: "Go to Ledger", icon: "arrow_forward" },
    secondaryCta: { label: "View Documentation" },
    steps: [
      {
        icon: "dashboard",
        label: "01",
        title: "Queue",
        desc: "View all submitted payments. Monitor the incoming stream of transaction requests in a unified digital ledger.",
        accent: "text-primary",
        accentBg: "bg-surface-container-high",
      },
      {
        icon: "receipt_long",
        label: "02",
        title: "Review",
        desc: "Check receipts and details. Our OCR-powered verification highlights inconsistencies instantly for high-confidence review.",
        accent: "text-primary",
        accentBg: "bg-surface-container-high",
      },
      {
        icon: "verified_user",
        label: "03",
        title: "Decide",
        desc: "Approve or reject with notes. Finalize transactions with a single click and automatically notify the student ledger.",
        accent: "text-primary",
        accentBg: "bg-surface-container-high",
      },
    ],
    insight: {
      text: "12 payments are pending high-confidence verification.",
      action: "Review Now",
    },
  },

  ACCOUNTS: {
    eyebrow: "EduPayTrack • Financial Overview",
    headline: (
      <>
        Monitor collections <br className="hidden md:block" />
        and balances.
      </>
    ),
    copy: "Access reports and track institutional payment records with an authoritative, high-confidence administrative suite.",
    primaryCta: { label: "Generate Ledger Report", icon: "arrow_forward" },
    secondaryCta: { label: "Export Records" },
    showChart: true,
    steps: [
      {
        icon: "summarize",
        label: "01",
        title: "Reports",
        desc: "View collection summaries. Real-time snapshots of ledger balances.",
        accent: "text-primary",
        accentBg: "bg-surface-container-high",
      },
      {
        icon: "history",
        label: "02",
        title: "Audit",
        desc: "Review transaction history. Deep-dive into verified payment logs.",
        accent: "text-primary",
        accentBg: "bg-surface-container-high",
      },
      {
        icon: "download",
        label: "03",
        title: "Export",
        desc: "Download records anytime. Seamless CSV and PDF reconciliation files.",
        accent: "text-primary",
        accentBg: "bg-surface-container-high",
      },
    ],
    trustItems: [
      { icon: "account_balance", text: "ACADEMY" },
      { icon: "school", text: "UNIVERSITY" },
      { icon: "foundation", text: "INSTITUTE" },
      { icon: "assured_workload", text: "COUNCIL" },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function MIcon({ name, fill, className = "" }: { name: string; fill?: boolean; className?: string }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {name}
    </span>
  );
}

function MiniChart() {
  const bars = [20, 35, 25, 50, 40, 65, 80];
  return (
    <div className="w-full">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-1">
            Live Collections
          </h3>
          <p className="text-3xl font-bold tracking-tight text-on-surface">$1,284,500.00</p>
        </div>
        <div className="px-2 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded">
          +12.5%
        </div>
      </div>
      <div className="w-full h-40 flex items-end gap-1.5 overflow-hidden group">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-full rounded-t-sm transition-all duration-700"
            style={{
              height: `${h}%`,
              background: `rgba(0, 78, 153, ${0.1 + i * 0.1})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function HeroPanel() {
  const { authUser } = useAuthState();
  
  if (authUser) {
    return null;
  }

  // When not signed in (login page), default to the STUDENT hero content
  const role: UserRole = "STUDENT";
  const c = content[role];

  return (
    <section className="hero-section relative overflow-hidden py-4 px-4">
      {/* Background blurs */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto flex flex-col items-center">
        {/* Header cluster */}
        <div className="text-center mb-6 space-y-3 max-w-2xl">
          <span className="inline-block py-1 px-3 bg-primary/10 text-primary text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
            {c.eyebrow}
          </span>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter text-on-surface leading-tight">
            {c.headline}
          </h1>

          <p className="text-sm md:text-base text-on-surface-variant font-normal leading-relaxed max-w-xl mx-auto">
            {c.copy}
          </p>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group px-7 py-3.5 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 active:scale-95 flex items-center gap-2">
              <MIcon name={c.primaryCta.icon} className="text-lg" />
              {c.primaryCta.label}
            </button>
            <button className="px-7 py-3.5 bg-white/50 hover:bg-white/80 text-primary border border-outline-variant/30 rounded-xl font-semibold backdrop-blur-md transition-all duration-200">
              {c.secondaryCta.label}
            </button>
          </div>
        </div>

        {/* Bento Layout — chart + steps OR just steps */}
        {c.showChart ? (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart card */}
            <div className="lg:col-span-7 glass-panel rounded-2xl p-8 flex flex-col justify-between items-start text-left shadow-2xl shadow-on-surface/5 border border-white/40">
              <MiniChart />
            </div>

            {/* Steps + CTA */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <div className="glass-panel rounded-2xl p-7 flex flex-col gap-5 text-left shadow-xl shadow-on-surface/5 border border-white/40">
                {c.steps.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary font-bold text-xs shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface tracking-tight">
                        {step.title}: {step.desc.split(". ")[0]}
                      </h4>
                      <p className="text-xs text-on-surface-variant">
                        {step.desc.split(". ").slice(1).join(". ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="editorial-gradient w-full h-16 rounded-2xl flex items-center justify-between px-8 text-white group shadow-xl shadow-primary/20 active:scale-[0.98] transition-all">
                <span className="text-base font-bold tracking-tight">{c.primaryCta.label}</span>
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <MIcon name="arrow_forward" fill />
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Standard 3-column step grid (Student & Admin) */
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            {c.steps.map((step, i) => (
              <div
                key={i}
                className="glass-panel group flex flex-col items-start text-left p-5 rounded-2xl border border-white/40 shadow-sm hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl ${step.accentBg} flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors`}>
                  <MIcon name={step.icon} className={`${step.accent} text-[20px] group-hover:text-white transition-colors`} />
                </div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-primary font-black text-base opacity-40">{step.label}</span>
                  {role !== "STUDENT" && (
                    <h3 className="text-base font-semibold text-on-surface">{step.title}</h3>
                  )}
                </div>
                {role === "STUDENT" && (
                  <h3 className="text-base font-semibold text-on-surface mb-1">{step.title}</h3>
                )}
                <p className="text-on-surface-variant text-sm leading-snug">{step.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Trust bar (Student & Accounts) */}
        {c.trustItems && (
          <div className="mt-10 pt-6 w-full border-t border-outline-variant/10 flex flex-wrap justify-center items-center gap-10 opacity-50">
            {c.trustItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <MIcon name={item.icon} className="text-lg text-primary" />
                <span className="text-sm font-semibold tracking-tight">{item.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* AI insight (Admin) */}
        {c.insight && (
          <div className="mt-10 inline-flex items-center gap-4 px-6 py-3 glass-panel rounded-full border border-white/40 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-sm font-medium text-on-surface-variant italic">
              <span className="font-bold text-on-surface not-italic">AI Suggestion:</span>{" "}
              {c.insight.text}
            </span>
            {c.insight.action && (
              <button className="text-primary text-sm font-bold hover:underline">
                {c.insight.action}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, CheckCircle, Menu, Moon, Sun, Upload, X, CreditCard, TrendingUp, Clock, ShieldCheck } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { BrandMark } from '../../components/BrandMark';


const SLATE_HSL = '215 16% 47%';
const SLATE_DARK = '215 14% 55%';

/* Animated counter hook */
function useCountUp(target: number, duration = 1800, startDelay = 600) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    }, startDelay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, startDelay]);

  return value;
}

export function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDark = theme === 'dark';

  /* Animated values for the dashboard mockup */
  const paidAmount = useCountUp(285000, 2000, 800);
  const totalFees = 450000;
  const progressPct = useCountUp(63, 1800, 800);

  useEffect(() => {
    const root = document.documentElement;
    const hsl = isDark ? SLATE_DARK : SLATE_HSL;
    root.style.setProperty('--primary', hsl);
    root.style.setProperty('--ring', hsl);
    root.style.setProperty('--sidebar-primary', hsl);
    root.style.setProperty('--sidebar-ring', hsl);
  }, [isDark]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/96 px-4 backdrop-blur md:px-6">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BrandMark />
            <span className="text-[14px] font-bold uppercase tracking-[0.08em] text-foreground">EduPayTrack</span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="relative flex h-8 w-8 items-center justify-center text-foreground/70 transition-colors hover:text-foreground"
              title="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>
            <Link to="/login" className="px-3 text-[13px] text-foreground/70 transition-colors hover:text-foreground">
              Log in
            </Link>
            <Link
              to="/register"
              className="border border-foreground/40 px-3 py-2 text-[13px] text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              Sign up
            </Link>
          </div>

          <button
            className="flex h-9 w-9 items-center justify-center md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mx-auto max-w-[1200px] border-t border-border py-3 md:hidden">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="flex h-10 items-center justify-center rounded-md border border-border text-[13px] text-foreground/80"
              >
                {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              </button>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-10 items-center justify-center rounded-md text-[13px] text-foreground/80"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-10 items-center justify-center rounded-md border border-foreground/40 text-[13px] text-foreground"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </nav>

      <section className="relative z-10 overflow-hidden px-4 pb-0 pt-16 md:px-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col gap-12 pb-16 pt-[52px] md:flex-row md:items-start md:gap-10">
            <div className="relative z-[3] max-w-[540px] flex-1">
              <h1 className="max-w-[540px] text-[clamp(2.25rem,7vw,3.2rem)] font-[500] leading-[1.08] tracking-[-0.04em] text-foreground">
                School fees tracking,
                <br />
                simplified.
              </h1>
              <p className="mt-6 max-w-[420px] text-[15px] leading-relaxed text-muted-foreground md:text-base">
                Upload payment proof, track balances, and verify receipts, all in one place. Built for schools in
                Malawi and beyond.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 bg-foreground px-6 py-3 text-[14px] font-medium text-background transition-all duration-200 hover:bg-foreground/90"
                >
                  Get started free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center border border-border px-6 py-3 text-[14px] font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Log in
                </Link>
              </div>
            </div>

            {/* ── Interactive Dashboard Mockup ── */}
            <div className="relative z-[1] flex-1 md:block animate-slide-in-right animate-delay-200">
              <div className="overflow-hidden rounded-lg border border-border bg-card md:ml-12 md:mt-4 shadow-lg transition-shadow duration-300 hover:shadow-xl">
                {/* Window chrome */}
                <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
                  <div className="ml-3 flex items-center gap-1.5 rounded-md bg-muted/60 px-3 py-1">
                    <ShieldCheck className="h-3 w-3 text-success/70" />
                    <span className="text-[10px] text-muted-foreground">edupaytrack.app/dashboard</span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {/* Student Balance Card */}
                  <div className="rounded-lg border border-border bg-gradient-to-br from-primary/5 via-transparent to-success/5 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15">
                          <CreditCard className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Student Balance</p>
                          <p className="text-[11px] font-medium text-foreground/70">Chisomo Banda — Term 2</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5">
                        <TrendingUp className="h-3 w-3 text-success" />
                        <span className="text-[10px] font-medium text-success">On track</span>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-[22px] font-semibold tracking-tight text-foreground tabular-nums">
                        MK {paidAmount.toLocaleString()}
                      </span>
                      <span className="text-[12px] text-muted-foreground">
                        / {totalFees.toLocaleString()}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-success transition-all duration-[2000ms] ease-out"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="mt-1.5 flex justify-between">
                      <span className="text-[10px] text-muted-foreground">{progressPct}% paid</span>
                      <span className="text-[10px] text-muted-foreground">MK {(totalFees - paidAmount).toLocaleString()} remaining</span>
                    </div>
                  </div>

                  {/* Recent Payments */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-1">Recent Payments</p>
                    {[
                      { name: 'Bank Transfer', amount: 'MK 150,000', status: 'Verified', icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', date: 'Apr 15' },
                      { name: 'Mobile Money', amount: 'MK 85,000', status: 'Verified', icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', date: 'Mar 28' },
                      { name: 'Bank Deposit', amount: 'MK 50,000', status: 'Pending', icon: Clock, color: 'text-warning', bg: 'bg-warning/10', date: 'Apr 25' },
                    ].map((tx, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-md border border-border px-3 py-2 transition-colors duration-200 hover:bg-muted/40"
                        style={{ animationDelay: `${800 + i * 150}ms` }}
                      >
                        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${tx.bg}`}>
                          <tx.icon className={`h-3 w-3 ${tx.color}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-medium text-foreground truncate">{tx.name}</p>
                          <p className="text-[10px] text-muted-foreground">{tx.date}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[12px] font-semibold text-foreground tabular-nums">{tx.amount}</p>
                          <p className={`text-[10px] font-medium ${tx.color}`}>{tx.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 w-full border-t border-border" />

      <section className="relative z-10 overflow-hidden px-4 py-20 md:px-6 md:py-24">
        <div className="mx-auto max-w-[1200px]">
          <p className="mb-4 text-[13px] uppercase tracking-[0.15em] text-muted-foreground">How it works</p>
          <h2 className="max-w-[500px] text-[clamp(1.8rem,5vw,2.5rem)] font-[500] leading-[1.15] tracking-[-0.03em] text-foreground">
            Pay externally.
            <br />
            Track digitally.
          </h2>

          <div className="mt-12 border border-border md:mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {[
                {
                  icon: Upload,
                  title: 'Upload proof of payment',
                  desc: "Students upload bank receipts or mobile money confirmations. The system keeps everything organized by term and student.",
                },
                {
                  icon: CheckCircle,
                  title: 'Admin verification',
                  desc: "Accounts staff review each submission, approve or reject with notes, and the student's balance updates automatically.",
                },
                {
                  icon: BarChart3,
                  title: 'Reports and tracking',
                  desc: 'Installment tracking, balance summaries, and financial reports. Full transparency for students, parents, and staff.',
                },
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className={`p-6 md:p-8 ${index < 2 ? 'md:border-r border-border' : ''} ${index > 0 ? 'border-t md:border-t-0 border-border' : ''} animate-slide-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-6 flex h-32 items-center justify-center rounded-lg border border-border bg-card/30 transition-colors duration-300 hover:bg-card/60">
                    <feature.icon className="h-10 w-10 text-muted-foreground/40 animate-float" style={{ animationDelay: `${index * 200}ms` }} />
                  </div>
                  <h3 className="mb-2 text-[15px] font-medium text-foreground">{feature.title}</h3>
                  <p className="text-[13px] leading-[1.6] text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 w-full border-t border-border" />

      <section className="relative z-10 overflow-hidden px-4 py-20 md:px-6 md:py-24">
        <div className="landing-diagonal absolute inset-0 pointer-events-none" />
        <div className="relative mx-auto max-w-[1200px]">
          <div className="mx-auto max-w-[720px] border border-border bg-background p-6 md:p-10">
            <blockquote className="text-[18px] font-[400] leading-[1.5] tracking-[-0.01em] text-foreground/85 md:text-[20px]">
              "We used to spend hours verifying receipts. EduPayTrack cut that to minutes. Students can check their
              balance anytime, no more queues at the accounts office."
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/30">
                <span className="text-[11px] font-medium text-primary">MK</span>
              </div>
              <div className="min-w-0">
                <span className="text-[13px] font-medium text-foreground">Mary Kamanga</span>
                <span className="ml-2 text-[13px] text-muted-foreground">Accounts Officer, Lilongwe Academy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 w-full border-t border-border" />

      <section className="relative z-10 overflow-hidden px-4 pb-28 pt-24 md:px-6 md:pb-40 md:pt-32">
        <div className="mx-auto max-w-[1200px] text-center">
          <h2 className="mx-auto max-w-[560px] text-[clamp(2rem,6vw,3.2rem)] font-[500] leading-[1.1] tracking-[-0.035em] text-foreground">
            Stop chasing receipts. Start tracking payments.
          </h2>
          <p className="mx-auto mt-5 max-w-[430px] text-[15px] text-muted-foreground">
            Free to set up. Works with any bank or mobile money service.
            <br />
            Your school's accounts, finally organized.
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2.5 border border-foreground/40 px-8 py-3.5 text-[15px] font-medium text-foreground transition-all duration-200 hover:border-foreground hover:bg-foreground hover:text-background"
            >
              Get started now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <div className="relative z-10 border-t border-border">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-6 md:px-6">
          <div className="flex items-center gap-2">
            <BrandMark className="w-6 h-6 rounded-lg bg-primary/10" iconClassName="h-3.5 w-3.5 text-primary" />
            <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-foreground">EduPayTrack</span>
          </div>
          <span className="text-[12px] text-muted-foreground">{new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
}

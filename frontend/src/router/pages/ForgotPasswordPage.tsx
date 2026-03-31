import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { requestPasswordReset, resetPasswordWithToken } from '../../services/passwordReset';

function getStrength(pwd: string) {
  if (pwd.length === 0) return { score: 0, label: '', color: '', barColor: '', width: 'w-0' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const map = ['w-0', 'w-1/5', 'w-2/5', 'w-3/5', 'w-4/5', 'w-full'];
  if (score <= 1) return { score, label: 'Weak', color: 'text-red-500', barColor: 'bg-red-500', width: map[score] };
  if (score <= 2) return { score, label: 'Fair', color: 'text-amber-500', barColor: 'bg-amber-500', width: map[score] };
  if (score <= 3) return { score, label: 'Good', color: 'text-blue-500', barColor: 'bg-blue-500', width: map[score] };
  return { score, label: 'Strong', color: 'text-emerald-600', barColor: 'bg-emerald-500', width: map[Math.min(score, 5)] };
}

function PasswordInput({ id, value, onChange, placeholder = '••••••••', required = false, autoComplete }: {
  id: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id} name={id}
        autoComplete={autoComplete}
        type={show ? 'text' : 'password'}
        value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className="w-full bg-[#f1f4f9] border border-[#c1c6d4]/30 rounded-xl px-5 py-4 pr-12 text-sm font-medium text-[#0b1c30] placeholder:text-[#64748b] focus:ring-4 focus:ring-[#004e99]/10 focus:border-[#004e99]/30 focus:bg-white transition-all outline-none"
      />
      <button
        type="button" onClick={() => setShow(s => !s)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b]/50 hover:text-[#004e99] transition-colors"
      >
        <span className="material-symbols-outlined text-xl">{show ? 'visibility_off' : 'visibility'}</span>
      </button>
    </div>
  );
}

export function ForgotPasswordPage() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token');

  // --- STEP 1: Email Request ---
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [sendError, setSendError] = useState('');

  // --- STEP 2: New Password ---
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const strength = getStrength(newPassword);

  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault();
    setSendError('');
    setSendLoading(true);
    try {
      await requestPasswordReset(email);
      setEmailSent(true);
    } catch (err) {
      // Show success even on error for security (don't reveal if email exists)
      setEmailSent(true);
    } finally {
      setSendLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match.');
      return;
    }
    if (strength.score < 2) {
      setResetError('Password is too weak. Add uppercase letters, numbers or symbols.');
      return;
    }
    setResetError('');
    setResetLoading(true);
    try {
      await resetPasswordWithToken(resetToken!, newPassword);
      setResetSuccess(true);
    } catch (err) {
      setResetError(err instanceof Error ? err.message : 'Reset failed. Link may have expired.');
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="relative w-12 h-12 rounded-2xl bg-[#004e99] text-white flex items-center justify-center shadow-xl shadow-[#004e99]/20">
              <span className="material-symbols-outlined text-2xl">school</span>
              <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-lg shadow border border-slate-100">
                <span className="material-symbols-outlined text-[#004e99] text-base">payments</span>
              </div>
            </div>
            <span className="text-xl font-black tracking-tighter text-[#004e99]">EduPayTrack</span>
          </div>

          {!resetToken ? (
            <>
              <h1 className="text-2xl font-black text-[#0b1c30] tracking-tight">Reset your password</h1>
              <p className="text-sm text-[#64748b] mt-2 leading-relaxed">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-black text-[#0b1c30] tracking-tight">Set a new password</h1>
              <p className="text-sm text-[#64748b] mt-2">Choose a strong new password for your account.</p>
            </>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">

          {/* ---- STEP 1: Request Reset Email ---- */}
          {!resetToken && !emailSent && (
            <form onSubmit={handleRequestReset} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]/40 text-xl pointer-events-none">alternate_email</span>
                  <input
                    id="email-field"
                    name="email"
                    autoComplete="email"
                    type="email" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. student@school.edu"
                    className="w-full bg-[#f1f4f9] border border-[#c1c6d4]/30 rounded-xl pl-12 pr-5 py-4 text-sm font-medium text-[#0b1c30] placeholder:text-[#64748b] focus:ring-4 focus:ring-[#004e99]/10 focus:border-[#004e99]/30 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>

              {sendError && (
                <div className="flex items-center gap-2 text-red-600 text-xs font-bold bg-red-50 px-4 py-3 rounded-xl border border-red-100">
                  <span className="material-symbols-outlined text-base">error</span>
                  {sendError}
                </div>
              )}

              <button
                type="submit" disabled={sendLoading}
                className="w-full bg-[#004e99] hover:bg-[#003d7a] text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-[#004e99]/20 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {sendLoading ? 'sync' : 'send'}
                </span>
                {sendLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          {/* ---- STEP 1: Email Sent Confirmation ---- */}
          {!resetToken && emailSent && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-4xl text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
              </div>
              <h2 className="text-lg font-black text-slate-900">Check your inbox</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                If an account exists for <strong className="text-slate-700">{email}</strong>, you'll receive a password reset link shortly.
              </p>
              <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">Check your spam folder too</p>
            </div>
          )}

          {/* ---- STEP 2: Set New Password ---- */}
          {resetToken && !resetSuccess && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                <PasswordInput id="newPassword" value={newPassword} onChange={setNewPassword} required autoComplete="new-password" />
                {/* Char count hint */}
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-semibold text-slate-400">Min 8 · Max 16 chars</span>
                  <span className={`text-[10px] font-black tabular-nums ${newPassword.length > 14 ? 'text-amber-500' : 'text-slate-400'}`}>{newPassword.length}/16</span>
                </div>
                {/* Strength bar */}
                {newPassword.length > 0 && (
                  <div className="space-y-1.5 px-1">
                    <div className="flex justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Strength</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${strength.color}`}>{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${strength.barColor} ${strength.width}`} />
                    </div>
                    <ul className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
                      {[
                        { pass: newPassword.length >= 8, label: '8+ chars' },
                        { pass: /[A-Z]/.test(newPassword), label: 'Uppercase' },
                        { pass: /[0-9]/.test(newPassword), label: 'Number' },
                        { pass: /[^A-Za-z0-9]/.test(newPassword), label: 'Symbol' },
                      ].map((rule) => (
                        <li key={rule.label} className={`flex items-center gap-1 text-[10px] font-bold ${rule.pass ? 'text-emerald-600' : 'text-slate-300'}`}>
                          <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>{rule.pass ? 'check_circle' : 'radio_button_unchecked'}</span>
                          {rule.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</label>
                <PasswordInput id="confirmPassword" value={confirmPassword} onChange={setConfirmPassword} required autoComplete="new-password" />
                {confirmPassword.length > 0 && confirmPassword !== newPassword && (
                  <p className="text-[10px] text-red-500 font-bold px-1">Passwords do not match</p>
                )}
                {confirmPassword.length > 0 && confirmPassword === newPassword && (
                  <p className="text-[10px] text-emerald-600 font-bold px-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Passwords match
                  </p>
                )}
              </div>

              {resetError && (
                <div className="flex items-center gap-2 text-red-600 text-xs font-bold bg-red-50 px-4 py-3 rounded-xl border border-red-100">
                  <span className="material-symbols-outlined text-base">error</span>
                  {resetError}
                </div>
              )}

              <button
                type="submit" disabled={resetLoading}
                className="w-full bg-[#004e99] hover:bg-[#003d7a] text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-[#004e99]/20 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {resetLoading ? 'sync' : 'lock_reset'}
                </span>
                {resetLoading ? 'Saving...' : 'Set New Password'}
              </button>
            </form>
          )}

          {/* ---- STEP 2: Reset Success ---- */}
          {resetToken && resetSuccess && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-4xl text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              </div>
              <h2 className="text-lg font-black text-slate-900">Password updated!</h2>
              <p className="text-sm text-slate-400">Your password has been changed successfully. You can now log in with your new password.</p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 mt-4 bg-[#004e99] text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-md transition-all hover:bg-[#003d7a] active:scale-95"
              >
                <span className="material-symbols-outlined text-base">login</span>
                Back to Login
              </Link>
            </div>
          )}
        </div>

        {/* Back to login */}
        {!resetSuccess && (
          <div className="text-center mt-6">
            <Link to="/login" className="text-xs font-black text-slate-400 hover:text-[#004e99] uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

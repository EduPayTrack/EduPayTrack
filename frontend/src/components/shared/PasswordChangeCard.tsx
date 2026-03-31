import { useState } from 'react';
import type { FormEvent } from 'react';
import { changePassword } from '../../services/auth';

type PasswordChangeCardProps = {
  token: string;
  title?: string;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
};

function getStrength(pwd: string): { score: number; label: string; color: string; barColor: string } {
  if (pwd.length === 0) return { score: 0, label: '', color: '', barColor: '' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 1) return { score, label: 'Weak', color: 'text-red-500', barColor: 'bg-red-500' };
  if (score <= 2) return { score, label: 'Fair', color: 'text-amber-500', barColor: 'bg-amber-500' };
  if (score <= 3) return { score, label: 'Good', color: 'text-blue-500', barColor: 'bg-blue-500' };
  return { score, label: 'Strong', color: 'text-emerald-600', barColor: 'bg-emerald-500' };
}

function PasswordInput({
  id,
  value,
  onChange,
  placeholder = '••••••••',
  required = false,
  minLength,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        name={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className="w-full bg-slate-50 border border-slate-200 focus:ring-2 ring-primary/20 rounded-2xl px-5 py-4 pr-12 text-sm font-bold text-slate-900 transition-all focus:bg-white outline-none"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0" }}>
          {show ? 'visibility_off' : 'visibility'}
        </span>
      </button>
    </div>
  );
}

export function PasswordChangeCard({
  token,
  onError,
  onSuccess,
}: PasswordChangeCardProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const strength = getStrength(newPassword);
  const strengthWidth = ['w-0', 'w-1/5', 'w-2/5', 'w-3/5', 'w-4/5', 'w-full'][strength.score];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (strength.score < 2) {
      onError('Password is too weak. Add uppercase letters, numbers or symbols.');
      return;
    }
    setSubmitting(true);
    onError('');
    onSuccess('');
    try {
      const result = await changePassword(token, { currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      onSuccess(result.message);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-6 max-w-lg" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
          Current Password
        </label>
        <PasswordInput
          id="currentPassword"
          value={currentPassword}
          onChange={setCurrentPassword}
          required
          minLength={8}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
          New Password
        </label>
        <PasswordInput
          id="newPassword"
          value={newPassword}
          onChange={setNewPassword}
          required
          minLength={8}
        />

        {/* Char count hint — always visible */}
        <div className="flex justify-between items-center px-1 mt-1">
          <span className="text-[10px] font-semibold text-slate-400">
            Min 8 · Max 16 chars
          </span>
          <span className={`text-[10px] font-black tabular-nums ${newPassword.length > 14 ? 'text-amber-500' : 'text-slate-400'}`}>
            {newPassword.length}/16
          </span>
        </div>

        {/* Strength Meter */}
        {newPassword.length > 0 && (
          <div className="px-1 pt-1 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Password strength
              </span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${strength.color}`}>
                {strength.label}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${strength.barColor} ${strengthWidth}`}
              />
            </div>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
              {[
                { pass: newPassword.length >= 8, label: '8+ chars' },
                { pass: /[A-Z]/.test(newPassword), label: 'Uppercase' },
                { pass: /[0-9]/.test(newPassword), label: 'Number' },
                { pass: /[^A-Za-z0-9]/.test(newPassword), label: 'Symbol' },
              ].map((rule) => (
                <li key={rule.label} className={`flex items-center gap-1 text-[10px] font-bold ${rule.pass ? 'text-emerald-600' : 'text-slate-300'}`}>
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {rule.pass ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  {rule.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        className="px-8 py-4 bg-primary hover:bg-[#003d7a] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
        disabled={submitting}
        type="submit"
      >
        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
          {submitting ? 'sync' : 'lock_reset'}
        </span>
        {submitting ? 'Saving...' : 'Update Password'}
      </button>
    </form>
  );
}

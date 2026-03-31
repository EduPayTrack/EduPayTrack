import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { terminateActiveSession } from '../../services/auth';
import type { LoginFormState } from '../../types/forms';

export function SessionConflictPage() {
  // [SECTION: NAVIGATION STATE] - Extracting login credentials from context for remote override
  const location = useLocation();
  const navigate = useNavigate();
  
  // [SECTION: RECOVERY STATE] - Tracking progress and feedback for secondary terminal session
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const credentials = (location.state as any)?.credentials as LoginFormState | undefined;

  // [SECTION: REMOTE TERMINATION HANDLER] - Command to forcefully end the other active session
  async function handleTerminate() {
    if (!credentials) {
      setError('Session termination failed: invalid credentials context.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await terminateActiveSession(credentials);
      setSuccess('Institutional session terminated. Returning to login...');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to terminate session.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-body">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-10 text-center space-y-8 animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-amber-200/50">
          <span className="material-symbols-outlined text-4xl text-amber-600">lock_clock</span>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Session in Progress</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Security Alert</p>
        </div>

        <div className="p-6 bg-amber-50/50 rounded-3xl border border-amber-100/50">
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            Our records indicate that you already have an <strong className="text-slate-900 underline underline-offset-4">active session</strong> elsewhere. To maintain institutional security, EduPayTrack prevents multiple concurrent logins for the same user.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <p className="text-xs text-slate-400 font-bold px-4">
            You must close your other session before logging in on this device.
          </p>
          
          <div className="flex flex-col gap-3">
            {credentials ? (
              <button 
                onClick={handleTerminate}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 transition-all active:scale-95 flex items-center justify-center gap-2 group"
              >
                <span className={`material-symbols-outlined text-lg ${loading ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`}>
                  {loading ? 'sync' : 'no_accounts'}
                </span>
                {loading ? 'Terminating...' : 'End Active Session & Login'}
              </button>
            ) : (
                <div className="p-4 bg-red-50 text-red-700 text-[10px] font-black uppercase rounded-2xl border border-red-100">
                    Direct access without login attempt is prohibited.
                </div>
            )}

            {error && (
                <div className="text-[10px] font-black text-red-600 uppercase bg-red-50 p-3 rounded-xl">
                    {error}
                </div>
            )}

            {success && (
                <div className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 p-3 rounded-xl animate-bounce">
                    {success}
                </div>
            )}

            <Link 
              to="/login"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Back to gateway
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-50">
          <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
            Institutional Integrity Enforcement
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import type { FormEvent } from 'react';

import { loginUser, registerStudent } from '../../services/auth';
import { Link, useNavigate } from 'react-router-dom';
import type { AuthResponse, AuthMode } from '../../types/api';
import { TOKEN_STORAGE_KEY } from '../../config/env';
import {
  initialLoginForm,
  initialRegisterForm,
  type LoginFormState,
  type RegisterFormState,
} from '../../types/forms';

type AuthGateProps = {
  initialMode?: AuthMode;
  onAuthenticated: (session: AuthResponse) => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
};

export function AuthGate({
  initialMode = 'login',
  onAuthenticated,
  onError,
  onSuccess,
}: AuthGateProps) {
  // [SECTION: LOGIN OR SIGNUP] - Deciding if the user is logging in or creating a new account
  const [authMode, setAuthMode] = useState<AuthMode>(initialMode);
  
  // [SECTION: TYPING BOXES] - This is where we save what you type into the form
  const [registerForm, setRegisterForm] = useState<RegisterFormState>(initialRegisterForm);
  const [loginForm, setLoginForm] = useState<LoginFormState>(initialLoginForm);
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // [SECTION: SCREEN SETTINGS] - Toggles to show/hide passwords or loading spinners
  const [loading, setLoading] = useState(false);
  const [showLoginPwd, setShowLoginPwd] = useState(false);


  const navigate = useNavigate();

  // [SECTION: THE SUBMIT ACTION] - What happens when you click the "Login" button
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onError('');
    onSuccess('');

    // STEP 1: Check if you are already logged in on this browser
    if (authMode === 'login' && localStorage.getItem(TOKEN_STORAGE_KEY)) {
        onError('A secure session is already active in this browser. Please use the current session.');
        return;
    }

    // STEP 2: Basic checks like matching passwords
    if (authMode === 'register' && registerForm.password !== confirmPassword) {
      onError('Passwords do not match.');
      return;
    }

    if (authMode === 'register' && registerForm.password.length < 8) {
      onError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const session =
        authMode === 'login'
          ? await loginUser(loginForm)
          : await registerStudent(registerForm);

      onAuthenticated(session);
      onSuccess(
        authMode === 'login'
          ? `Signed in as ${session.user.role.toLowerCase()}.`
          : 'Student account created successfully.',
      );
    } catch (error) {
       const message = error instanceof Error ? error.message : 'Authentication failed';
       if (message === 'ACTIVE_SESSION_EXISTS') {
         navigate('/session-conflict', { 
           replace: true, 
           state: { credentials: loginForm } 
         });
       } else {
         onError(message);
       }
    } finally {
      setLoading(false);
    }
  }

  function handleProfilePicUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRegisterForm((c) => ({ ...c, profilePicUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  }

  function toggleMode(mode: AuthMode) {
    setAuthMode(mode);
    onError('');
    onSuccess('');
  }

  return (
    <div className="w-full flex flex-col items-center transition-colors duration-300">
      {/* Editorial Header */}
      <div className="text-center mb-10">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-[#004e99] text-white shadow-xl shadow-[#004e99]/20 transition-transform duration-500 group-hover:scale-105">
              <span className="material-symbols-outlined text-3xl">school</span>
              <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg shadow-md border border-[#c1c6d4]/30">
                <span className="material-symbols-outlined text-[#004e99] text-xl">payments</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center mt-3 leading-tight">
            <span className="text-xl font-bold tracking-tighter text-[#004e99]">EduPayTrack</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0b1c30] font-headline mb-3">
          {authMode === 'register' ? 'Sign up to submit proof of your payment' : 'Log In to your Account'}
        </h1>
        <p className="text-[#414752] font-body leading-relaxed max-w-lg mx-auto opacity-80">
          {authMode === 'register' 
            ? 'Securely submit proof of payment documents and monitor your institutional tuition balances in real-time.' 
            : 'Access your institutional ledger and track your payments.'}
        </p>
      </div>

      {/* Glassmorphic Card */}
      <div className={`glass-card rounded-xl p-8 md:p-10 border border-[#c1c6d4]/30 w-full ${authMode === 'login' ? 'bg-[#004e99]/5' : ''}`}>
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {authMode === 'login' ? (
            /* --- LOGIN VIEW --- */
            <div className="space-y-6">
              {/* Input Group: Identifier */}
              <div className="space-y-2 text-left">
                <label className="block text-xs font-bold tracking-[0.05em] uppercase text-[#64748b] ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <input 
                    id="login-email"
                    name="email"
                    autoComplete="email"
                    className="w-full bg-[#f1f4f9] border-[#c1c6d4]/30 rounded-lg px-4 py-3.5 focus:ring-1 focus:ring-primary transition-all duration-200 text-[#0b1c30] placeholder:text-[#64748b]" 
                    placeholder="e.g. student@school.edu" 
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((c) => ({ ...c, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Input Group: Password */}
              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-xs font-bold tracking-[0.05em] uppercase text-[#64748b]">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs font-medium text-[#004e99] hover:text-[#004e99]/70 transition-colors duration-200">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <input 
                    id="login-password"
                    name="password"
                    autoComplete="current-password"
                    className="w-full bg-[#f1f4f9] border-[#c1c6d4]/30 rounded-lg px-4 py-3.5 pr-12 focus:ring-1 focus:ring-primary transition-all duration-200 text-[#0b1c30] placeholder:text-[#64748b]" 
                    placeholder="••••••••" 
                    type={showLoginPwd ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((c) => ({ ...c, password: e.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPwd(s => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b]/50 hover:text-[#004e99] transition-colors"
                    aria-label={showLoginPwd ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-symbols-outlined text-xl">{showLoginPwd ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center px-1 text-left">
                <label className="relative flex items-center cursor-pointer group">
                  <input 
                    id="remember-me"
                    name="remember-me"
                    className="peer sr-only" 
                    type="checkbox" 
                  />
                  <div className="w-5 h-5 bg-[#f1f4f9] rounded border border-[#c1c6d4]/30 peer-checked:bg-[#004e99] peer-checked:border-primary transition-all duration-200 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px] text-white opacity-0 peer-checked:opacity-100" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  </div>
                  <span className="ml-3 text-sm text-[#414752] group-hover:text-[#0b1c30] transition-colors">Remember me</span>
                </label>
              </div>

              {/* Primary Action */}
              <button 
                className="w-full bg-[#004e99] text-white font-semibold py-4 rounded-lg shadow-lg shadow-[#004e99]/10 hover:shadow-[#004e99]/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none" 
                type="submit"
                disabled={loading}
              >
                <span>{loading ? 'Working...' : 'Log In'}</span>
                {!loading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
              </button>
            </div>
          ) : (
            /* --- REGISTER VIEW --- */
            <>
              {/* Profile Photo (Optional) */}
              <div className="flex flex-col items-center gap-4 py-4 mb-4 border-b border-[#c1c6d4]/30 border-dashed">
                <div className="relative group cursor-pointer">
                  <div className="w-24 h-24 rounded-full bg-[#f1f4f9] border-2 border-dashed border-[#c1c6d4]/30 flex items-center justify-center overflow-hidden group-hover:border-primary/50 transition-all duration-300 shadow-inner">
                    {registerForm.profilePicUrl ? (
                      <img 
                        src={registerForm.profilePicUrl} 
                        className="w-full h-full object-cover animate-in fade-in duration-500" 
                        alt="Profile Preview"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-[#64748b]/40">
                        <span className="material-symbols-outlined text-4xl mb-1">add_a_photo</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-center px-2">Upload Photo</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      onChange={handleProfilePicUpload}
                    />
                  </div>
                  {registerForm.profilePicUrl && (
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setRegisterForm(c => ({...c, profilePicUrl: ''}));
                      }}
                      className="absolute -top-1 -right-1 bg-red-600 text-white w-7 h-7 rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 transition-colors z-20 border-2 border-card"
                    >
                      <span className="material-symbols-outlined text-[16px] font-bold">close</span>
                    </button>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-[#004e99] text-white w-7 h-7 rounded-full shadow-lg flex items-center justify-center pointer-events-none border-2 border-card">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>{registerForm.profilePicUrl ? 'edit' : 'add'}</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#64748b]">Institutional Profile Identity</p>
                  <p className="text-[9px] text-[#64748b] italic opacity-60">(Optional: Max 10MB)</p>
                </div>
              </div>

              {/* Row 1: Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                <InputGroup
                  label="First Name"
                  icon="person"
                  id="firstName"
                  placeholder="e.g. Jane"
                  value={registerForm.firstName}
                  onChange={(v) => setRegisterForm((c) => ({ ...c, firstName: v }))}
                  required
                />
                <InputGroup
                  label="Last Name"
                  icon="person"
                  id="lastName"
                  placeholder="e.g. Doe"
                  value={registerForm.lastName}
                  onChange={(v) => setRegisterForm((c) => ({ ...c, lastName: v }))}
                  required
                />
              </div>

              {/* Row 2: Student Code & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                <InputGroup
                  label="Registration Number / Username"
                  icon="badge"
                  id="studentCode"
                  placeholder="e.g. REG-123456"
                  value={registerForm.studentCode}
                  onChange={(v) => setRegisterForm((c) => ({ ...c, studentCode: v }))}
                  required
                />
                <InputGroup
                  label="Phone Number"
                  icon="call"
                  id="phone"
                  placeholder="e.g. +1 234 567 890"
                  value={registerForm.phone}
                  onChange={(v) => setRegisterForm((c) => ({ ...c, phone: v }))}
                />
              </div>

              {/* Row 3: Level & Sub-Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                <SelectGroup
                  label="Level of Education"
                  id="classLevel"
                  value={registerForm.classLevel}
                  onChange={(v) => {
                    setRegisterForm((c) => ({ 
                      ...c, 
                      classLevel: v,
                      program: '',
                      academicYear: ''
                    }));
                  }}
                  options={[
                    { value: 'primary', label: 'Primary' },
                    { value: 'secondary', label: 'Secondary' },
                    { value: 'college', label: 'College' },
                    { value: 'university', label: 'University' },
                  ]}
                  required
                />
                
                {/* Secondary Option: Standard/Form for School, Program for Higher Ed */}
                <SelectGroup
                  label={
                    registerForm.classLevel === 'primary' ? 'Standard' :
                    registerForm.classLevel === 'secondary' ? 'Form' : 'Academic Program'
                  }
                  id="program"
                  value={registerForm.program}
                  onChange={(v) => setRegisterForm((c) => ({ ...c, program: v }))}
                  options={
                    registerForm.classLevel === 'primary' ? [
                      { value: '1', label: 'Standard 1' },
                      { value: '2', label: 'Standard 2' },
                      { value: '3', label: 'Standard 3' },
                      { value: '4', label: 'Standard 4' },
                      { value: '5', label: 'Standard 5' },
                      { value: '6', label: 'Standard 6' },
                      { value: '7', label: 'Standard 7' },
                      { value: '8', label: 'Standard 8' },
                    ] :
                    registerForm.classLevel === 'secondary' ? [
                      { value: '1', label: 'Form 1' },
                      { value: '2', label: 'Form 2' },
                      { value: '3', label: 'Form 3' },
                      { value: '4', label: 'Form 4' },
                    ] :
                    [
                      { value: 'certificate', label: 'Certificate Level' },
                      { value: 'diploma', label: 'Diploma Level' },
                      { value: 'degree', label: 'Degree Level' },
                      { value: 'masters', label: 'Masters Level' },
                      { value: 'phd', label: 'PhD Level' },
                    ]
                  }
                  required
                />
              </div>

              {/* Row 4: Academic Year / Semester / Year Tracking */}
              <div className={`grid grid-cols-1 ${registerForm.classLevel === 'college' || registerForm.classLevel === 'university' ? 'md:grid-cols-2' : ''} gap-5 text-left`}>
                
                {/* Higher Ed Only: Year Dropdown */}
                {(registerForm.classLevel === 'college' || registerForm.classLevel === 'university') && (
                   <SelectGroup
                    label="Current Year"
                    id="currentYear"
                    // We parse/store this in academicYear as part of a JSON string or combined string for the backend
                    value={registerForm.academicYear.split(' - ')[0] || ''}
                    onChange={(v) => {
                      const sem = registerForm.academicYear.split(' - ')[1] || '';
                      setRegisterForm(c => ({ ...c, academicYear: v + (sem ? ` - ${sem}` : '') }));
                    }}
                    options={[
                      { value: 'Year 1', label: 'Year 1' },
                      { value: 'Year 2', label: 'Year 2' },
                      { value: 'Year 3', label: 'Year 3' },
                      { value: 'Year 4', label: 'Year 4' },
                      { value: 'Year 5', label: 'Year 5' },
                      { value: 'Year 6', label: 'Year 6' },
                      { value: 'Year 7', label: 'Year 7' },
                    ]}
                    required
                  />
                )}

                <SelectGroup
                  label={
                    registerForm.classLevel === 'primary' || registerForm.classLevel === 'secondary' 
                      ? 'Current Term' 
                      : 'Current Semester'
                  }
                  id="academicYearSelect"
                  value={
                    registerForm.classLevel === 'primary' || registerForm.classLevel === 'secondary'
                    ? registerForm.academicYear
                    : (registerForm.academicYear.split(' - ')[1] || '')
                  }
                  onChange={(v) => {
                    if (registerForm.classLevel === 'college' || registerForm.classLevel === 'university') {
                      const yr = registerForm.academicYear.split(' - ')[0] || '';
                      setRegisterForm(c => ({ ...c, academicYear: (yr ? `${yr} - ` : '') + v }));
                    } else {
                      setRegisterForm((c) => ({ ...c, academicYear: v }));
                    }
                  }}
                  options={
                    registerForm.classLevel === 'primary' || registerForm.classLevel === 'secondary' ? [
                      { value: 't1', label: 'Term 1' },
                      { value: 't2', label: 'Term 2' },
                      { value: 't3', label: 'Term 3' },
                    ] :
                    [
                      { value: 'Semester 1', label: 'Semester 1' },
                      { value: 'Semester 2', label: 'Semester 2' },
                    ]
                  }
                  required
                />
              </div>

              {/* Shared: Email */}
              <div className="grid grid-cols-1 gap-5 text-left">
                <InputGroup
                  label="Email Address"
                  icon="alternate_email"
                  id="email"
                  type="email"
                  placeholder="e.g. student@school.edu"
                  value={registerForm.email}
                  onChange={(v) => setRegisterForm((c) => ({ ...c, email: v }))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left items-start">
                <div className="flex flex-col gap-1 w-full relative">
                  <InputGroup
                    label="Password"
                    icon="lock"
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={registerForm.password}
                    onChange={(v) => {
                      if (v.length <= 16) {
                        setRegisterForm((c) => ({ ...c, password: v }));
                      }
                    }}
                    required
                  />
                  {/* Infield guidelines and strength bar */}
                  <div className="px-1 mt-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-semibold text-[#64748b]">Min 8, Max 16 chars</span>
                      {registerForm.password.length > 0 && (
                        <span className={`text-[10px] font-bold tracking-wider uppercase ${
                          registerForm.password.length < 8 ? 'text-red-500' : 
                          registerForm.password.length < 12 ? 'text-amber-500' : 'text-emerald-600'
                        }`}>
                          {registerForm.password.length < 8 ? 'Weak' : 
                           registerForm.password.length < 12 ? 'Fair' : 'Strong'}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-[#c1c6d4]/30">
                      <div className={`h-full transition-all duration-500 ${
                        registerForm.password.length === 0 ? 'w-0' :
                        registerForm.password.length < 6 ? 'w-1/4 bg-red-500' : 
                        registerForm.password.length < 8 ? 'w-2/4 bg-red-500' : 
                        registerForm.password.length < 12 ? 'w-3/4 bg-amber-500' : 'w-full bg-emerald-500'
                      }`} />
                    </div>
                  </div>
                </div>
                
                <InputGroup
                  label="Confirm Password"
                  icon="key"
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(v) => {
                    if (v.length <= 16) {
                      setConfirmPassword(v);
                    }
                  }}
                  required
                />
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#004e99] text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-[#004e99]/30 hover:bg-[#004e99]/90 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none"
                >
                  {loading ? 'Working...' : 'Sign Up'}
                  {!loading && <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>}
                </button>
              </div>
            </>
          )}
        </form>

        {/* Secondary Actions */}
        <div className="mt-8 pt-6 border-t border-[#c1c6d4]/30 text-center">
          {authMode === 'register' ? (
            <p className="text-[#414752] text-sm">
              Already have an account?{' '}
              <button 
                type="button" 
                onClick={() => toggleMode('login')} 
                className="text-[#004e99] hover:underline font-bold ml-1 transition-all decoration-2 underline-offset-4"
              >
                Log In
              </button>
            </p>
          ) : (
            <p className="text-[#414752] text-sm">
              Don't have an account?{' '}
              <button 
                type="button" 
                onClick={() => toggleMode('register')} 
                className="text-[#004e99] font-semibold hover:underline decoration-2 underline-offset-4 ml-1 transition-all"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Internal Layout Helpers (For Register View)
// ------------------------------------------------------------------

type InputGroupProps = {
  label: string;
  icon: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

function InputGroup({ label, icon, id, type = 'text', placeholder, value, onChange, required }: InputGroupProps) {
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPwd ? 'text' : 'password') : type;
  return (
    <div className="space-y-1.5 input-group transition-all duration-300">
      <label 
        className="block text-[11px] font-bold uppercase tracking-widest text-[#64748b] ml-1 transition-all duration-300" 
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]/40 text-xl pointer-events-none">
          {icon}
        </span>
        <input 
          className="w-full pl-12 pr-12 py-3.5 bg-[#f1f4f9] border border-[#c1c6d4]/30 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary/40 focus:bg-white transition-all placeholder:text-[#64748b] text-[#0b1c30] font-medium" 
          id={id} 
          name={id} 
          type={inputType}
          placeholder={placeholder} 
          required={required}
          value={value} 
          onChange={(e) => onChange(e.target.value)}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPwd(s => !s)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b]/50 hover:text-[#004e99] transition-colors"
            aria-label={showPwd ? 'Hide password' : 'Show password'}
          >
            <span className="material-symbols-outlined text-xl">{showPwd ? 'visibility_off' : 'visibility'}</span>
          </button>
        )}
      </div>
    </div>
  );
}

type SelectGroupProps = {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  required?: boolean;
};

function SelectGroup({ label, id, value, onChange, options, required }: SelectGroupProps) {
  return (
    <div className="space-y-1.5 input-group transition-all duration-300">
      <label 
        className="block text-[11px] font-bold uppercase tracking-widest text-[#64748b] ml-1 transition-all duration-300" 
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative">
        <select 
          className="w-full pl-4 pr-10 py-3.5 bg-[#f1f4f9] border border-[#c1c6d4]/30 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary/40 focus:bg-white transition-all text-[#0b1c30] font-medium custom-select appearance-none" 
          id={id} 
          name={id} 
          required={required}
          value={value} 
          onChange={(e) => onChange(e.target.value)}
        >
          <option disabled value="">Select option...</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

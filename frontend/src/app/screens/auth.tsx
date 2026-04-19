import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Outlet } from 'react-router-dom';
import { Eye, EyeOff, Loader2, GraduationCap } from 'lucide-react';

import { useAuth } from '../state/auth-context';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ApiError } from '../lib/api';

/* ---------- Schemas ---------- */

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z.object({
  studentCode: z.string().min(3, 'Student ID is required (min 3 chars)'),
  fullName: z.string().min(3, 'Full name is required'),
  email: z.string().email('Enter a valid email address'),
  schoolLevel: z.enum(['PRIMARY', 'SECONDARY', 'TERTIARY']).default('TERTIARY'),
  program: z.string().optional(),
  classLevel: z.string().optional(),
  year: z.string().optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string().min(8, 'Confirm your password'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

/* ---------- Layout ---------- */

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4 md:p-8">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-8%] w-[45%] h-[45%] bg-info/8 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[25%] h-[25%] bg-success/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[440px] relative z-10">
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">EduPayTrack</h1>
            <p className="text-sm text-muted-foreground mt-1">School fee payment management</p>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

/* ---------- Login ---------- */

export function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSessionConflict, setIsSessionConflict] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
    setApiError(null);
    setIsSessionConflict(false);
    try {
      await login(values);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.message === 'ACTIVE_SESSION_EXISTS') {
          setIsSessionConflict(true);
          setApiError('Another session is already active for this account. You can terminate it and sign in again.');
        } else {
          setApiError(error.message);
        }
      } else {
        setApiError('An unexpected error occurred');
      }
    }
  };

  const handleTerminateSession = async () => {
    const email = form.getValues('email');
    const password = form.getValues('password');
    setApiError(null);
    try {
      const { apiFetch } = await import('../lib/api');
      await apiFetch('/auth/terminate-session', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      // Now log in
      await login({ email, password });
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      }
    }
  };

  return (
    <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-card/95">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl font-semibold">Welcome back</CardTitle>
        <CardDescription className="text-[13px]">Sign in with your email and password</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {apiError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-[13px] text-destructive">
                <p>{apiError}</p>
                {isSessionConflict && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 h-7 text-[12px] border-destructive/30 text-destructive hover:bg-destructive/10"
                    onClick={handleTerminateSession}
                  >
                    Terminate other session & sign in
                  </Button>
                )}
              </div>
            )}

            <FormField name="email" render={() => (
              <FormItem>
                <FormLabel className="text-[13px] font-medium">Email address</FormLabel>
                <FormControl>
                  <Input
                    {...form.register('email')}
                    type="email"
                    className="h-10"
                    placeholder="you@university.ac.mw"
                    autoComplete="email"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage className="text-[12px]" />
              </FormItem>
            )} />

            <FormField name="password" render={() => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-[13px] font-medium">Password</FormLabel>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      {...form.register('password')}
                      className="h-10 pr-10"
                      autoComplete="current-password"
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-[12px]" />
              </FormItem>
            )} />

            <Button
              type="submit"
              className="w-full h-10 font-medium mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>

            <p className="text-[13px] text-center text-muted-foreground mt-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Create account
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

/* ---------- Register ---------- */

export function RegisterPage() {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  type RegisterFormValues = z.infer<typeof registerSchema>;

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema) as any,
    defaultValues: {
      studentCode: '',
      fullName: '',
      email: '',
      schoolLevel: 'TERTIARY',
      program: '',
      classLevel: '',
      year: '',
      password: '',
      confirmPassword: '',
    } as RegisterFormValues,
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleSubmit = async (values: RegisterFormValues) => {
    setApiError(null);
    try {
      await register(values);
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError('Registration failed. Please try again.');
      }
    }
  };

  const passwordValue = form.watch('password');
  const passwordStrength = (() => {
    let score = 0;
    if (passwordValue?.length >= 8) score++;
    if (/[A-Z]/.test(passwordValue || '')) score++;
    if (/[0-9]/.test(passwordValue || '')) score++;
    if (/[^A-Za-z0-9]/.test(passwordValue || '')) score++;
    return score;
  })();
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', 'bg-destructive', 'bg-warning', 'bg-info', 'bg-success'];

  return (
    <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-card/95">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl font-semibold">Create account</CardTitle>
        <CardDescription className="text-[13px]">Register as a student to submit and track fee payments</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit as any)} className="space-y-4">
            {apiError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-[13px] text-destructive">
                {apiError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <FormField name="studentCode" render={() => (
                <FormItem>
                  <FormLabel className="text-[13px] font-medium">Student ID</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10"
                      placeholder="MUST/CS/001"
                      {...form.register('studentCode')}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage className="text-[12px]" />
                </FormItem>
              )} />
              <FormField name="fullName" render={() => (
                <FormItem>
                  <FormLabel className="text-[13px] font-medium">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10"
                      placeholder="John Banda"
                      {...form.register('fullName')}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage className="text-[12px]" />
                </FormItem>
              )} />
            </div>

            <FormField name="email" render={() => (
              <FormItem>
                <FormLabel className="text-[13px] font-medium">Email address</FormLabel>
                <FormControl>
                  <Input
                    className="h-10"
                    type="email"
                    placeholder="you@university.ac.mw"
                    {...form.register('email')}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage className="text-[12px]" />
              </FormItem>
            )} />

            <FormField name="schoolLevel" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[13px] font-medium">School Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select level..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PRIMARY">Primary School</SelectItem>
                    <SelectItem value="SECONDARY">Secondary School</SelectItem>
                    <SelectItem value="TERTIARY">Tertiary / University</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-[12px]" />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-3">
              {form.watch('schoolLevel') === 'TERTIARY' && (
                <FormField name="program" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] font-medium">Program</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Business Administration">Business Admin</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Medicine">Medicine</SelectItem>
                        <SelectItem value="Law">Law</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[12px]" />
                  </FormItem>
                )} />
              )}
              {form.watch('schoolLevel') === 'PRIMARY' && (
                <FormField name="classLevel" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] font-medium">Standard</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8].map(n => (
                           <SelectItem key={n} value={`Standard ${n}`}>Standard {n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[12px]" />
                  </FormItem>
                )} />
              )}
              {form.watch('schoolLevel') === 'SECONDARY' && (
                <FormField name="classLevel" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] font-medium">Form</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1,2,3,4].map(n => (
                           <SelectItem key={n} value={`Form ${n}`}>Form {n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[12px]" />
                  </FormItem>
                )} />
              )}

              <FormField name="year" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] font-medium">Academic Year</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="Year 1">Year 1</SelectItem>
                      <SelectItem value="Year 2">Year 2</SelectItem>
                      <SelectItem value="Year 3">Year 3</SelectItem>
                      <SelectItem value="Year 4">Year 4</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[12px]" />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField name="password" render={() => (
                <FormItem>
                  <FormLabel className="text-[13px] font-medium">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        className="h-10 pr-10"
                        {...form.register('password')}
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-[12px]" />
                </FormItem>
              )} />
              <FormField name="confirmPassword" render={() => (
                <FormItem>
                  <FormLabel className="text-[13px] font-medium">Confirm</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      className="h-10"
                      {...form.register('confirmPassword')}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage className="text-[12px]" />
                </FormItem>
              )} />
            </div>

            {/* Password strength indicator */}
            {passwordValue && (
              <div className="space-y-1.5">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        passwordStrength >= i ? strengthColors[passwordStrength] : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Password strength: <span className="font-medium">{strengthLabels[passwordStrength] || 'Too short'}</span>
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-10 font-medium mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>

            <p className="text-[13px] text-center text-muted-foreground mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

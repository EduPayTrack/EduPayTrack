import type { PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

import { AuthProvider } from './state/auth-context';
import { AccessibilityProvider } from './state/accessibility-context';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="edu-pay-track-theme">
      <AccessibilityProvider>
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}


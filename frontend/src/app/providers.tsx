import type { PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

import { AuthProvider } from './state/auth-context';
import { AccessibilityProvider } from './state/accessibility-context';
import { WebSocketProvider } from './state/websocket-context';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="edu-pay-track-theme">
      <AccessibilityProvider>
        <AuthProvider>
          <WebSocketProvider>
            {children}
            <Toaster richColors position="top-right" duration={4000} closeButton />
          </WebSocketProvider>
        </AuthProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}


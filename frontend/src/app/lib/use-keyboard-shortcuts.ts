// @ts-nocheck
import { useEffect, useCallback, useState } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when user is typing in input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.getAttribute('role') === 'textbox'
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = !!shortcut.ctrl === (e.ctrlKey || e.metaKey);
        const shiftMatch = !!shortcut.shift === e.shiftKey;
        const altMatch = !!shortcut.alt === e.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          if (shortcut.preventDefault !== false) {
            e.preventDefault();
          }
          shortcut.action();
          break;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}

// Common shortcuts for the app
export function useAppShortcuts({
  onSearch,
  onUpload,
  onHelp,
  onLogout,
  onNavigateHome,
  onNavigateHistory,
  onNavigateSettings,
}: {
  onSearch?: () => void;
  onUpload?: () => void;
  onHelp?: () => void;
  onLogout?: () => void;
  onNavigateHome?: () => void;
  onNavigateHistory?: () => void;
  onNavigateSettings?: () => void;
}) {
  const [shortcutsHelpOpen, setShortcutsHelpOpen] = useState(false);

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      ctrl: true,
      description: 'Open command palette / search',
      action: () => onSearch?.(),
    },
    {
      key: 'u',
      ctrl: true,
      description: 'Go to upload payment',
      action: () => onUpload?.(),
    },
    {
      key: 'h',
      ctrl: true,
      description: 'Go to home / dashboard',
      action: () => onNavigateHome?.(),
    },
    {
      key: 'p',
      ctrl: true,
      description: 'Go to payment history',
      action: () => onNavigateHistory?.(),
    },
    {
      key: ',',
      ctrl: true,
      description: 'Open settings',
      action: () => onNavigateSettings?.(),
    },
    {
      key: '?',
      description: 'Show keyboard shortcuts help',
      action: () => setShortcutsHelpOpen(true),
    },
    {
      key: 'Escape',
      description: 'Close dialogs / modals',
      action: () => setShortcutsHelpOpen(false),
      preventDefault: false,
    },
  ];

  useKeyboardShortcuts(shortcuts);

  return {
    shortcuts,
    shortcutsHelpOpen,
    setShortcutsHelpOpen,
  };
}

// Get readable shortcut display
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  if (shortcut.ctrl) parts.push('Ctrl');
  if (shortcut.alt) parts.push('Alt');
  if (shortcut.shift) parts.push('Shift');
  if (shortcut.meta) parts.push('Cmd');
  parts.push(shortcut.key.toUpperCase());
  return parts.join(' + ');
}

export default useKeyboardShortcuts;

import { Keyboard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { formatShortcut, type KeyboardShortcut } from '../lib/use-keyboard-shortcuts';

interface KeyboardShortcutsHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shortcuts: KeyboardShortcut[];
}

export function KeyboardShortcutsHelp({ open, onOpenChange, shortcuts }: KeyboardShortcutsHelpProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <p className="text-[13px] text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[12px] font-mono">?</kbd> anytime to show this help.
          </p>

          <div className="space-y-2">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <span className="text-[13px]">{shortcut.description}</span>
                <Badge variant="secondary" className="font-mono text-[11px]">
                  {formatShortcut(shortcut)}
                </Badge>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-muted-foreground">
            <p>Note: Shortcuts are disabled when typing in input fields.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default KeyboardShortcutsHelp;

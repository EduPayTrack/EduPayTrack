import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';

type NotificationConfirmDialogsProps = {
  deletingId: string | null;
  setDeletingId: (id: string | null) => void;
  showClearAllConfirm: boolean;
  setShowClearAllConfirm: (open: boolean) => void;
  onDelete: (id: string) => Promise<void> | void;
  onClearAll: () => Promise<void> | void;
};

export function NotificationConfirmDialogs({
  deletingId,
  setDeletingId,
  showClearAllConfirm,
  setShowClearAllConfirm,
  onDelete,
  onClearAll,
}: NotificationConfirmDialogsProps) {
  return (
    <>
      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Notification</DialogTitle>
            <DialogDescription>Delete this notification?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deletingId && onDelete(deletingId)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showClearAllConfirm} onOpenChange={setShowClearAllConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Clear All Notifications</DialogTitle>
            <DialogDescription>Delete all notifications? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearAllConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={onClearAll}>Delete All</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

import { useState } from "react";
import { useRequests } from "@/hooks/useRequests";
import { AdminRequest, RequestLifecycle, STATUS_LABELS, REQUEST_TYPE_LABELS, RequestType } from "@/types/request";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UpdateStatusDialogProps {
  request: AdminRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UpdateStatusDialog = ({ request, open, onOpenChange }: UpdateStatusDialogProps) => {
  const { updateRequestStatus } = useRequests();
  const [status, setStatus] = useState<RequestLifecycle>(RequestLifecycle.IN_REVIEW);
  const [decisionReason, setDecisionReason] = useState("");
  const [processingOffice, setProcessingOffice] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isCertificateRequest =
    request &&
    (request.type === RequestType.BIRTH_CERTIFICATE ||
      request.type === RequestType.DEATH_CERTIFICATE ||
      request.type === RequestType.MARRIAGE_CERTIFICATE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request?.id) return;

    setIsSubmitting(true);
    
    const success = await updateRequestStatus(request.id, status, {
      decisionReason,
      processingOffice,
      comment,
    });

    if (success) {
      onOpenChange(false);
      setDecisionReason("");
      setProcessingOffice("");
      setComment("");
    }

    setIsSubmitting(false);
  };

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Process Request #{request.id}</DialogTitle>
          <DialogDescription>
            {REQUEST_TYPE_LABELS[request.type]} • Citizen ID: {request.citizenID}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {/* Certificate Request Note */}
          {isCertificateRequest && (
            <div className="p-4 border rounded-lg bg-blue-50 border-blue-200 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-100">Certificate Request</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                If approved, this certificate will be written to the Civil Registry.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select value={status} onValueChange={(val) => setStatus(val as RequestLifecycle)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="processingOffice">Processing Office</Label>
            <Input
              id="processingOffice"
              value={processingOffice}
              onChange={(e) => setProcessingOffice(e.target.value)}
              placeholder="e.g., Central Records Office"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="decisionReason">Decision Reason</Label>
            <Textarea
              id="decisionReason"
              value={decisionReason}
              onChange={(e) => setDecisionReason(e.target.value)}
              placeholder="Provide the reason for this status update..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Internal Comment</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add any additional notes..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusDialog;

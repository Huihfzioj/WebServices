import { AdminRequest, REQUEST_TYPE_LABELS, STATUS_LABELS, STATUS_COLORS, RequestHistory } from "@/types/request";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, Building2, MessageSquare, Loader2 } from "lucide-react";
import { useRequests } from "@/hooks/useRequests";
import { useEffect, useState } from "react";

interface RequestHistoryDialogProps {
  request: AdminRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RequestHistoryDialog = ({ request, open, onOpenChange }: RequestHistoryDialogProps) => {
  const { getRequestHistory } = useRequests();
  const [history, setHistory] = useState<RequestHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (request?.id && open) {
        setLoadingHistory(true);
        try {
          const historyData = await getRequestHistory(request.id);
          setHistory(historyData);
        } catch (error) {
          console.error("Failed to fetch history:", error);
          setHistory([]);
        } finally {
          setLoadingHistory(false);
        }
      }
    };

    fetchHistory();
  }, [request?.id, open]);

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Request History</DialogTitle>
          <DialogDescription>
            {REQUEST_TYPE_LABELS[request.type]} • Request ID: #{request.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Request Details */}
          <div className="p-4 rounded-lg border border-border bg-muted/30">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Citizen ID</p>
                <p className="font-medium">{request.citizenID}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Current Status</p>
                <Badge className={STATUS_COLORS[request.status]}>
                  {STATUS_LABELS[request.status]}
                </Badge>
              </div>
              {request.processingOffice && (
                <div className="col-span-2">
                  <p className="text-muted-foreground">Processing Office</p>
                  <p className="font-medium">{request.processingOffice}</p>
                </div>
              )}
              {request.decisionReason && (
                <div className="col-span-2">
                  <p className="text-muted-foreground">Decision Reason</p>
                  <p className="font-medium">{request.decisionReason}</p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-foreground mb-3">Status History</h4>
            {loadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="relative space-y-4">
                {history && history.length > 0 ? history.map((entry, index) => (
                <div key={entry.id} className="relative pl-6">
                  {/* Timeline line */}
                  {index !== history.length - 1 && (
                    <div className="absolute left-[9px] top-6 h-full w-0.5 bg-border" />
                  )}
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1.5 h-[18px] w-[18px] rounded-full border-2 border-primary bg-background" />
                  
                  <div className="pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={STATUS_COLORS[entry.newStatus]} variant="outline">
                        {STATUS_LABELS[entry.newStatus]}
                      </Badge>
                      {entry.oldStatus && (
                        <>
                          <span className="text-xs text-muted-foreground">from</span>
                          <Badge variant="outline" className="text-xs">
                            {STATUS_LABELS[entry.oldStatus]}
                          </Badge>
                        </>
                      )}
                    </div>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                      {entry.processingOffice && (
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {entry.processingOffice}
                        </div>
                      )}
                      {entry.actionComment && (
                        <div className="flex items-start gap-1 mt-2">
                          <MessageSquare className="h-3 w-3 mt-0.5" />
                          <span className="text-foreground">{entry.actionComment}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No history available for this request
                </p>
              )}
            </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestHistoryDialog;

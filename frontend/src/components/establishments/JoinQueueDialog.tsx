import { useState } from "react";
import { useEstablishments } from "@/hooks/useEstablishments";
import { Establishment, GovernmentService } from "@/types/establishment";
import { REQUEST_TYPE_LABELS } from "@/types/request";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ticket, Building2, MapPin } from "lucide-react";

interface JoinQueueDialogProps {
  establishment: Establishment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JoinQueueDialog = ({ establishment, open, onOpenChange }: JoinQueueDialogProps) => {
  const { joinQueue } = useEstablishments();
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState<number | null>(null);

  const selectedService = establishment?.services.find((s) => s.id === selectedServiceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!establishment || !selectedService) return;

    setIsSubmitting(true);
    
    const ticket = joinQueue(establishment.id, selectedService.type);
    
    if (ticket) {
      setGeneratedTicket(ticket.ticketNumber);
    }

    setIsSubmitting(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setSelectedServiceId("");
    setGeneratedTicket(null);
  };

  if (!establishment) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        {generatedTicket ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">Ticket Generated!</DialogTitle>
              <DialogDescription className="text-center">
                Your queue ticket has been created successfully.
              </DialogDescription>
            </DialogHeader>
            <div className="py-8 text-center">
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Ticket className="h-12 w-12 text-primary" />
              </div>
              <div className="text-5xl font-bold text-primary mb-2">
                #{generatedTicket}
              </div>
              <p className="text-muted-foreground">
                {establishment.name}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedService?.name}
              </p>
            </div>
            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                Done
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Join Queue</DialogTitle>
              <DialogDescription>
                Get a ticket to queue at this service center.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{establishment.name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {establishment.address}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="service">Select Service</Label>
                  <Select
                    value={selectedServiceId}
                    onValueChange={setSelectedServiceId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {establishment.services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!selectedService || isSubmitting}>
                    {isSubmitting ? "Generating..." : "Get Ticket"}
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JoinQueueDialog;

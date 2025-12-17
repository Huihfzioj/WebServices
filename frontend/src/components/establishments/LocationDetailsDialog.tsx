import { useState } from "react";
import { Establishment, ServiceLocation } from "@/types/establishment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Clock,
  Users,
  Ticket,
  Building2,
} from "lucide-react";
import JoinQueueDialog from "./JoinQueueDialog";

interface LocationDetailsDialogProps {
  establishment: Establishment | null;
  locationData: ServiceLocation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LocationDetailsDialog = ({
  establishment,
  locationData,
  open,
  onOpenChange,
}: LocationDetailsDialogProps) => {
  const [showJoinQueueDialog, setShowJoinQueueDialog] = useState(false);

  if (!establishment || !locationData) return null;

  const handleJoinQueue = () => {
    setShowJoinQueueDialog(true);
  };

  const handleClose = () => {
    setShowJoinQueueDialog(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open && !showJoinQueueDialog} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              {establishment.name}
            </DialogTitle>
            <DialogDescription>
              Service Center Location Details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Status
              </span>
              <Badge variant={establishment.isOpen ? "default" : "secondary"}>
                {establishment.isOpen ? "Open" : "Closed"}
              </Badge>
            </div>

            <Separator />

            {/* Address Section */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Location
              </h3>
              <div className="text-sm space-y-1 ml-6">
                <p className="font-medium">{locationData.address}</p>
                {locationData.city && (
                  <p className="text-muted-foreground">
                    {locationData.city}
                    {locationData.state && `, ${locationData.state}`}
                    {locationData.zipCode && ` ${locationData.zipCode}`}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Section */}
            <div className="space-y-3">
              <h3 className="font-semibold">Contact Information</h3>
              <div className="space-y-2 ml-0">
                {locationData.phone ? (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${locationData.phone}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {locationData.phone}
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground italic">Phone not available</span>
                  </div>
                )}
                {locationData.mail ? (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${locationData.mail}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {locationData.mail}
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground italic">Email not available</span>
                  </div>
                )}
                {locationData.website && (
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={locationData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {locationData.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Operating Hours Section */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Operating Hours
              </h3>
              {locationData.operatingHours && locationData.operatingHours.length > 0 ? (
                <div className="space-y-2 ml-6 text-sm">
                  {locationData.operatingHours.map((hours, idx) => (
                    <p key={idx} className="text-muted-foreground font-medium">
                      {hours}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground ml-6 italic">
                  Hours not available
                </p>
              )}
            </div>

            <Separator />

            {/* Queue Status */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Queue Information
              </h3>
              <div className="grid grid-cols-2 gap-4 ml-0">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Current Ticket
                  </p>
                  <p className="text-xl font-bold text-primary">
                    #{establishment.currentQueueNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="space-y-3">
              <h3 className="font-semibold">Available Services</h3>
              <div className="flex flex-wrap gap-2 ml-0">
                {establishment.services.map((service) => (
                  <Badge key={service.id} variant="outline">
                    {service.name}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Action Button */}
            <Button
              onClick={handleJoinQueue}
              className="w-full"
              disabled={!establishment.isOpen}
              size="lg"
            >
              <Ticket className="h-4 w-4 mr-2" />
              Join Queue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Join Queue Dialog */}
      <JoinQueueDialog
        establishment={establishment}
        open={showJoinQueueDialog}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setShowJoinQueueDialog(false);
          }
        }}
      />
    </>
  );
};

export default LocationDetailsDialog;

import { useState } from "react";
import { useEstablishments } from "@/hooks/useEstablishments";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, MapPin, Clock, Users, Ticket, Loader2 } from "lucide-react";
import { REQUEST_TYPE_LABELS, RequestType } from "@/types/request";
import { Establishment } from "@/types/establishment";
import { Link } from "react-router-dom";
import LocationDetailsDialog from "./LocationDetailsDialog";
import JoinQueueDialog from "./JoinQueueDialog";

const EstablishmentsList = () => {
  const { isAuthenticated } = useAuth();
  const {
    selectedLocation,
    setSelectedLocation,
    getFilteredEstablishments,
    locations,
    getEstablishmentQueue,
    loadingEstablishments,
    getLocationData,
  } = useEstablishments();

  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showJoinQueueDialog, setShowJoinQueueDialog] = useState(false);

  const establishments = getFilteredEstablishments();

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(locations) && locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">
          {loadingEstablishments
            ? "Loading establishments..."
            : `Showing ${establishments.length} establishment${establishments.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Establishments Grid */}
      {loadingEstablishments ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {establishments.map((establishment) => {
          const queueLength = getEstablishmentQueue(establishment.id).length;
          
          return (
            <Card
              key={establishment.id}
              className={`transition-all hover:shadow-lg cursor-pointer ${
                !establishment.isOpen ? "opacity-60" : ""
              }`}
              onClick={() => {
                setSelectedEstablishment(establishment);
                setShowDetailsDialog(true);
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{establishment.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {establishment.location}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={establishment.isOpen ? "default" : "secondary"}>
                    {establishment.isOpen ? "Open" : "Closed"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{establishment.address}</p>

                {/* Queue Info */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{queueLength} in queue</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Ticket className="h-4 w-4" />
                    <span>Current: #{establishment.currentQueueNumber}</span>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                    Available Services
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {establishment.services.slice(0, 3).map((service) => (
                      <Badge key={service.id} variant="outline" className="text-xs">
                        {service.name}
                      </Badge>
                    ))}
                    {establishment.services.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{establishment.services.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                {isAuthenticated ? (
                  <Button
                    className="w-full"
                    disabled={!establishment.isOpen}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEstablishment(establishment);
                      setShowJoinQueueDialog(true);
                    }}
                  >
                    <Ticket className="h-4 w-4 mr-2" />
                    Join Queue
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline" asChild onClick={(e) => e.stopPropagation()}>
                    <Link to="/auth">Sign in to join queue</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      )}

      {!loadingEstablishments && establishments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">No establishments found</h3>
            <p className="text-sm text-muted-foreground">
              Try selecting a different location filter.
            </p>
          </CardContent>
        </Card>
      )}

      <LocationDetailsDialog
        establishment={selectedEstablishment}
        locationData={selectedEstablishment ? getLocationData(selectedEstablishment.id) : null}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />

      <JoinQueueDialog
        establishment={selectedEstablishment}
        open={showJoinQueueDialog}
        onOpenChange={setShowJoinQueueDialog}
      />
    </div>
  );
};

export default EstablishmentsList;

import { useAuth } from "@/contexts/AuthContext";
import { useRequests } from "@/hooks/useRequests";
import { useEstablishments } from "@/hooks/useEstablishments";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { FileText, Ticket, Clock, CheckCircle, XCircle, Plus, Building2 } from "lucide-react";
import { REQUEST_TYPE_LABELS, STATUS_LABELS, STATUS_COLORS } from "@/types/request";
import RequestHistoryDialog from "./RequestHistoryDialog";
import { useState } from "react";
import { AdminRequest } from "@/types/request";

const UserDashboard = () => {
  const { user } = useAuth();
  const { requests, loading } = useRequests();
  const { getUserTickets, cancelTicket } = useEstablishments();
  const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(null);

  // Filter requests by citizenID (user.citizenId or user.id)
  const citizenId = user?.citizenId || Number(user?.id);
  const userRequests = requests.filter((r) => r.citizenID === citizenId);
  const tickets = getUserTickets();
  const activeTickets = tickets.filter((t) => t.status === "WAITING" || t.status === "SERVING");

  const stats = {
    total: userRequests.length,
    pending: userRequests.filter((r) => r.status === "PENDING" || r.status === "IN_REVIEW").length,
    completed: userRequests.filter((r) => r.status === "COMPLETED" || r.status === "APPROVED").length,
    rejected: userRequests.filter((r) => r.status === "REJECTED").length,
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground mt-1">
            Manage your requests and queue tickets
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link to="/submit-request">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/establishments">
              <Building2 className="h-4 w-4 mr-2" />
              Find Service Center
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Queue Tickets */}
      {activeTickets.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-primary" />
              Active Queue Tickets
            </CardTitle>
            <CardDescription>Your current queue positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeTickets.map((ticket) => (
                <Card key={ticket.id} className="bg-background">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl font-bold text-primary">
                        #{ticket.ticketNumber}
                      </span>
                      <Badge variant={ticket.status === "SERVING" ? "default" : "secondary"}>
                        {ticket.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {REQUEST_TYPE_LABELS[ticket.service]}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ticket.createdAt).toLocaleString()}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-3 text-destructive hover:text-destructive"
                      onClick={() => cancelTicket(ticket.id)}
                    >
                      Cancel Ticket
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Requests Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <RequestsList 
            requests={requests} 
            loading={loading}
            onViewHistory={(request) => setSelectedRequest(request)} 
          />
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          <RequestsList
            requests={requests.filter((r) => r.status === "PENDING" || r.status === "IN_REVIEW")}
            loading={loading}
            onViewHistory={(request) => setSelectedRequest(request)}
          />
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <RequestsList
            requests={requests.filter((r) => r.status === "COMPLETED" || r.status === "APPROVED")}
            loading={loading}
            onViewHistory={(request) => setSelectedRequest(request)}
          />
        </TabsContent>
      </Tabs>

      <RequestHistoryDialog
        request={selectedRequest}
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
      />
    </div>
  );
};

const RequestsList = ({
  requests,
  loading,
  onViewHistory,
}: {
  requests: AdminRequest[];
  loading?: boolean;
  onViewHistory: (request: AdminRequest) => void;
}) => {
  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-foreground mb-2">No requests found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You haven't submitted any requests yet
          </p>
          <Button asChild>
            <Link to="/submit-request">Submit Your First Request</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {loading && <p className="text-center text-muted-foreground">Loading requests...</p>}
      {!loading && requests.length === 0 && (
        <p className="text-center text-muted-foreground">No requests found</p>
      )}
      {requests.map((request) => (
        <Card key={request.id} className="hover:shadow-md transition-shadow">
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-foreground">
                    {REQUEST_TYPE_LABELS[request.type]}
                  </h3>
                  <Badge className={STATUS_COLORS[request.status]}>
                    {STATUS_LABELS[request.status]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Request ID: #{request.id} • Citizen ID: {request.citizenID}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Submitted: {new Date(request.createdAt!).toLocaleDateString()}
                </p>
                {request.processingOffice && (
                  <p className="text-xs text-muted-foreground">
                    Processing Office: {request.processingOffice}
                  </p>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => onViewHistory(request)}>
                View History
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserDashboard;

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRequests } from "@/hooks/useRequests";
import { UserRole } from "@/types/user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Users, Clock, CheckCircle, XCircle, UserPlus, Database } from "lucide-react";
import { REQUEST_TYPE_LABELS, STATUS_LABELS, STATUS_COLORS, AdminRequest } from "@/types/request";
import UpdateStatusDialog from "./UpdateStatusDialog";
import AddAdminDialog from "./AddAdminDialog";
import AdminsListDialog from "./AdminsListDialog";
import CivilRegistryDialog from "./CivilRegistryDialog";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { requests, loading } = useRequests();
  const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(null);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showAdminsList, setShowAdminsList] = useState(false);
  const [showCivilRegistry, setShowCivilRegistry] = useState(false);

  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "PENDING").length,
    inReview: requests.filter((r) => r.status === "IN_REVIEW").length,
    completed: requests.filter((r) => r.status === "COMPLETED" || r.status === "APPROVED").length,
    rejected: requests.filter((r) => r.status === "REJECTED").length,
  };

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <Badge variant="outline" className="text-primary border-primary">
              {isSuperAdmin ? "Super Admin" : "Admin"}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Manage requests and process citizen applications
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowCivilRegistry(true)}>
            <Database className="h-4 w-4 mr-2" />
            Civil Registry
          </Button>
          <Button variant="outline" onClick={() => setShowAdminsList(true)}>
            <Users className="h-4 w-4 mr-2" />
            View Admins
          </Button>
          <Button onClick={() => setShowAddAdmin(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Admin
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
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
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inReview}</div>
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

      {/* Requests Management */}
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="in-review">In Review ({stats.inReview})</TabsTrigger>
          <TabsTrigger value="all">All Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <AdminRequestsList
            requests={requests.filter((r) => r.status === "PENDING")}
            onProcess={(request) => setSelectedRequest(request)}
          />
        </TabsContent>
        <TabsContent value="in-review" className="mt-4">
          <AdminRequestsList
            requests={requests.filter((r) => r.status === "IN_REVIEW")}
            onProcess={(request) => setSelectedRequest(request)}
          />
        </TabsContent>
        <TabsContent value="all" className="mt-4">
          <AdminRequestsList
            requests={requests}
            onProcess={(request) => setSelectedRequest(request)}
          />
        </TabsContent>
      </Tabs>

      <UpdateStatusDialog
        request={selectedRequest}
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
      />

      <AddAdminDialog
        open={showAddAdmin}
        onOpenChange={setShowAddAdmin}
      />

      <AdminsListDialog
        open={showAdminsList}
        onOpenChange={setShowAdminsList}
      />

      <CivilRegistryDialog
        open={showCivilRegistry}
        onOpenChange={setShowCivilRegistry}
      />
    </div>
  );
};

const AdminRequestsList = ({
  requests,
  onProcess,
}: {
  requests: AdminRequest[];
  onProcess: (request: AdminRequest) => void;
}) => {
  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="font-medium text-foreground mb-2">All caught up!</h3>
          <p className="text-sm text-muted-foreground">
            No requests in this category
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className="hover:shadow-md transition-shadow">
          <CardContent className="py-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Request</p>
                  <p className="font-semibold text-foreground">
                    {REQUEST_TYPE_LABELS[request.type]}
                  </p>
                  <p className="text-sm text-muted-foreground">ID: #{request.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Citizen ID</p>
                  <p className="font-medium text-foreground">{request.citizenID}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Status</p>
                  <Badge className={STATUS_COLORS[request.status]}>
                    {STATUS_LABELS[request.status]}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Submitted</p>
                  <p className="text-sm text-foreground">
                    {new Date(request.createdAt!).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button onClick={() => onProcess(request)}>
                Process Request
              </Button>
            </div>
            {request.comment && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Comment</p>
                <p className="text-sm text-foreground">{request.comment}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminDashboard;

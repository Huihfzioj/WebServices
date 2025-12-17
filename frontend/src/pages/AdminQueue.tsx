import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AdminQueueManagement } from "@/components/admin/AdminQueueManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminQueuePage() {
  console.log("[AdminQueue] Component rendering");
  const { user } = useAuth();
  const navigate = useNavigate();

  console.log("[AdminQueue] User:", user);
  console.log("[AdminQueue] User role:", user?.role);

  // Temporarily disabled for debugging
  // useEffect(() => {
  //   console.log("[AdminQueue] User:", user);
  //   console.log("[AdminQueue] User role:", user?.role);
  //   // Redirect if not admin
  //   if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
  //     console.log("[AdminQueue] Redirecting to home - not authorized");
  //     navigate("/");
  //   } else {
  //     console.log("[AdminQueue] Access granted");
  //   }
  // }, [user, navigate]);

  // if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
  //   return null;
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Queue Management</h1>
          <p className="text-gray-600">
            Control service queues and manage customer flow in real-time
          </p>
        </div>

        {/* Main Management Component */}
        <AdminQueueManagement />

        {/* Instructions Card */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">How to Use Queue Management</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-900 space-y-2">
            <p>
              <strong>1. Select Service & Location:</strong> Choose which service queue you want to manage
            </p>
            <p>
              <strong>2. Call Next:</strong> Automatically call the first person in the queue to be served
            </p>
            <p>
              <strong>3. Complete Service:</strong> Mark a customer as finished with their service
            </p>
            <p>
              <strong>4. Skip User:</strong> Skip a customer if they need to be moved to the end of the queue
            </p>
            <p>
              <strong>5. Clear Queue:</strong> Empty the entire queue (use with caution)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

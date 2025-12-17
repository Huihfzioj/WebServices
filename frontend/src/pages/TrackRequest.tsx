import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Clock, CheckCircle, XCircle, Loader2, FileSearch } from "lucide-react";
import { RequestLifecycle } from "@/types/request";

const statusConfig = {
  [RequestLifecycle.PENDING]: {
    label: "Pending",
    color: "bg-warning/10 text-warning border-warning/20",
    icon: Clock,
  },
  [RequestLifecycle.IN_REVIEW]: {
    label: "In Review",
    color: "bg-info/10 text-info border-info/20",
    icon: Loader2,
  },
  [RequestLifecycle.APPROVED]: {
    label: "Approved",
    color: "bg-success/10 text-success border-success/20",
    icon: CheckCircle,
  },
  [RequestLifecycle.REJECTED]: {
    label: "Rejected",
    color: "bg-destructive/10 text-destructive border-destructive/20",
    icon: XCircle,
  },
  [RequestLifecycle.COMPLETED]: {
    label: "Completed",
    color: "bg-success/10 text-success border-success/20",
    icon: CheckCircle,
  },
};

const TrackRequest = () => {
  const [requestId, setRequestId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestId.trim()) return;

    setIsSearching(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSearching(false);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-12">
          <div className="max-w-2xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-10 animate-fade-up">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
                <FileSearch className="h-8 w-8" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Track Your Request
              </h1>
              <p className="text-lg text-muted-foreground">
                Enter your request ID to check the current status of your application.
              </p>
            </div>

            {/* Search Form */}
            <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="requestId">Request ID</Label>
                  <div className="flex gap-3">
                    <Input
                      id="requestId"
                      type="text"
                      placeholder="e.g., REQ-2024-00123"
                      value={requestId}
                      onChange={(e) => setRequestId(e.target.value)}
                      className="h-12 flex-1"
                    />
                    <Button type="submit" size="lg" disabled={isSearching || !requestId.trim()}>
                      {isSearching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                      Search
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You can find your request ID in the confirmation email we sent you.
                  </p>
                </div>
              </form>
            </div>

            {/* Results */}
            {hasSearched && (
              <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm animate-fade-up">
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted text-muted-foreground mb-4">
                    <FileSearch className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Request Found
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    We couldn't find a request with ID "{requestId}". Please check the ID and try again, 
                    or contact support if you need assistance.
                  </p>
                </div>
              </div>
            )}

            {/* Info */}
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <div className="bg-card rounded-xl border border-border p-5 animate-fade-up" style={{ animationDelay: "0.2s" }}>
                <h3 className="font-semibold text-foreground mb-2 text-sm">Lost Your Request ID?</h3>
                <p className="text-xs text-muted-foreground">
                  Check your email inbox for the confirmation message or contact our support team.
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-5 animate-fade-up" style={{ animationDelay: "0.3s" }}>
                <h3 className="font-semibold text-foreground mb-2 text-sm">Need Assistance?</h3>
                <p className="text-xs text-muted-foreground">
                  Call us at +1 (800) 123-4567 or email support@govserve.gov
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrackRequest;

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RequestForm from "@/components/request/RequestForm";
import { Shield, Clock, FileCheck } from "lucide-react";

const SubmitRequest = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-10 animate-fade-up">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Submit New Request
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Fill out the form below to submit your administrative request. 
                All fields marked with * are required.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
                  <RequestForm />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Info Cards */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm animate-fade-up" style={{ animationDelay: "0.1s" }}>
                  <h3 className="font-semibold text-foreground mb-4">What You Need</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <FileCheck className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                      Valid government-issued ID
                    </li>
                    <li className="flex items-start gap-2">
                      <FileCheck className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                      Supporting documents (if applicable)
                    </li>
                    <li className="flex items-start gap-2">
                      <FileCheck className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                      Valid contact information
                    </li>
                  </ul>
                </div>

                <div className="bg-accent/5 rounded-xl border border-accent/20 p-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="h-5 w-5 text-accent" />
                    <h3 className="font-semibold text-foreground">Secure Submission</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your data is encrypted and protected. We follow strict privacy guidelines.
                  </p>
                </div>

                <div className="bg-card rounded-xl border border-border p-6 shadow-sm animate-fade-up" style={{ animationDelay: "0.3s" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="h-5 w-5 text-accent" />
                    <h3 className="font-semibold text-foreground">Processing Time</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Most requests are processed within 3-5 business days. Complex requests may take longer.
                  </p>
                </div>

                {/* Help */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm animate-fade-up" style={{ animationDelay: "0.4s" }}>
                  <h3 className="font-semibold text-foreground mb-3">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our support team is available to assist you with your request.
                  </p>
                  <a
                    href="mailto:support@govserve.gov"
                    className="text-sm text-accent hover:underline font-medium"
                  >
                    Contact Support →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubmitRequest;

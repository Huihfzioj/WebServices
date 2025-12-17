import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Plane, 
  Car, 
  Building2, 
  Hammer, 
  Receipt, 
  Home, 
  Heart,
  ArrowRight,
  Clock,
  FileCheck
} from "lucide-react";
import { RequestType, REQUEST_TYPE_LABELS, REQUEST_TYPE_DESCRIPTIONS } from "@/types/request";

const iconMap: Record<RequestType, React.ElementType> = {
  [RequestType.BIRTH_CERTIFICATE]: FileText,
  [RequestType.DEATH_CERTIFICATE]: FileText,
  [RequestType.MARRIAGE_CERTIFICATE]: Heart,
  [RequestType.RESIDENCY_CERTIFICATE]: Home,
  [RequestType.PASSPORT_RENEWAL]: Plane,
  [RequestType.DRIVERS_LICENSE]: Car,
  [RequestType.BUSINESS_REGISTRATION]: Building2,
  [RequestType.BUILDING_PERMIT]: Hammer,
  [RequestType.TAX_CERTIFICATE]: Receipt,
};

const processingTimes: Record<RequestType, string> = {
  [RequestType.BIRTH_CERTIFICATE]: "3-5 days",
  [RequestType.DEATH_CERTIFICATE]: "3-5 days",
  [RequestType.MARRIAGE_CERTIFICATE]: "3-5 days",
  [RequestType.RESIDENCY_CERTIFICATE]: "2-3 days",
  [RequestType.PASSPORT_RENEWAL]: "10-15 days",
  [RequestType.DRIVERS_LICENSE]: "5-7 days",
  [RequestType.BUSINESS_REGISTRATION]: "7-14 days",
  [RequestType.BUILDING_PERMIT]: "14-30 days",
  [RequestType.TAX_CERTIFICATE]: "3-5 days",
};

const Services = () => {
  const services = Object.values(RequestType);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero py-16">
          <div className="container text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4 animate-fade-up">
              Our Services
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Browse our comprehensive range of government services available online. 
              Select a service to learn more and start your application.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((type, index) => {
                const Icon = iconMap[type];
                return (
                  <div
                    key={type}
                    className="group bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-accent/50 transition-all duration-300 animate-fade-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      <Icon className="h-7 w-7" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {REQUEST_TYPE_LABELS[type]}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {REQUEST_TYPE_DESCRIPTIONS[type]}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {processingTimes[type]}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileCheck className="h-3.5 w-3.5" />
                        Online
                      </span>
                    </div>
                    
                    <Button asChild variant="outline" className="w-full group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-colors">
                      <Link to={`/submit-request?type=${type}`}>
                        Apply Now
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/50">
          <div className="container text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              If you need assistance with a service not listed here, our support team 
              is ready to help you find the right solution.
            </p>
            <Button size="lg">
              Contact Support
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;

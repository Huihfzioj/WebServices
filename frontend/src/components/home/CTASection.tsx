import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl gradient-hero p-10 md:p-16 text-center">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-accent blur-3xl" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-secondary blur-3xl" />
          </div>

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Join thousands of citizens who are already using our platform for their administrative needs. 
              Submit your first request today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="hero" size="xl">
                <Link to="/submit-request">
                  Submit Your Request
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="hero-outline" size="xl">
                <Link to="/services">
                  View All Services
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

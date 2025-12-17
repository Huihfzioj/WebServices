import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, CheckCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container relative py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground/90 text-sm font-medium mb-6"
            style={{ animationDelay: "0.1s" }}
          >
            <Shield className="h-4 w-4" />
            Secure & Efficient Government Services
          </div>

          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Your Gateway to
            <span className="block text-accent">Digital Government</span>
          </h1>

          <p 
            className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            Submit, track, and manage your administrative requests from anywhere. 
            Experience seamless e-governance with our modern, secure platform.
          </p>

          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Button asChild variant="hero" size="xl">
              <Link to="/submit-request">
                Submit a Request
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="hero-outline" size="xl">
              <Link to="/track-request">
                Track Your Request
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div 
            className="grid grid-cols-3 gap-8 mt-16 pt-10 border-t border-primary-foreground/10 animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            {[
              { icon: CheckCircle, value: "50K+", label: "Requests Processed" },
              { icon: Clock, value: "24h", label: "Average Response Time" },
              { icon: Shield, value: "99.9%", label: "Uptime Guarantee" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="h-6 w-6 text-accent mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-primary-foreground">{stat.value}</div>
                <div className="text-sm text-primary-foreground/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import { FileEdit, Search, Bell, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: FileEdit,
    title: "Submit Your Request",
    description: "Fill out the online form with your details and required documents. Choose from various administrative services.",
  },
  {
    icon: Search,
    title: "Request Review",
    description: "Our team reviews your submission and verifies all documentation. You'll receive updates at each stage.",
  },
  {
    icon: Bell,
    title: "Get Notified",
    description: "Receive real-time notifications about your request status via email or SMS. Track progress anytime.",
  },
  {
    icon: CheckCircle,
    title: "Collect or Download",
    description: "Once approved, collect your documents at the designated office or download digital certificates.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our streamlined process makes submitting administrative requests simple and efficient.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative text-center animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-border">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent" />
                </div>
              )}

              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 text-accent mb-6 ring-4 ring-background">
                <step.icon className="h-8 w-8" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

import React from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Plane, 
  Car, 
  Building2, 
  Hammer, 
  Receipt, 
  Home, 
  Heart,
  ArrowRight
} from "lucide-react";
import { RequestType, REQUEST_TYPE_LABELS, REQUEST_TYPE_DESCRIPTIONS } from "@/types/request";
import { useEstablishments } from "@/hooks/useEstablishments";

const iconMap: Record<RequestType, React.ElementType> = {
  [RequestType.BIRTH_CERTIFICATE]: FileText,
  [RequestType.RESIDENCY_CERTIFICATE]: Home,
  [RequestType.PASSPORT_RENEWAL]: Plane,
  [RequestType.DRIVERS_LICENSE]: Car,
  [RequestType.BUSINESS_REGISTRATION]: Building2,
  [RequestType.BUILDING_PERMIT]: Hammer,
  [RequestType.TAX_CERTIFICATE]: Receipt,
  [RequestType.MARRIAGE_CERTIFICATE]: Heart,
};

const ServicesSection = () => {
  const { services, loadingServices } = useEstablishments();

  const serviceCards = services.length
    ? services
    : Object.values(RequestType).map((type) => ({
        id: type,
        type,
        name: REQUEST_TYPE_LABELS[type],
        description: REQUEST_TYPE_DESCRIPTIONS[type],
      }));

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Available Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access a wide range of government services online. Select a service to begin your application.
          </p>
        </div>

        {loadingServices ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-2 border-border border-t-accent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCards.map((svc, index) => {
              const type = (svc as any).type as RequestType;
              const Icon = iconMap[type] || FileText;
              const name = (svc as any).name || REQUEST_TYPE_LABELS[type];
              const description = (svc as any).description || REQUEST_TYPE_DESCRIPTIONS[type];
              return (
                <Link
                  key={(svc as any).id || type}
                  to={`/submit-request?type=${type}`}
                  className="group relative p-6 rounded-xl border border-border bg-card hover:border-accent/50 hover:shadow-lg transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">
                        {name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {description}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;

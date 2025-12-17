import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EstablishmentsList from "@/components/establishments/EstablishmentsList";

const Establishments = () => {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Service Establishments</h1>
          <p className="text-muted-foreground mt-2">
            Find a government service center near you and join the queue online
          </p>
        </div>
        <EstablishmentsList />
      </main>
      <Footer />
    </div>
  );
};

export default Establishments;

package com.example.CivilRegistry.Config;

import com.example.CivilRegistry.Repositories.BirthCertificateRepository;
import com.example.CivilRegistry.Repositories.CitizenRepository;
import com.example.CivilRegistry.Repositories.DeathCertificateRepository;
import com.example.CivilRegistry.Repositories.MarriageCertificateRepository;
import com.example.CivilRegistry.WS.CivilRegistryWSImpl;
import jakarta.annotation.PostConstruct;
import jakarta.xml.ws.Endpoint;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

@Component
public class SoapServerStarter {

    private final ApplicationContext context;

    public SoapServerStarter(ApplicationContext context) {
        this.context = context;
    }

    @PostConstruct
    public void startSoapServer() {

        CivilRegistryWSImpl impl = new CivilRegistryWSImpl(
                context.getBean(CitizenRepository.class),
                context.getBean(BirthCertificateRepository.class),
                context.getBean(MarriageCertificateRepository.class),
                context.getBean(DeathCertificateRepository.class)
        );

        String url = "http://localhost:8084/CivilRegistry";
        Endpoint.publish(url, impl);

        System.out.println("SOAP endpoint running at: " + url + "?wsdl");
    }
}



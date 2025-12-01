package com.example.CivilRegistry.WS;

import jakarta.xml.bind.annotation.*;
import lombok.Getter;
import lombok.Setter;

@XmlRootElement(name = "DeathCertificate")
@XmlAccessorType(XmlAccessType.FIELD)
@Getter
@Setter
public class DeathCertificateWS extends CertificateWS {
    private CitizenWS citizen;
    private String deathDate;
    private String placeOfDeath;
    private String causeOfDeath;
}


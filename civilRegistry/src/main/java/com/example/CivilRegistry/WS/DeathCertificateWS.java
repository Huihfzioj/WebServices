package com.example.CivilRegistry.WS;

import jakarta.xml.bind.annotation.*;
import lombok.Getter;
import lombok.Setter;

@XmlRootElement(name = "DeathCertificate")
@XmlAccessorType(XmlAccessType.FIELD)
@Getter
@Setter
public class DeathCertificateWS extends CertificateWS {
    @XmlElement(required = true)
    private String nationalID;
    @XmlElement(required = true)
    private String deathDate;
    @XmlElement(required = true)
    private String placeOfDeath;
    @XmlElement(required = true)
    private String causeOfDeath;
}


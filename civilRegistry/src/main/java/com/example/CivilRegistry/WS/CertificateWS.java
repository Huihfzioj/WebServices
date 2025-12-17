package com.example.CivilRegistry.WS;

import jakarta.xml.bind.annotation.*;
import lombok.Getter;
import lombok.Setter;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlSeeAlso({BirthCertificateWS.class, MarriageCertificateWS.class, DeathCertificateWS.class})
@Getter
@Setter
public abstract class CertificateWS {
    @XmlElement(required = true)
    private String certificateNumber;
    @XmlElement(required = true)
    private String registrationDate;
}


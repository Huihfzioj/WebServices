package com.example.CivilRegistry.WS;

import jakarta.xml.bind.annotation.*;
import lombok.Getter;
import lombok.Setter;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlSeeAlso({BirthCertificateWS.class, MarriageCertificateWS.class, DeathCertificateWS.class})
@Getter
@Setter
public abstract class CertificateWS {
    private Long id;
    private String certificateNumber;
    private String registrationDate;
}


package com.example.CivilRegistry.WS;

import jakarta.xml.bind.annotation.*;
import lombok.Getter;
import lombok.Setter;

@XmlRootElement(name = "BirthCertificate")
@XmlAccessorType(XmlAccessType.FIELD)
@Getter
@Setter
public class BirthCertificateWS extends CertificateWS {
    private CitizenWS child;
    private String birthDate;
    private String birthPlace;
    private String fatherName;
    private String motherName;
}


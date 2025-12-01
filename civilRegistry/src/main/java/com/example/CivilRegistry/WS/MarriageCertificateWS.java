package com.example.CivilRegistry.WS;

import jakarta.xml.bind.annotation.*;
import lombok.Getter;
import lombok.Setter;

@XmlRootElement(name = "MarriageCertificate")
@XmlAccessorType(XmlAccessType.FIELD)
@Getter
@Setter
public class MarriageCertificateWS extends CertificateWS {
    private CitizenWS spouse1;
    private CitizenWS spouse2;
    private String marriageDate;
    private String marriageLocation;
}


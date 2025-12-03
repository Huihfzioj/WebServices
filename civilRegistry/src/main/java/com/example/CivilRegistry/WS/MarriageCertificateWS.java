package com.example.CivilRegistry.WS;

import jakarta.xml.bind.annotation.*;
import lombok.Getter;
import lombok.Setter;

@XmlRootElement(name = "MarriageCertificate")
@XmlAccessorType(XmlAccessType.FIELD)
@Getter
@Setter
public class MarriageCertificateWS extends CertificateWS {
    @XmlElement(required = true)
    private String nationalIdOfSpouse1;
    @XmlElement(required = true)
    private String nationalIdOfSpouse2;
    @XmlElement(required = true)
    private String marriageDate;
    @XmlElement(required = true)
    private String marriageLocation;
}


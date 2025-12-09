package com.example.CivilRegistry.WS;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.Setter;

@XmlRootElement(name = "Citizen")
@XmlAccessorType(XmlAccessType.FIELD)
@Getter
@Setter
public class CitizenWS {
    private Long id;
    @XmlElement(required = true)
    private String nationalId;
    @XmlElement(required = true)
    private String firstName;
    @XmlElement(required = true)
    private String lastName;
    @XmlElement(required = true)
    private String birthDate;
    @XmlElement(required = true)
    private String birthPlace;
    private String fatherName;
    private String motherName;
    @XmlElement(required = true)
    private String gender;
}
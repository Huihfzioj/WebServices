package com.example.CivilRegistry.WS;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.Setter;

@XmlRootElement(name = "Citizen")
@XmlAccessorType(XmlAccessType.FIELD)
@Getter
@Setter
public class CitizenWS {
    private Long id;
    private String nationalId;
    private String firstName;
    private String lastName;
    private String birthDate;
    private String birthPlace;
    private String fatherName;
    private String motherName;
    private String gender;
}
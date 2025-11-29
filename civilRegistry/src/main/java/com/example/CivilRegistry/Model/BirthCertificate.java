package com.example.CivilRegistry.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.*;
import java.time.LocalDate;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "birth_certificates")
public class BirthCertificate extends Certificate {

    @OneToOne
    @JoinColumn(name = "child_id", nullable = false)
    private Citizen child;

    private LocalDate birthDate;
    private String birthPlace;

    private String fatherName;
    private String motherName;
}


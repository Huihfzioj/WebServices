package com.example.CivilRegistry.Model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "marriage_certificates")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MarriageCertificate extends Certificate {

    @ManyToOne
    @JoinColumn(name = "spouse1_id", nullable = false)
    private Citizen spouse1;

    @ManyToOne
    @JoinColumn(name = "spouse2_id", nullable = false)
    private Citizen spouse2;

    private LocalDate marriageDate;
    private String marriageLocation;
}
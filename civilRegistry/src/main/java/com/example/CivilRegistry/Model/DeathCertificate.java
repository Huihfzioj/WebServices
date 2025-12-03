package com.example.CivilRegistry.Model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Entity
@Table(name = "death_certificates")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DeathCertificate extends Certificate {

    @OneToOne
    @JoinColumn(name = "citizen_id", nullable = false)
    private Citizen citizen;

    private LocalDate deathDate;
    private String placeOfDeath;
    private String causeOfDeath;
}
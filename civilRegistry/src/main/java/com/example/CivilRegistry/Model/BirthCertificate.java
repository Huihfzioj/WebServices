package com.example.CivilRegistry.Model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "birth_certificates")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class BirthCertificate extends Certificate {

    @OneToOne
    @JoinColumn(name = "child_id", nullable = false)
    private Citizen child;
}

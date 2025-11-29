package com.example.CivilRegistry.Model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "citizens")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Citizen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nationalId;

    private String firstName;
    private String lastName;

    private LocalDate birthDate;

    private String birthPlace;

    private String fatherName;
    private String motherName;

    @Enumerated(EnumType.STRING)
    private String gender; // MALE / FEMALE
}

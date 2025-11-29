package com.example.CivilRegistry.Model;

import jakarta.persistence.*;

import java.time.LocalDate;

@MappedSuperclass
public abstract class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Column(unique = true)
    protected String certificateNumber;

    @Column(nullable = false)
    protected LocalDate registrationDate;
}

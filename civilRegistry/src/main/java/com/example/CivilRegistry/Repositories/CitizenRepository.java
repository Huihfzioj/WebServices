package com.example.CivilRegistry.Repositories;

import com.example.CivilRegistry.Model.Citizen;
import org.hibernate.type.descriptor.converter.spi.JpaAttributeConverter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CitizenRepository extends JpaRepository<Citizen,Long> {
    Optional<Citizen> findByNationalId(String nationalId);
}

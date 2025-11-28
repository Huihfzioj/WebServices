package com.example.PublicServices.Repository;

import com.example.PublicServices.Model.GovernmentService;
import com.example.PublicServices.Model.ServiceCategory;
import com.example.PublicServices.Model.ServiceType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GovernmentServiceRepository extends MongoRepository<GovernmentService, String> {

    Optional<GovernmentService> findByServiceCode(String serviceCode);

    List<GovernmentService> findByCategory(ServiceCategory category);

    List<GovernmentService> findByType(ServiceType type);

    List<GovernmentService> findByAvailableOnline(Boolean availableOnline);
}


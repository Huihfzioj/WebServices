package com.example.PublicServices.Repository;

import com.example.PublicServices.Model.ServiceLocation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceLocationRepository extends MongoRepository<ServiceLocation, String> {

    Optional<ServiceLocation> findByLocationCode(String locationCode);

    List<ServiceLocation> findByCity(String city);

    List<ServiceLocation> findByAvailableServiceIdsContains(String serviceId);
}


package com.example.PublicServices.Service;

import com.example.PublicServices.Model.ServiceLocation;
import com.example.PublicServices.Repository.ServiceLocationRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ServiceLocationService {
    @Autowired
    private final ServiceLocationRepository repo;

    public ServiceLocation create(ServiceLocation location) {
        return repo.save(location);
    }

    public ServiceLocation update(String id, ServiceLocation updated) {
        updated.setId(id);
        return repo.save(updated);
    }

    public ServiceLocation getById(String id) {
        return repo.findById(id).orElse(null);
    }

    public List<ServiceLocation> getAll() {
        return repo.findAll();
    }

    public List<ServiceLocation> getByCity(String city) {
        return repo.findByCity(city);
    }

    public List<ServiceLocation> getLocationsOfferingService(String serviceId) {
        return repo.findByAvailableServiceIdsContains(serviceId);
    }

    public boolean delete(String id) {
        repo.deleteById(id);
        return true;
    }
}


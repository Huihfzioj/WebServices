package com.example.PublicServices.Service;

import com.example.PublicServices.Model.GovernmentService;
import com.example.PublicServices.Model.ServiceCategory;
import com.example.PublicServices.Model.ServiceType;
import com.example.PublicServices.Repository.GovernmentServiceRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class GovernmentServiceService {
    @Autowired
    GovernmentServiceRepository repo;
    public GovernmentService create(GovernmentService service) {
        return repo.save(service);
    }

    public GovernmentService update(String id, GovernmentService updated) {
        updated.setId(id);
        updated.setLastUpdated(LocalDateTime.now());
        return repo.save(updated);
    }

    public boolean delete(String id) {
        repo.deleteById(id);
        return true;
    }

    public GovernmentService getById(String id) {
        return repo.findById(id).orElse(null);
    }

    public List<GovernmentService> getAll() {
        return repo.findAll();
    }

    public List<GovernmentService> getByCategory(ServiceCategory category) {
        return repo.findByCategory(category);
    }

    public List<GovernmentService> getByType(ServiceType type) {
        return repo.findByType(type);
    }
}

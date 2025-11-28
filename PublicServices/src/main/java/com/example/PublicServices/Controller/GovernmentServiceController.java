package com.example.PublicServices.Controller;

import com.example.PublicServices.Model.GovernmentService;
import com.example.PublicServices.Model.ServiceCategory;
import com.example.PublicServices.Model.ServiceType;
import com.example.PublicServices.Service.GovernmentServiceService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@AllArgsConstructor
public class GovernmentServiceController {
    @Autowired
    private final GovernmentServiceService service;

    @QueryMapping
    public List<GovernmentService> getAllServices() {
        return service.getAll();
    }

    @QueryMapping
    public GovernmentService getServiceById(@Argument String id) {
        return service.getById(id);
    }

    @QueryMapping
    public List<GovernmentService> getServicesByCategory(@Argument ServiceCategory category) {
        return service.getByCategory(category);
    }

    @QueryMapping
    public List<GovernmentService> getServicesByType(@Argument ServiceType type) {
        return service.getByType(type);
    }

    @MutationMapping
    public GovernmentService createService(@Argument GovernmentService input) {
        return service.create(input);
    }

    @MutationMapping
    public GovernmentService updateService(@Argument String id, @Argument GovernmentService input) {
        return service.update(id, input);
    }

    @MutationMapping
    public Boolean deleteService(@Argument String id) {
        return service.delete(id);
    }
}


package com.example.PublicServices.Controller;

import com.example.PublicServices.Model.ServiceLocation;
import com.example.PublicServices.Service.ServiceLocationService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@AllArgsConstructor
public class ServiceLocationController {
    @Autowired
    private final ServiceLocationService service;


    @QueryMapping
    public List<ServiceLocation> getAllLocations() {
        return service.getAll();
    }

    @QueryMapping
    public ServiceLocation getLocationById(@Argument String id) {
        return service.getById(id);
    }

    @QueryMapping
    public List<ServiceLocation> getLocationsByCity(@Argument String city) {
        return service.getByCity(city);
    }

    @QueryMapping
    public List<ServiceLocation> getLocationsOfferingService(@Argument String serviceId) {
        return service.getLocationsOfferingService(serviceId);
    }

    @MutationMapping
    public ServiceLocation createLocation(@Argument ServiceLocation input) {
        return service.create(input);
    }

    @MutationMapping
    public ServiceLocation updateLocation(@Argument String id, @Argument ServiceLocation input) {
        return service.update(id, input);
    }

    @MutationMapping
    public Boolean deleteLocation(@Argument String id){
        return service.delete(id);
    }
}


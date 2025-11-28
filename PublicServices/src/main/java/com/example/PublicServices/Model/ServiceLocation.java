package com.example.PublicServices.Model;

import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;
import java.util.Map;

@Document(collection = "service_locations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceLocation {

    @Id
    private String id;

    @Field("location_code")
    private String locationCode;

    private String name;
    private String address;
    private String city;
    private String state;
    private String zipCode;

    @Field("phone_number")
    private String phone;

    @Field("email")
    private String mail;

    private String website;

    @Field("operating_hours")
    private List<String> operatingHours;

    @Field("geo_coordinates")
    private GeoCoordinates coordinates;

    @Field("available_services")
    private List<String> availableServiceIds;   // references GovernmentService.id
}


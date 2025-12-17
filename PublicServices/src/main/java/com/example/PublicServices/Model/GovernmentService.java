package com.example.PublicServices.Model;

import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@Document(collection = "government_services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GovernmentService {

    @Id
    private String id;

    @Field("service_code")
    private String serviceCode;

    private String name;
    private String description;

    @Field("detailed_description")
    private String detailedDescription;

    private ServiceType type;
    private ServiceCategory category;

    @Field("required_docs")
    private List<String> requiredDocuments;

    @Field("processing_time_days")
    private Integer processingTimeDays;

    private BigDecimal fees;

    @Field("eligibility_criteria")
    private List<String> eligibilityCriteria;

    @Field("available_online")
    private Boolean availableOnline;

    @Field("online_portal_url")
    private String onlinePortalUrl;

    @Field("is_active")
    private Boolean isActive = true;

    @Field("created_date")
    private LocalDateTime createdDate;

    @Field("last_updated")
    private LocalDateTime lastUpdated;

    @PrePersist
    public void onCreate() {
        createdDate = LocalDateTime.now();
        lastUpdated = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
}


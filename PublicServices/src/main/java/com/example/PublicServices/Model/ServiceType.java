package com.example.PublicServices.Model;

import lombok.Getter;

@Getter
public enum ServiceType {
    PASSPORT_RENEWAL("Passport Renewal"),
    TAX_CERTIFICATE("Tax Certificate"),
    RESIDENCY_CERTIFICATE("Residency Certificate"),
    BUSINESS_REGISTRATION("Business Registration"),
    BIRTH_CERTIFICATE("Birth Certificate"),
    MARRIAGE_CERTIFICATE("Marriage Certificate"),
    DRIVERS_LICENSE("Driver's License"),
    BUILDING_PERMIT("Building Permit");

    private final String displayName;

    ServiceType(String displayName) {
        this.displayName = displayName;
    }
}

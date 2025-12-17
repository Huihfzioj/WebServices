package com.example.PublicServices.Model;

import lombok.Getter;

@Getter
public enum ServiceCategory {
    IDENTIFICATION("Identification Documents"),
    TAXATION("Tax Services"),
    RESIDENCY("Residency Services"),
    BUSINESS("Business Services"),
    CIVIL_REGISTRY("Civil Registry"),
    TRANSPORTATION("Transportation"),
    CONSTRUCTION("Construction and Permits"),
    HEALTH("Health Services"),
    EDUCATION("Education Services"),
    SOCIAL("Social Services");

    private final String displayName;

    ServiceCategory(String displayName) {
        this.displayName = displayName;
    }
}

package com.example.AdministrativeRequests.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateStatusDTO {
    private String decisionReason;
    private String processingOffice;
    private String comment;
}


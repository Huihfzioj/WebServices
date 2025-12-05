package com.example.AdministrativeRequests.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminRequestStatusDTO {
    private Long id;
    private String type;
    private String status;
}

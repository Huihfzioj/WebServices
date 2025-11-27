package com.example.AdministrativeRequests.DTO;

import com.example.AdministrativeRequests.Model.RequestType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateRequestDTO {
    private Long citizenId;
    private RequestType type;
    private String comment;
    private List<String> attachments;
}


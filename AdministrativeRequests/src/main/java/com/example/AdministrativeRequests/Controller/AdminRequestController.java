package com.example.AdministrativeRequests.Controller;

import com.example.AdministrativeRequests.DTO.AdminRequestStatusDTO;
import com.example.AdministrativeRequests.DTO.CreateRequestDTO;
import com.example.AdministrativeRequests.DTO.UpdateStatusDTO;
import com.example.AdministrativeRequests.Model.AdminRequest;
import com.example.AdministrativeRequests.Model.RequestHistory;
import com.example.AdministrativeRequests.Model.RequestLifecycle;
import com.example.AdministrativeRequests.Model.RequestType;
import com.example.AdministrativeRequests.Service.AdminRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class AdminRequestController {

    private final AdminRequestService service;

    @PostMapping
    public AdminRequest create(@RequestBody CreateRequestDTO dto) {
        return service.createRequest(dto);
    }

    @GetMapping("/{id}")
    public AdminRequest getById(@PathVariable Long id) {
        return service.getRequest(id);
    }

    @GetMapping("/citizen/{id}")
    public List<AdminRequest> getByCitizen(@PathVariable Long id) {
        return service.getRequestsByCitizen(id);
    }

    @GetMapping("/status/{status}")
    public List<AdminRequest> getByStatus(@PathVariable RequestLifecycle status) {
        return service.getRequestsByStatus(status);
    }


    @PutMapping("/{id}/start-review")
    public AdminRequest startReview(@PathVariable Long id, @RequestBody UpdateStatusDTO dto) {
        return service.startReview(id, dto);
    }

    @PutMapping("/{id}/approve")
    public AdminRequest approve(@PathVariable Long id, @RequestBody UpdateStatusDTO dto) {
        return service.approve(id, dto);
    }

    @PutMapping("/{id}/reject")
    public AdminRequest reject(@PathVariable Long id, @RequestBody UpdateStatusDTO dto) {
        return service.reject(id, dto);
    }

    @PutMapping("/{id}/complete")
    public AdminRequest complete(@PathVariable Long id, @RequestBody UpdateStatusDTO dto) {
        return service.complete(id, dto);
    }

    @PostMapping("/{id}/attachments")
    public AdminRequest addAttachment(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return service.addAttachment(id, file);
    }

    @GetMapping("/{id}/history")
    public List<RequestHistory> getHistory(@PathVariable Long id) {
        return service.getHistory(id);
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filterRequests(
            @RequestParam(required = false) Long citizenId,
            @RequestParam(required = false) RequestType type,
            @RequestParam(required = false) RequestLifecycle status) {

        try {
            List<AdminRequest> requests;

            if (citizenId != null) {
                requests = service.getRequestsByCitizenWithFilters(citizenId, type, status);
            } else if (type != null) {
                requests = service.getRequestsBytype(type);
            } else {
                return ResponseEntity.badRequest()
                        .body("At least one filter parameter (citizenId or type) is required");
            }

            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to filter requests: " + e.getMessage());
        }
    }
    @GetMapping("/{id}/status-summary")
    public AdminRequestStatusDTO getRequestStatus(@PathVariable Long id){
        return service.getStatusDTO(id);
    }
}


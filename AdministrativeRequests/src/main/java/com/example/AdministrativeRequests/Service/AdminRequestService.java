package com.example.AdministrativeRequests.Service;

import com.example.AdministrativeRequests.DTO.CreateRequestDTO;
import com.example.AdministrativeRequests.DTO.UpdateStatusDTO;
import com.example.AdministrativeRequests.Model.AdminRequest;
import com.example.AdministrativeRequests.Model.RequestHistory;
import com.example.AdministrativeRequests.Model.RequestLifecycle;
import com.example.AdministrativeRequests.Model.RequestType;
import com.example.AdministrativeRequests.Repository.AdminRequestRepo;
import com.example.AdministrativeRequests.Repository.ReqHistoryRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminRequestService {

    @Autowired
    AdminRequestRepo requestRepo;

    @Autowired
    ReqHistoryRepo historyRepo;

    public AdminRequest createRequest(CreateRequestDTO request){
        AdminRequest req=new AdminRequest();
        req.setCitizenID(request.getCitizenId());
        req.setType(request.getType());
        req.setComment(request.getComment());
        req.setAttachments(request.getAttachments());
        AdminRequest saved=requestRepo.save(req);
        addHistory(saved, null, RequestLifecycle.PENDING, "Request created", "CITIZEN_PORTAL");
        return saved;
    }

    public AdminRequest getRequest(Long id){
        return requestRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
    }

    public List<AdminRequest> getRequestsByCitizen(Long citizenID){
        return requestRepo.findByCitizenID(citizenID);
    }

    public List<AdminRequest> getRequestsByStatus(RequestLifecycle status){
        return requestRepo.findByStatus(status);
    }

    public List<AdminRequest> getRequestsBytype(RequestType type){
        return requestRepo.findByType(type);
    }

    public List<AdminRequest> getRequestsByCitizenWithFilters(Long citizenID, RequestType type, RequestLifecycle status) {
        if (type != null && status != null) {
            return requestRepo.findByCitizenIDAndTypeAndStatus(citizenID, type, status);
        } else if (type != null) {
            return requestRepo.findByCitizenIDAndType(citizenID, type);
        } else if (status != null) {
            return requestRepo.findByCitizenIDAndStatus(citizenID, status);
        } else {
            return requestRepo.findByCitizenID(citizenID);
        }
    }

    public AdminRequest startReview(Long id, UpdateStatusDTO dto) {
        return changeStatus(id, RequestLifecycle.IN_REVIEW, dto);
    }

    public AdminRequest approve(Long id, UpdateStatusDTO dto) {
        AdminRequest req = changeStatus(id, RequestLifecycle.APPROVED, dto);
        req.setDecisionReason(dto.getDecisionReason());
        return requestRepo.save(req);
    }

    public AdminRequest reject(Long id, UpdateStatusDTO dto) {
        AdminRequest req = changeStatus(id, RequestLifecycle.REJECTED, dto);
        req.setDecisionReason(dto.getDecisionReason());
        return requestRepo.save(req);
    }

    public AdminRequest complete(Long id, UpdateStatusDTO dto) {
        return changeStatus(id, RequestLifecycle.COMPLETED, dto);
    }

    public AdminRequest addAttachment(Long id, String fileName) {
        AdminRequest req = getRequest(id);
        req.getAttachments().add(fileName);
        return requestRepo.save(req);
    }

    public List<RequestHistory> getHistory(Long id) {
        AdminRequest req = getRequest(id);
        return req.getHistory();
    }

    private AdminRequest changeStatus(Long id, RequestLifecycle newStatus, UpdateStatusDTO dto) {
        AdminRequest req = getRequest(id);
        RequestLifecycle oldStatus = req.getStatus();
        req.setStatus(newStatus);
        req.setComment(dto.getComment());
        requestRepo.save(req);
        addHistory(req, oldStatus, newStatus, dto.getComment(), dto.getProcessingOffice());
        return req;
    }

    private void addHistory(AdminRequest req, RequestLifecycle oldStatus, RequestLifecycle newStatus,
                            String comment, String office) {

        RequestHistory history = new RequestHistory();
        history.setRequest(req);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setActionComment(comment);
        history.setProcessingOffice(office);

        historyRepo.save(history);
        req.getHistory().add(history);
    }
}
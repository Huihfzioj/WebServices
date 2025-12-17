package com.example.AdministrativeRequests.Repository;

import com.example.AdministrativeRequests.Model.AdminRequest;
import com.example.AdministrativeRequests.Model.RequestLifecycle;
import com.example.AdministrativeRequests.Model.RequestType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminRequestRepo extends JpaRepository<AdminRequest,Long> {
    List<AdminRequest> findByCitizenID(Long citizenId);

    List<AdminRequest> findByStatus(RequestLifecycle status);

    List<AdminRequest> findByType(RequestType type);

    List<AdminRequest> findByCitizenIDAndType(Long citizenID, RequestType type);
    List<AdminRequest> findByCitizenIDAndStatus(Long citizenID, RequestLifecycle status);
    List<AdminRequest> findByCitizenIDAndTypeAndStatus(Long citizenID, RequestType type, RequestLifecycle status);
}

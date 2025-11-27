package com.example.AdministrativeRequests.Repository;

import com.example.AdministrativeRequests.Model.RequestHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReqHistoryRepo extends JpaRepository<RequestHistory,Long> {
}

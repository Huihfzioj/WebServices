package com.example.AdministrativeRequests.Model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RequestHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "admin_request_id")
    private AdminRequest request;

    @Enumerated(EnumType.STRING)
    private RequestLifecycle oldStatus;

    @Enumerated(EnumType.STRING)
    private RequestLifecycle newStatus;

    private String actionComment;

    private LocalDateTime timestamp;

    private String processingOffice;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}


-- Seed sample administrative requests
USE administration;

INSERT INTO admin_request (citizenid, type, status, comment, created_at, updated_at) VALUES
(1001, 'BIRTH_CERTIFICATE', 'PENDING', 'Request for birth certificate for newborn', NOW(), NOW()),
(1002, 'MARRIAGE_CERTIFICATE', 'IN_REVIEW', 'Need marriage certificate for visa application', NOW(), NOW()),
(1003, 'DEATH_CERTIFICATE', 'APPROVED', 'Death certificate for inheritance proceedings', NOW(), NOW()),
(1004, 'RESIDENCY_CERTIFICATE', 'COMPLETED', 'Residency certificate obtained', NOW(), NOW()),
(1005, 'TAX_CERTIFICATE', 'REJECTED', 'Tax certificate request rejected - outstanding dues', NOW(), NOW()),
(1001, 'DRIVERS_LICENSE', 'PENDING', 'First time drivers license application', NOW(), NOW()),
(1006, 'PASSPORT_RENEWAL', 'IN_REVIEW', 'Passport renewal - expires next month', NOW(), NOW()),
(1007, 'BUILDING_PERMIT', 'APPROVED', 'Building permit for home renovation', NOW(), NOW()),
(1002, 'BUSINESS_REGISTRATION', 'COMPLETED', 'Business registration completed successfully', NOW(), NOW()),
(1008, 'BIRTH_CERTIFICATE', 'PENDING', 'Birth certificate for adoption process', NOW(), NOW());

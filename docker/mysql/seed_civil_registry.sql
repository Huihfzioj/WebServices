-- Seed civil registry data
USE civil_registry;

INSERT INTO citizens (national_id, first_name, last_name, gender, birth_date, birth_place, father_name, mother_name) VALUES
('TN-001-2000', 'Ahmed', 'Ben Salem', 'MALE', '2000-05-15', 'Tunis', 'Mohamed Ben Salem', 'Fatma Trabelsi'),
('TN-002-1998', 'Leila', 'Saidi', 'FEMALE', '1998-08-22', 'Sfax', 'Ali Saidi', 'Amira Khelifi'),
('TN-003-2002', 'Youssef', 'Hamdi', 'MALE', '2002-03-10', 'Sousse', 'Habib Hamdi', 'Samira Gharbi'),
('TN-004-1995', 'Salma', 'Arbi', 'FEMALE', '1995-11-30', 'Bizerte', 'Hassen Arbi', 'Najoua Ben Ali'),
('TN-005-2024', 'Rania', 'Mansouri', 'FEMALE', '2024-01-05', 'Tunis', 'Karim Mansouri', 'Sara Belaid'),
('TN-006-2023', 'Amine', 'Jebali', 'MALE', '2023-12-20', 'Ariana', 'Tarek Jebali', 'Meriem Jlassi'),
('TN-007-1990', 'Sonia', 'Gharbi', 'FEMALE', '1990-07-18', 'Monastir', 'Nabil Gharbi', 'Houda Ayari'),
('TN-008-1985', 'Kamel', 'Trabelsi', 'MALE', '1985-04-25', 'Tunis', 'Rachid Trabelsi', 'Aicha Ben Hamida');

-- Insert certificates first (parent table)
INSERT INTO certificates (id, certificate_number, registration_date) VALUES
(1, 'BIRTH-2000-001', '2000-05-20'),
(2, 'BIRTH-1998-045', '1998-08-25'),
(3, 'BIRTH-2002-089', '2002-03-15'),
(4, 'BIRTH-1995-234', '1995-12-05'),
(5, 'BIRTH-2024-012', '2024-01-08'),
(6, 'BIRTH-2023-567', '2023-12-22');

-- Then insert birth_certificates (child table)
INSERT INTO birth_certificates (id, child_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6);

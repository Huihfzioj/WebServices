-- Initialize databases for ProjetSOC microservices
CREATE DATABASE IF NOT EXISTS administration CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS civil_registry CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

GRANT ALL ON administration.* TO 'root'@'%';
GRANT ALL ON civil_registry.* TO 'root'@'%';

FLUSH PRIVILEGES;

-- Initialize MySQL databases for the application
CREATE DATABASE IF NOT EXISTS administration CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS civil_registry CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Ensure remote root user exists and can authenticate (MySQL 8)
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY '0000';
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '0000';

-- Grant privileges on created databases
GRANT ALL PRIVILEGES ON administration.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON civil_registry.* TO 'root'@'%';

FLUSH PRIVILEGES;

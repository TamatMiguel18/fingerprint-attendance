-- database/schema.sql

DROP DATABASE IF EXISTS fingerprint_db;
CREATE DATABASE fingerprint_db;
USE fingerprint_db;

-- Groups table
CREATE TABLE IF NOT EXISTS groupss (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table (Admins, Students)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255), -- Nullable for students who only use fingerprints
    role ENUM('superadmin', 'admin', 'student') DEFAULT 'student',
    group_id INT,
    status ENUM('pending', 'active') DEFAULT 'active', -- For admin approval
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groupss(id) ON DELETE SET NULL
);

-- Activities table (Attendance Blocks)
CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    group_id INT,
    requires_fingerprint BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groupss(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    activity_id INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status ENUM('present', 'absent', 'late') DEFAULT 'present',
    verified_by_fingerprint BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
);

-- Passkeys table (For WebAuthn)
CREATE TABLE IF NOT EXISTS passkeys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    webauthn_user_id VARCHAR(255) NOT NULL,
    credential_id TEXT NOT NULL,
    public_key TEXT NOT NULL,
    counter INT DEFAULT 0,
    transports TEXT, -- JSON string array
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert a default superadmin if not exists
-- Password is 'admin123' hashed with bcrypt (salt rounds 10)
INSERT IGNORE INTO users (id, name, email, password, role, status)
VALUES (1, 'Main Admin', 'admin@example.com', '$2a$10$e.w2p0yU.zT.5D/Qz598rO7y56.p6n.59j9x/bLp6s3y1b4b5k16u', 'superadmin', 'active');

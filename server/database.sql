-- Buat user/role pesona_user (jika belum ada)
CREATE USER IF NOT EXISTS 'pesona_user'@'%' IDENTIFIED BY 'ganti_password_ini';

-- Database (ganti jika perlu)
CREATE DATABASE IF NOT EXISTS pesonaai_db;
USE pesonaai_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Chats table
CREATE TABLE IF NOT EXISTS chats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic_id INT NOT NULL,
    sender ENUM('user','bot') NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Grant privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON pesonaai_db.* TO 'pesona_user'@'%';
FLUSH PRIVILEGES;

-- CATATAN: Password harus di-hash di backend (misal: bcrypt), bukan di SQL. 
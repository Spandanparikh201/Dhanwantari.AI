CREATE DATABASE IF NOT EXISTS dhanwantari;
USE dhanwantari;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consultations (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255),  -- Optional: link to user if logged in (foreign key omitted for flexibility)
    summary TEXT,
    messages JSON,
    remedy VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

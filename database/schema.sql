CREATE DATABASE IF NOT EXISTS ipm;
USE ipm;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nume VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    parola VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'chirias',
    telefon VARCHAR(15),
    verified TINYINT(1) DEFAULT 0,
    reset_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS apartamente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    adresa VARCHAR(255) NOT NULL,
    etaj INT,
    numar_camere INT,
    proprietar_id INT REFERENCES users(id) ON DELETE SET NULL, 
    observatii TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chiriasi (

    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    apartament_id INT REFERENCES apartamente(id) ON DELETE SET NULL,
    data_contract DATE NOT NULL,
    data_expirare DATE,
    document_path VARCHAR(500),
    activ TINYINT(1) DEFAULT 1,

    id INT AUTO_INCREMENT PRIMARY  KEY,

    user_id INT REFERENCES users(id) ON DELETE SET NULL, 
    user_id INT REFERENCES users(id) ON DELETE SET NULL, -- contul de login al chiriasului
    user_id INT REFERENCES users(id) ON DELETE SET NULL, --contul de login al chiriasului
    apartament_id INT REFERENCES apartamente(id) ON DELETE SET NULL, -- apartamentul in care sta
    data_contract DATE NOT NULL,  -- data de inceput al contractului
    data_expirare DATE,           -- data de sfarsit al contractului (NULL=nedeterminat)
    document_path VARCHAR(500), -- calea catre documentul scanat 
    activ TINYINT(1) DEFAULT 1, -- 1 = chirias activ, 0 = contract incheiat

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS facturi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chirias_id INT REFERENCES chiriasi(id) ON DELETE SET NULL,
    suma DECIMAL(10,2) NOT NULL,
    data_emitere DATE NOT NULL,
    scadenta DATE NOT NULL,
    platita TINYINT(1) DEFAULT 0,
    descriere TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tickets(
    id INT AUTO_INCREMENT PRIMARY KEY,
    apartament_id INT REFERENCES apartamente(id) ON DELETE SET NULL,
    creat_de INT REFERENCES users(id) ON DELETE SET NULL,
    titlu VARCHAR(100) NOT NULL,
    descriere TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
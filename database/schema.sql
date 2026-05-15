CREATE DATABASE IF NOT EXISTS ipm;
USE ipm;

-- Tabela users: 
-- toti utilizatorii aplicatiei: admin (agentie), proprietari, chiriasi
-- conturile sunt create de catre agentie nu de catre utilizatori

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nume VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    parola VARCHAR(255) NOT NULL, -- stocat ca hash bcrypt, niciodata plain text!!!
    rol VARCHAR (50) DEFAULT 'chirias', -- admin, proprietar, chirias
    telefon VARCHAR(15),
    verified      TINYINT(1) DEFAULT 0,          -- 0 = neconfirmat, 1 = email confirmat
    reset_token   VARCHAR(255),                  -- token pt "am uitat parola"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela apartmente
-- apartamentele gestionate de agentie 
-- fiecare apartament apartine unui proprietar

CREATE TABLE IF NOT EXISTS apartamente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    adresa VARCHAR(255) NOT NULL,
    etaj INT,
    numar_camere INT,
    proprietar_id INT REFERENCES users(id) ON DELETE SET NULL, 
    observatii TEXT,    -- preferintele proprietarului (ex: accepta animale, copii, etc)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela chiriasi
-- Leaga un user cu rol de chirias de un apartament 
-- un apartament poate avea mai multi chiriasi (decizia proprietarului)

CREATE TABLE IF NOT EXISTS chiriasi (
    id INT AUTO_INCREMENT PRIMARY  KEY,
<<<<<<< HEAD
    user_id INT REFERENCES users(id) ON DELETE SET NULL, -- contul de login al chiriasului
=======
    user_id INT REFERENCES users(id) ON DELETE SET NULL, --contul de login al chiriasului
>>>>>>> aa12662c126c7066ec96f4f4a7fc36a9101ed7cf
    apartament_id INT REFERENCES apartamente(id) ON DELETE SET NULL, -- apartamentul in care sta
    data_contract DATE NOT NULL,  -- data de inceput al contractului
    data_expirare DATE,           -- data de sfarsit al contractului (NULL=nedeterminat)
    document_path VARCHAR(500), -- calea catre documentul scanat 
    activ TINYINT(1) DEFAULT 1, -- 1 = chirias activ, 0 = contract incheiat
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela facturi 
-- facturile emise catre chiriasi

CREATE TABLE IF NOT EXISTS facturi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chirias_id INT REFERENCES chiriasi(id) ON DELETE SET NULL,
    suma DECIMAL(10,2) NOT NULL,
    data_emitere DATE NOT NULL,
    scadenta DATE NOT NULL,
    platita TINYINT(1) DEFAULT 0, -- 0 = neplatita, 1 = platita
    descriere TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela tickets 
-- cereri de mentenanta / probleme raportate pt apartamente 
-- vizibile atat pt proprietar cat si pt chiriasii apartamentului

CREATE TABLE IF NOT EXISTS tickets(
    id INT AUTO_INCREMENT PRIMARY KEY,
    apartament_id INT REFERENCES apartamente(id) ON DELETE SET NULL,
    creat_de INT REFERENCES users(id) ON DELETE SET NULL, -- cine a deschis ticket-ul
    titlu VARCHAR(100) NOT NULL,
    descriere TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open', -- open, in progress, resolved
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
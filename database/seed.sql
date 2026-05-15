-- date de test

USE ipm;

-- Users
-- ATENTIE!!!! 
-- Parolele sunt doar hash-uri bcrypt pentru test

INSERT INTO users (nume, email, parola, rol, telefon, verified) VALUES
('Admin Agentie','admin@ipm.ro','$2b$10$hashadminexemplu123456', 'admin', '0700000001', 1),
('Ion Popescu', 'ion@ipm.ro', '$2b$10$hashproprietarexemplu', 'proprietar', '0700000002', 1),
('Maria Ionescu', 'maria@ipm.ro', '$2b$10$hashchirias1exemplu', 'chirias', '0700000003', 1),
('Andrei Constantin','andrei@ipm.ro', '$2b$10$hashchirias2exemplu', 'chirias', '0700000004', 1);

-- Apartamente

INSERT INTO apartamente (adresa, etaj, numar_camere, proprietar_id, observatii) VALUES
('Str. Florilor 10, Cluj-Napoca',  2, 2, 2, 'Accepta animale mici. Nu accepta fumatori.'),
('Bd. Unirii 5, Cluj-Napoca', 4, 3, 2, 'Doar familii sau cupluri. Nu accepta studenti.');

-- Chiriasi

INSERT INTO chiriasi (user_id, apartament_id, data_contract, data_expirare, activ) VALUES
(3, 1, '2024-01-01', '2025-01-01', 1),
(4, 2, '2024-03-01', NULL, 1);  -- contract pe termen nedeterminat

-- Facturi 

INSERT INTO facturi (chirias_id, suma, data_emitere, scadenta, platita, descriere) VALUES
(1, 1500.00, '2024-11-01', '2024-11-15', 1, 'Chirie noiembrie 2024'),
(1, 1500.00, '2024-12-01', '2024-12-15', 0, 'Chirie decembrie 2024'),
(2, 2200.00, '2024-11-01', '2024-11-15', 1, 'Chirie noiembrie 2024'),
(2, 2200.00, '2024-12-01', '2024-12-15', 0, 'Chirie decembrie 2024');

-- Tickets

INSERT INTO tickets (apartament_id, creat_de, titlu, descriere, status) VALUES
(1, 3, 'Calorifer defect', 'Caloriferul din dormitor nu functioneaza de 3 zile.', 'open'),
(2, 4, 'Usa de la intrare', 'Usa scrâțâie tare si nu se inchide bine.',             'in_progress'),
(1, 2, 'Verificare instalatie', 'Proprietarul solicita verificare anuala instalatie.',  'resolved');

-- Database voor QR-code aanwezigheidssysteem

-- Tabel voor QR-codes
CREATE TABLE IF NOT EXISTS evenementen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    naam VARCHAR(255) NOT NULL,
    beschrijving TEXT,
    datum DATE NOT NULL,
    tijd TIME,
    locatie VARCHAR(255),
    max_deelnemers INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel voor evenement QR-codes (algemene QR-codes per evenement)
CREATE TABLE IF NOT EXISTS event_qr_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    qr_token VARCHAR(32) UNIQUE NOT NULL,
    qr_data_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES evenementen(id) ON DELETE CASCADE,
    UNIQUE KEY unique_event_qr (event_id),
    INDEX idx_qr_token (qr_token)
);

-- Tabel voor gastdeelnemers (niet-geregistreerde bezoekers)
CREATE TABLE IF NOT EXISTS gast_deelnemers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    naam VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_email (email)
);

-- tabel voor aanwezigheidsregistratie (met deelnemer_type)
CREATE TABLE IF NOT EXISTS aanwezigheid (
    id INT AUTO_INCREMENT PRIMARY KEY,
    deelnemer_id INT NOT NULL,
    event_id INT NOT NULL,
    deelnemer_type ENUM('student', 'werkzoekende', 'bedrijf', 'gast') NOT NULL,
    aanwezig_op TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    registratie_methode ENUM('QR_CODE', 'MANUAL', 'OTHER') DEFAULT 'QR_CODE',
    UNIQUE KEY unique_attendance (deelnemer_id, event_id, deelnemer_type),
    INDEX idx_event_attendance (event_id),
    INDEX idx_deelnemer_attendance (deelnemer_id),
    INDEX idx_deelnemer_type (deelnemer_type)
);
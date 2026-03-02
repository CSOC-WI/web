-- ============================================================
--  SLC Member Management — Database Schema
--  Auto-executed by MariaDB on first container start
-- ============================================================

CREATE DATABASE IF NOT EXISTS slcdb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE slcdb;

-- ── Admin Users (login accounts) ──────────────────────────────
-- passwords are bcrypt hashed (cost 12)
CREATE TABLE IF NOT EXISTS admin_users (
  id           INT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username     VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name  VARCHAR(200),
  role         ENUM('superadmin','editor') NOT NULL DEFAULT 'editor',
  active       TINYINT(1) NOT NULL DEFAULT 1,
  last_login   DATETIME,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default admin account
-- ⚠️ Change this password immediately after first login via /admin.html !
INSERT IGNORE INTO admin_users (username, password_hash, display_name, role)
VALUES ('admin',
        '$2a$12$crbncSyZR60u82t1.s0/..WqW9aXzduoVLifQ/gee2hYLsrIxPFw.',
        'ผู้ดูแลระบบ', 'superadmin');

-- ── Site Members ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS members (
  id         INT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name_th    VARCHAR(200) NOT NULL,
  name_en    VARCHAR(200),
  email      VARCHAR(254) NOT NULL,
  phone      VARCHAR(50),
  company    VARCHAR(200),
  role       ENUM('admin','editor','viewer') NOT NULL DEFAULT 'viewer',
  status     ENUM('active','inactive')       NOT NULL DEFAULT 'active',
  notes      TEXT,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                         ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_email (email),
  INDEX      idx_status (status),
  INDEX      idx_role   (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed member example
INSERT INTO members (name_th, name_en, email, phone, company, role, status)
VALUES ('ผู้ดูแลระบบ', 'System Administrator', 'admin@securitylifecycle.co.th',
        '02-257-7117', 'Security Life Cycle (SLC)', 'admin', 'active')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- ── News / Articles ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title_th   VARCHAR(300) NOT NULL,
  title_en   VARCHAR(300),
  body_th    TEXT,
  body_en    TEXT,
  category   ENUM('ข่าวสาร','บทความ','อัปเดต','กิจกรรม','แจ้งเตือน') NOT NULL DEFAULT 'ข่าวสาร',
  status     ENUM('published','draft')                                 NOT NULL DEFAULT 'draft',
  img_url    VARCHAR(500),
  link_url   VARCHAR(500),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed security news examples
INSERT INTO news (title_th, title_en, category, status, body_th) VALUES
('แจ้งเตือน: ช่องโหว่ใหม่ใน Windows (CVE-2025-0001) ควรอัปเดตทันที',
 'Alert: New Windows Vulnerability (CVE-2025-0001) — Patch Now',
 'แจ้งเตือน', 'published',
 'Microsoft ออกแพตช์ฉุกเฉินสำหรับช่องโหว่ Zero-Day ที่ส่งผลกระทบต่อ Windows ทุกเวอร์ชัน แนะนำให้รีบอัปเดตโดยทันที'),
('SLC เปิดตัวบริการ SOC-as-a-Service สำหรับ SME',
 'SLC Launches SOC-as-a-Service for SMEs',
 'ข่าวสาร', 'published',
 'Security Life Cycle เปิดตัวบริการ Security Operations Center แบบ Managed Service สำหรับองค์กรขนาดกลางและเล็ก'),
('รายงาน: Ransomware โจมตีภาคการเงินไทยเพิ่มขึ้น 40% ในปี 2568',
 'Report: Ransomware Attacks on Thai Financial Sector Up 40% in 2025',
 'บทความ', 'published',
 'รายงานล่าสุดจาก SLC Threat Intelligence ชี้ให้เห็นการเพิ่มขึ้นอย่างมีนัยสำคัญของการโจมตีด้วย Ransomware')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- ── Audit Log (#17) ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED,
  username   VARCHAR(100),
  action     VARCHAR(50) NOT NULL,
  entity     VARCHAR(50) NOT NULL,
  entity_id  INT UNSIGNED,
  detail     TEXT,
  ip_address VARCHAR(45),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_created (created_at),
  INDEX idx_entity (entity, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

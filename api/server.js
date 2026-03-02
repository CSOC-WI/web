'use strict';
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, param, query, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// file-type v16 (CJS-compatible)
const FileType = require('file-type');
const sanitizeHtml = require('sanitize-html');

// ── Sanitize text input — strip ALL HTML tags ──
function sanitize(val) {
    if (val == null) return val;
    return sanitizeHtml(String(val), { allowedTags: [], allowedAttributes: {} }).trim();
}

// ── Config ────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '3000', 10);
const DB_HOST = process.env.DB_HOST || 'mariadb';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DB_NAME = process.env.DB_NAME || 'slcdb';
const DB_USER = process.env.DB_USER || 'slcuser';
const DB_PASS = process.env.DB_PASS || '';
const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_THIS_JWT_SECRET_IN_ENV';
const JWT_COOKIE = 'slc_session';
const JWT_EXP = '8h'; // session expires after 8 hours

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
    .split(',').map(o => o.trim()).filter(Boolean);

// ── Database Pool ──────────────────────────────────────────────
let pool;

async function createPool(retries = 10, delay = 3000) {
    for (let i = 0; i < retries; i++) {
        try {
            pool = mysql.createPool({
                host: DB_HOST, port: DB_PORT, database: DB_NAME,
                user: DB_USER, password: DB_PASS,
                waitForConnections: true, connectionLimit: 10,
                queueLimit: 0, charset: 'utf8mb4',
            });
            const conn = await pool.getConnection();
            conn.release();
            console.log('[DB] Connected to MariaDB');
            return;
        } catch (err) {
            console.warn(`[DB] Attempt ${i + 1}/${retries}: ${err.message}`);
            if (i < retries - 1) await new Promise(r => setTimeout(r, delay));
        }
    }
    throw new Error('[DB] Could not connect after maximum retries');
}

// ── Helpers ────────────────────────────────────────────────────
function validationErrors(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Validation failed', details: errors.array() });
        return true;
    }
    return false;
}

function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXP });
}

function setSessionCookie(res, token) {
    res.cookie(JWT_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',  // #14: default secure=true
        sameSite: 'strict',
        maxAge: 8 * 60 * 60 * 1000, // 8 hours in ms
        path: '/',
    });
}

// ── Auth Middleware ────────────────────────────────────────────
function requireAuth(req, res, next) {
    const token = req.cookies?.[JWT_COOKIE];
    if (!token) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบ' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.clearCookie(JWT_COOKIE);
        return res.status(401).json({ error: 'Session หมดอายุ กรุณาเข้าสู่ระบบใหม่' });
    }
}

// Member validator rules
const memberRules = () => [
    body('name_th').trim().notEmpty().withMessage('กรุณาระบุชื่อ (ไทย)').isLength({ max: 200 }),
    body('name_en').optional({ nullable: true }).trim().isLength({ max: 200 }),
    body('email').trim().notEmpty().isEmail().withMessage('กรุณาระบุ Email ที่ถูกต้อง').isLength({ max: 254 }).toLowerCase(),
    body('phone').optional({ nullable: true }).trim().isLength({ max: 50 }),
    body('company').optional({ nullable: true }).trim().isLength({ max: 200 }),
    body('role').optional().isIn(['admin', 'editor', 'viewer']).withMessage('role ต้องเป็น admin, editor หรือ viewer'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('status ต้องเป็น active หรือ inactive'),
    body('notes').optional({ nullable: true }).trim().isLength({ max: 2000 }),
];

// ── CSRF Helper ───────────────────────────────────────────────
function generateCsrfToken() {
    return crypto.randomBytes(32).toString('hex');
}

function setCsrfCookie(res) {
    const token = generateCsrfToken();
    res.cookie('slc_csrf', token, {
        httpOnly: false,       // JS must read this
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 8 * 60 * 60 * 1000,
        path: '/',
    });
    return token;
}

function verifyCsrf(req, res, next) {
    const cookieToken = req.cookies?.slc_csrf;
    const headerToken = req.headers['x-csrf-token'];
    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
        return res.status(403).json({ error: 'CSRF token missing or invalid' });
    }
    next();
}

// ── Audit Logger ──────────────────────────────────────────────
async function logAudit(req, action, entity, entityId, detail = null) {
    try {
        const username = req.user?.username || 'anonymous';
        const userId = req.user?.id || null;
        const ip = req.ip || req.connection?.remoteAddress || '';
        await pool.execute(
            `INSERT INTO audit_log (user_id, username, action, entity, entity_id, detail, ip_address)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, username, action, entity, entityId, detail ? JSON.stringify(detail) : null, ip]
        );
    } catch (err) {
        console.error('[AuditLog]', err.message);
    }
}

// ── Express App ────────────────────────────────────────────────
const app = express();

app.use(helmet({ contentSecurityPolicy: false, hsts: false }));
app.use(cors({
    origin: ALLOWED_ORIGINS.length ? ALLOWED_ORIGINS : false,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-CSRF-Token'],  // #13: allow CSRF header
}));
app.use(express.json({ limit: '50kb' }));
app.use(cookieParser());
app.set('trust proxy', 'loopback, linklocal, uniquelocal');  // #11: specific trusted proxies

// Rate limiting — general
const apiLimiter = rateLimit({
    windowMs: 60 * 1000, max: 100,
    standardHeaders: true, legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
});
// Strict rate limiting for login endpoint
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 10,
    message: { error: 'เกินจำนวนครั้งที่อนุญาต กรุณารอ 15 นาทีแล้วลองใหม่' },
    standardHeaders: true, legacyHeaders: false,
});
// #15: Upload-specific rate limiting (stricter)
const uploadLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 min
    max: 10,
    message: { error: 'อัปโหลดไฟล์เร็วเกินไป กรุณารอสักครู่' },
    standardHeaders: true, legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// ═══════════════════════════════════════════════
//  AUTH ROUTES
// ═══════════════════════════════════════════════

// Health check (public)
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// ── POST /api/auth/login ──────────────────────
app.post('/api/auth/login',
    loginLimiter,
    [
        body('username').trim().notEmpty().isLength({ max: 100 }),
        body('password').notEmpty().isLength({ max: 200 }),
    ],
    async (req, res) => {
        if (validationErrors(req, res)) return;
        const { username, password } = req.body;

        try {
            const [rows] = await pool.execute(
                'SELECT * FROM admin_users WHERE username = ? AND active = 1 LIMIT 1',
                [username]
            );
            if (!rows.length) {
                return res.status(401).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
            }
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password_hash);
            if (!match) {
                return res.status(401).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
            }

            // Update last login
            await pool.execute('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [user.id]);

            const token = signToken({ id: user.id, username: user.username, role: user.role });
            setSessionCookie(res, token);
            setCsrfCookie(res);  // #13: issue CSRF token on login
            await logAudit(req, 'login', 'auth', user.id);  // #17: audit
            res.json({ message: 'เข้าสู่ระบบสำเร็จ', username: user.username, role: user.role, display_name: user.display_name });
        } catch (err) {
            console.error('[POST /api/auth/login]', err.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// ── GET /api/auth/me ──────────────────────────
app.get('/api/auth/me', requireAuth, async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, username, display_name, role, last_login FROM admin_users WHERE id = ? AND active = 1',
            [req.user.id]
        );
        if (!rows.length) {
            res.clearCookie(JWT_COOKIE);
            return res.status(401).json({ error: 'User not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('[GET /api/auth/me]', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ── POST /api/auth/logout ─────────────────────
app.post('/api/auth/logout', (_req, res) => {
    res.clearCookie(JWT_COOKIE, { path: '/' });
    res.json({ message: 'ออกจากระบบสำเร็จ' });
});

// ── POST /api/auth/change-password ───────────
app.post('/api/auth/change-password',
    requireAuth,
    verifyCsrf,
    [
        body('current_password').notEmpty(),
        body('new_password').isLength({ min: 8 }).withMessage('รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร')
            .matches(/[A-Z]/).withMessage('ต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว')
            .matches(/[a-z]/).withMessage('ต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว')
            .matches(/[0-9]/).withMessage('ต้องมีตัวเลขอย่างน้อย 1 ตัว')
            .matches(/[^A-Za-z0-9]/).withMessage('ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว'),
    ],
    async (req, res) => {
        if (validationErrors(req, res)) return;
        const { current_password, new_password } = req.body;
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM admin_users WHERE id = ? AND active = 1', [req.user.id]
            );
            if (!rows.length) return res.status(404).json({ error: 'User not found' });

            const match = await bcrypt.compare(current_password, rows[0].password_hash);
            if (!match) return res.status(401).json({ error: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });

            const hash = await bcrypt.hash(new_password, 12);
            await pool.execute('UPDATE admin_users SET password_hash = ? WHERE id = ?', [hash, req.user.id]);
            res.json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
        } catch (err) {
            console.error('[POST /api/auth/change-password]', err.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// ═══════════════════════════════════════════════
//  MEMBERS ROUTES (protected by requireAuth)
// ═══════════════════════════════════════════════

const API = '/api/members';

// ── GET /api/members ──────────────────────────
app.get(API,
    requireAuth,
    [
        query('status').optional().isIn(['active', 'inactive', 'all']),
        query('role').optional().isIn(['admin', 'editor', 'viewer', 'all']),
        query('q').optional().trim().isLength({ max: 200 }),
        query('page').optional().isInt({ min: 1 }).toInt(),
        query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    ],
    async (req, res) => {
        if (validationErrors(req, res)) return;
        const { status = 'all', role = 'all', q = '', page = 1, limit = 100 } = req.query;
        const offset = (page - 1) * limit;
        let where = [], params = [];
        if (status !== 'all') { where.push('status = ?'); params.push(status); }
        if (role !== 'all') { where.push('role = ?'); params.push(role); }
        if (q) {
            where.push('(name_th LIKE ? OR name_en LIKE ? OR email LIKE ? OR company LIKE ?)');
            const like = `%${q}%`;
            params.push(like, like, like, like);
        }
        const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
        try {
            const [[{ total }]] = await pool.execute(`SELECT COUNT(*) AS total FROM members ${whereClause}`, params);
            const [rows] = await pool.execute(
                `SELECT * FROM members ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
                [...params, limit, offset]
            );
            res.json({ data: rows, total, page, limit });
        } catch (err) {
            console.error('[GET /api/members]', err.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// ── GET /api/members/:id ──────────────────────
app.get(`${API}/:id`,
    requireAuth,
    [param('id').isInt({ min: 1 }).toInt()],
    async (req, res) => {
        if (validationErrors(req, res)) return;
        try {
            const [rows] = await pool.execute('SELECT * FROM members WHERE id = ?', [req.params.id]);
            if (!rows.length) return res.status(404).json({ error: 'Member not found' });
            res.json(rows[0]);
        } catch (err) {
            console.error('[GET /api/members/:id]', err.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// ── POST /api/members ─────────────────────────
app.post(API, requireAuth, verifyCsrf, memberRules(), async (req, res) => {
    if (validationErrors(req, res)) return;
    const { name_en = null, phone = null, company = null,
        role = 'viewer', status = 'active', notes = null } = req.body;
    const name_th = sanitize(req.body.name_th);
    const email = req.body.email; // already validated by express-validator
    try {
        const [result] = await pool.execute(
            `INSERT INTO members (name_th, name_en, email, phone, company, role, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name_th, sanitize(name_en), email, sanitize(phone), sanitize(company), role, status, sanitize(notes)]
        );
        const [rows] = await pool.execute('SELECT * FROM members WHERE id = ?', [result.insertId]);
        await logAudit(req, 'create', 'member', result.insertId, { name_th, email });
        res.status(201).json(rows[0]);
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email นี้มีอยู่ในระบบแล้ว' });
        console.error('[POST /api/members]', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ── PUT /api/members/:id ──────────────────────
app.put(`${API}/:id`, requireAuth, verifyCsrf,
    [param('id').isInt({ min: 1 }).toInt(), ...memberRules()],
    async (req, res) => {
        if (validationErrors(req, res)) return;
        const { name_en = null, phone = null, company = null,
            role = 'viewer', status = 'active', notes = null } = req.body;
        const name_th = sanitize(req.body.name_th);
        const email = req.body.email;
        try {
            const [check] = await pool.execute('SELECT id FROM members WHERE id = ?', [req.params.id]);
            if (!check.length) return res.status(404).json({ error: 'Member not found' });
            await pool.execute(
                `UPDATE members SET name_th=?, name_en=?, email=?, phone=?, company=?, role=?, status=?, notes=? WHERE id=?`,
                [name_th, sanitize(name_en), email, sanitize(phone), sanitize(company), role, status, sanitize(notes), req.params.id]
            );
            const [rows] = await pool.execute('SELECT * FROM members WHERE id = ?', [req.params.id]);
            await logAudit(req, 'update', 'member', req.params.id, { name_th, email });
            res.json(rows[0]);
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email นี้มีอยู่ในระบบแล้ว' });
            console.error('[PUT /api/members/:id]', err.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// ── DELETE /api/members/:id ───────────────────
app.delete(`${API}/:id`, requireAuth, verifyCsrf,
    [param('id').isInt({ min: 1 }).toInt()],
    async (req, res) => {
        if (validationErrors(req, res)) return;
        try {
            const [check] = await pool.execute('SELECT id, name_th FROM members WHERE id = ?', [req.params.id]);
            if (!check.length) return res.status(404).json({ error: 'Member not found' });
            await pool.execute('DELETE FROM members WHERE id = ?', [req.params.id]);
            await logAudit(req, 'delete', 'member', req.params.id, { name_th: check[0].name_th });
            res.json({ message: 'ลบสมาชิกเรียบร้อยแล้ว' });
        } catch (err) {
            console.error('[DELETE /api/members/:id]', err.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// ═══════════════════════════════════════════════
//  FILE UPLOAD
// ═══════════════════════════════════════════════

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/app/uploads';
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, unique + ext);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (_req, file, cb) => {
        // #2: removed SVG — no reliable magic bytes + XSS risk
        const allowed = /\.(jpe?g|png|gif|webp)$/i;
        if (allowed.test(path.extname(file.originalname))) return cb(null, true);
        cb(new Error('อนุญาตเฉพาะไฟล์รูปภาพ (jpg, png, gif, webp)'));
    }
});

// #2: Allowed MIME types for magic-bytes validation
const ALLOWED_IMAGE_MIMES = new Set([
    'image/jpeg', 'image/png', 'image/gif', 'image/webp'
]);

app.post('/api/upload', requireAuth, uploadLimiter, verifyCsrf, (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            const msg = err.code === 'LIMIT_FILE_SIZE'
                ? 'ไฟล์ใหญ่เกินไป (สูงสุด 5MB)'
                : err.message || 'อัปโหลดไม่สำเร็จ';
            return res.status(400).json({ error: msg });
        }
        if (!req.file) return res.status(400).json({ error: 'กรุณาเลือกไฟล์รูปภาพ' });

        // #2: Validate magic bytes
        try {
            const fileType = await FileType.fromFile(req.file.path);
            if (!fileType || !ALLOWED_IMAGE_MIMES.has(fileType.mime)) {
                // Delete suspicious file
                fs.unlink(req.file.path, () => { });
                return res.status(400).json({
                    error: 'ไฟล์ไม่ใช่รูปภาพที่ถูกต้อง (ตรวจสอบ magic bytes ไม่ผ่าน)'
                });
            }
        } catch (ftErr) {
            fs.unlink(req.file.path, () => { });
            console.error('[Upload] file-type check error:', ftErr.message);
            return res.status(500).json({ error: 'ไม่สามารถตรวจสอบไฟล์ได้' });
        }

        const url = `/uploads/${req.file.filename}`;
        await logAudit(req, 'upload', 'file', null, { filename: req.file.filename });  // #17
        res.json({ url, filename: req.file.filename });
    });
});

// ═══════════════════════════════════════════════
//  NEWS ROUTES
// ═══════════════════════════════════════════════

const NEWS = '/api/news';

// News validation rules
const newsRules = () => [
    body('title_th').trim().notEmpty().withMessage('กรุณาระบุหัวข้อ (ไทย)').isLength({ max: 300 }),
    body('title_en').optional({ nullable: true }).trim().isLength({ max: 300 }),
    body('body_th').optional({ nullable: true }).trim().isLength({ max: 10000 }),
    body('body_en').optional({ nullable: true }).trim().isLength({ max: 10000 }),
    body('category').optional().isIn(['ข่าวสาร', 'บทความ', 'อัปเดต', 'กิจกรรม', 'แจ้งเตือน']),
    body('status').optional().isIn(['published', 'draft']),
    // #18: validate URL format when provided (allow /uploads/ relative paths too)
    body('img_url').optional({ nullable: true }).trim().isLength({ max: 500 })
        .custom(v => !v || v.startsWith('/uploads/') || /^https?:\/\/.+/.test(v))
        .withMessage('img_url ต้องเป็น URL ที่ถูกต้อง'),
    body('link_url').optional({ nullable: true }).trim().isLength({ max: 500 })
        .custom(v => !v || /^https?:\/\/.+/.test(v))
        .withMessage('link_url ต้องเป็น URL ที่ถูกต้อง'),
];

// ── GET /api/news ─── PUBLIC: published news for website ticker ──
app.get(NEWS, async (_req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT id, title_th, title_en, category, img_url, link_url, created_at
             FROM news WHERE status = 'published'
             ORDER BY created_at DESC LIMIT 50`
        );
        res.json({ data: rows });
    } catch (err) {
        console.error('[GET /api/news]', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// #7: /api/news/all MUST be defined BEFORE /api/news/:id to avoid param collision
// ── GET /api/news/all ─── ADMIN: all news including drafts ──────
app.get(`${NEWS}/all`, requireAuth, async (req, res) => {
    try {
        const q = (req.query.q || '').trim();
        const status = req.query.status || 'all';
        let where = [], params = [];
        if (status !== 'all') { where.push('status = ?'); params.push(status); }
        if (q) {
            where.push('(title_th LIKE ? OR title_en LIKE ?)');
            params.push(`%${q}%`, `%${q}%`);
        }
        const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
        const [rows] = await pool.execute(
            `SELECT * FROM news ${whereClause} ORDER BY created_at DESC LIMIT 200`, params
        );
        res.json({ data: rows });
    } catch (err) {
        console.error('[GET /api/news/all]', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ── GET /api/news/:id ─── PUBLIC: single published news detail ───
app.get(`${NEWS}/:id`, [param('id').isInt({ min: 1 }).toInt()], async (req, res) => {
    if (validationErrors(req, res)) return;
    try {
        const [rows] = await pool.execute(
            `SELECT id, title_th, title_en, body_th, body_en, category,
                    img_url, link_url, created_at, updated_at
             FROM news WHERE id = ? AND status = 'published'`,
            [req.params.id]
        );
        if (!rows.length) return res.status(404).json({ error: 'News not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error('[GET /api/news/:id]', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ── POST /api/news ────────────────────────────────────────────────
app.post(NEWS, requireAuth, verifyCsrf, newsRules(), async (req, res) => {
    if (validationErrors(req, res)) return;
    const { category = 'ข่าวสาร', status = 'draft', img_url = null, link_url = null } = req.body;
    const title_th = sanitize(req.body.title_th);
    const title_en = sanitize(req.body.title_en) || null;
    const body_th = sanitize(req.body.body_th) || null;
    const body_en = sanitize(req.body.body_en) || null;
    try {
        const [result] = await pool.execute(
            `INSERT INTO news (title_th, title_en, body_th, body_en, category, status, img_url, link_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title_th, title_en, body_th, body_en, category, status, img_url, link_url]
        );
        const [rows] = await pool.execute('SELECT * FROM news WHERE id = ?', [result.insertId]);
        await logAudit(req, 'create', 'news', result.insertId, { title_th });  // #17
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error('[POST /api/news]', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ── PUT /api/news/:id ─────────────────────────────────────────────
app.put(`${NEWS}/:id`, requireAuth, verifyCsrf,
    [param('id').isInt({ min: 1 }).toInt(), ...newsRules()],
    async (req, res) => {
        if (validationErrors(req, res)) return;
        const { category = 'ข่าวสาร', status = 'draft', img_url = null, link_url = null } = req.body;
        const title_th = sanitize(req.body.title_th);
        const title_en = sanitize(req.body.title_en) || null;
        const body_th = sanitize(req.body.body_th) || null;
        const body_en = sanitize(req.body.body_en) || null;
        try {
            const [check] = await pool.execute('SELECT id, img_url FROM news WHERE id = ?', [req.params.id]);
            if (!check.length) return res.status(404).json({ error: 'News not found' });

            // #8: Delete old uploaded image if being replaced
            const oldImg = check[0].img_url;
            if (oldImg && img_url !== oldImg && oldImg.startsWith('/uploads/')) {
                const oldPath = path.join(UPLOAD_DIR, path.basename(oldImg));
                fs.unlink(oldPath, () => { });
            }

            await pool.execute(
                `UPDATE news SET title_th=?, title_en=?, body_th=?, body_en=?,
                 category=?, status=?, img_url=?, link_url=? WHERE id=?`,
                [title_th, title_en, body_th, body_en, category, status, img_url, link_url, req.params.id]
            );
            const [rows] = await pool.execute('SELECT * FROM news WHERE id = ?', [req.params.id]);
            await logAudit(req, 'update', 'news', req.params.id, { title_th });  // #17
            res.json(rows[0]);
        } catch (err) {
            console.error('[PUT /api/news/:id]', err.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// ── DELETE /api/news/:id ──────────────────────────────────────────
app.delete(`${NEWS}/:id`, requireAuth, verifyCsrf,
    [param('id').isInt({ min: 1 }).toInt()],
    async (req, res) => {
        if (validationErrors(req, res)) return;
        try {
            const [check] = await pool.execute('SELECT id, title_th, img_url FROM news WHERE id = ?', [req.params.id]);
            if (!check.length) return res.status(404).json({ error: 'News not found' });

            // #8: Delete uploaded image file from disk
            const imgUrl = check[0].img_url;
            if (imgUrl && imgUrl.startsWith('/uploads/')) {
                const filePath = path.join(UPLOAD_DIR, path.basename(imgUrl));
                fs.unlink(filePath, (err) => {
                    if (err && err.code !== 'ENOENT') console.error('[DELETE news] file cleanup:', err.message);
                });
            }

            await pool.execute('DELETE FROM news WHERE id = ?', [req.params.id]);
            await logAudit(req, 'delete', 'news', req.params.id, { title_th: check[0].title_th });  // #17
            res.json({ message: 'ลบข่าวเรียบร้อยแล้ว' });
        } catch (err) {
            console.error('[DELETE /api/news/:id]', err.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// ── 404 & Error handlers ─────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
    console.error('[Error]', err.message);
    // #16: Never leak stack traces or internal details in production
    const message = process.env.NODE_ENV === 'development'
        ? err.message
        : 'Internal server error';
    res.status(500).json({ error: message });
});

// ── Start ─────────────────────────────────────
(async () => {
    await createPool();
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`[API] SLC Member API listening on port ${PORT}`);
    });
})();

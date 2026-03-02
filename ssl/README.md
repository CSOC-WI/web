# SSL Certificates & Admin Authentication

วางไฟล์ certificate สำหรับ `securitylifecycle.one.th` ในโฟลเดอร์นี้

## Required SSL Files

| ไฟล์ | คำอธิบาย |
|------|---------|
| `star_one_th.crt` | SSL Certificate (หรือ fullchain.pem) |
| `Private_key_star_one_th.key` | Private Key |

## วิธีการ — SSL Certificate

### กรณีที่ 1: มี Certificate จาก CA แล้ว
```bash
cp /path/to/your.crt ssl/star_one_th.crt
cp /path/to/your.key ssl/Private_key_star_one_th.key
```

### กรณีที่ 2: ใช้ Let's Encrypt (Certbot)
```bash
certbot certonly --standalone -d securitylifecycle.one.th

# จากนั้น copy ไฟล์
cp /etc/letsencrypt/live/securitylifecycle.one.th/fullchain.pem ssl/star_one_th.crt
cp /etc/letsencrypt/live/securitylifecycle.one.th/privkey.pem   ssl/Private_key_star_one_th.key
```

### กรณีที่ 3: Self-Signed (สำหรับ dev/test เท่านั้น)
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/Private_key_star_one_th.key \
  -out    ssl/star_one_th.crt \
  -subj "/CN=securitylifecycle.one.th"
```

---

## 🔐 Admin Panel Authentication (.htpasswd)

Admin Panel (/admin.html) ถูกป้องกันด้วย Nginx HTTP Basic Auth  
ต้องสร้างไฟล์ `.htpasswd` ใน root ของโปรเจกต์ก่อน deploy:

### วิธีสร้าง .htpasswd

**วิธีที่ 1: ใช้ htpasswd (Apache Utils)**
```bash
# ติดตั้ง (Linux/Mac)
sudo apt-get install apache2-utils   # Ubuntu/Debian
brew install httpd                   # macOS

# สร้างไฟล์ (เปลี่ยน YOUR_STRONG_PASSWORD เป็นรหัสผ่านจริง)
htpasswd -nb admin YOUR_STRONG_PASSWORD > .htpasswd
```

**วิธีที่ 2: ใช้ Docker (ไม่ต้องติดตั้งเพิ่ม)**
```bash
docker run --rm httpd:alpine htpasswd -nb admin YOUR_STRONG_PASSWORD > .htpasswd
```

**วิธีที่ 3: Python (ถ้ามี Python)**
```bash
python3 -c "import crypt; print('admin:' + crypt.crypt('YOUR_STRONG_PASSWORD', crypt.mksalt(crypt.METHOD_SHA512)))" > .htpasswd
```

### ข้อกำหนดรหัสผ่านที่ปลอดภัย
- ความยาวอย่างน้อย 16 ตัวอักษร
- ผสมตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และสัญลักษณ์
- ตัวอย่าง: `SLC-Admin@2025!Secure#`

---

## รัน Docker หลังวาง Certificate และสร้าง .htpasswd

```bash
docker compose up -d --build
```

> ⚠️ อย่า commit ไฟล์ .crt, .key, และ .htpasswd เข้า git

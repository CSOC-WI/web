/* ============================================================
   SLC - Security Life Cycle | main.js
   Handles: Navbar, Hero Slider, Tabs, Scroll Animations, Stats
   ============================================================ */

// ── NAVBAR SCROLL ───────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Back to top
  const btn = document.getElementById('back-to-top');
  if (window.scrollY > 400) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }
});

// ── HAMBURGER TOGGLE ────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

function closeMobile() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

// ── HERO SLIDER ─────────────────────────────────────────────
let currentSlide = 0;
const totalSlides = 3;
let sliderInterval;

function goToSlide(index) {
  // Remove active from current
  document.getElementById(`slide-${currentSlide}`).classList.remove('active');
  document.querySelectorAll('.hero-dot')[currentSlide].classList.remove('active');

  // Set new
  currentSlide = index;
  document.getElementById(`slide-${currentSlide}`).classList.add('active');
  document.querySelectorAll('.hero-dot')[currentSlide].classList.add('active');
}

function nextSlide() {
  goToSlide((currentSlide + 1) % totalSlides);
}

function startAutoSlide() {
  sliderInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
  clearInterval(sliderInterval);
}

// Auto slide
startAutoSlide();

// Pause on hover
const heroEl = document.getElementById('hero');
if (heroEl) {
  heroEl.addEventListener('mouseenter', stopAutoSlide);
  heroEl.addEventListener('mouseleave', startAutoSlide);
}

// ── WHY SLC TABS ────────────────────────────────────────────
function switchTab(index) {
  // Remove active from all tabs
  document.querySelectorAll('.why-tab').forEach((t, i) => {
    t.classList.toggle('active', i === index);
  });

  // Show correct panel
  document.querySelectorAll('.why-panel').forEach((p, i) => {
    p.classList.toggle('active', i === index);
  });
}

// ── SCROLL REVEAL ANIMATION ──────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

// ── COUNTER ANIMATION ────────────────────────────────────────
function animateCounter(el, target, suffix = '') {
  const duration = 1800;
  const start = performance.now();
  const startVal = 0;

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out quad
    const eased = 1 - (1 - progress) * (1 - progress);
    const current = Math.floor(startVal + (target - startVal) * eased);
    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target + suffix;
    }
  }
  requestAnimationFrame(update);
}

const statsSection = document.getElementById('stats');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      const suffix = el.closest('.stat-item')?.querySelector('.stat-label')
        ?.textContent.includes('%') ? '+' : '+';
      animateCounter(el, target, '+');
    });
  }
}, { threshold: 0.4 });

if (statsSection) statsObserver.observe(statsSection);

// ── SMOOTH NAV LINKS ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── ACTIVE NAV HIGHLIGHT ─────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── CONTACT FORM ─────────────────────────────────────────────
function handleSubmit(e) {
  e.preventDefault();

  const btn = e.target.querySelector('.form-submit');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="ri-loader-4-line"></i> กำลังส่ง...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  // Simulate send (replace with real API call)
  setTimeout(() => {
    btn.innerHTML = '<i class="ri-check-line"></i> ส่งข้อความสำเร็จ!';
    btn.style.background = '#22c55e';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      btn.style.opacity = '';
      btn.style.background = '';
      e.target.reset();
    }, 3000);
  }, 1500);
}

// ── LANGUAGE TOGGLE (i18n) ───────────────────────────────────
const translations = {
  th: {
    // Meta
    'page-title': 'SLC - Security Life Cycle | ผู้ให้บริการ Cyber Security ครบวงจร',
    // Navbar
    'nav-home': 'หน้าแรก',
    'nav-about': 'เกี่ยวกับเรา',
    'nav-services': 'บริการ',
    'nav-contact': 'ติดต่อเรา',
    'nav-cta': 'ปรึกษาผู้เชี่ยวชาญ',
    // Mobile menu
    'mob-home': 'หน้าแรก',
    'mob-about': 'เกี่ยวกับเรา',
    'mob-services': 'บริการ',
    'mob-why': 'ทำไมต้อง SLC',
    'mob-cert': 'การรับรอง',
    'mob-contact': 'ติดต่อเรา',
    'mob-cta': 'ปรึกษาผู้เชี่ยวชาญฟรี',
    // Hero slide 1
    'hero1-tag': 'Cyber Security ครบวงจร',
    'hero1-h1': 'ปกป้องธุรกิจของคุณ<br>จาก<span class="accent"> ภัยคุกคามไซเบอร์</span>',
    'hero1-p': 'Security Life Cycle (SLC) ให้บริการด้านความปลอดภัยทางไซเบอร์แบบครบวงจร ตั้งแต่การประเมินความเสี่ยง การป้องกัน การตรวจจับ และการตอบสนองต่อภัยคุกคาม ตลอด 24 ชั่วโมง',
    'hero1-btn1': 'ดูบริการของเรา',
    'hero1-btn2': 'ปรึกษาผู้เชี่ยวชาญ',
    // Hero slide 2
    'hero2-tag': 'CSOC As a Service',
    'hero2-h1': 'เฝ้าระวังภัยคุกคาม<br><span class="accent">ตลอด 24 ชั่วโมง</span>',
    'hero2-p': 'ศูนย์เฝ้าระวังภัยคุกคามทางไซเบอร์ (CSOC) พร้อมทีมผู้เชี่ยวชาญที่ตรวจจับ วิเคราะห์ และตอบสนองต่อภัยคุกคามแบบเรียลไทม์ ด้วย AI และ Machine Learning',
    'hero2-btn1': 'เรียนรู้เพิ่มเติม',
    'hero2-btn2': 'ติดต่อเรา',
    // Hero slide 3
    'hero3-tag': 'ISO/IEC 27001:2022 Certified',
    'hero3-h1': 'มาตรฐานระดับสากล<br><span class="accent">ที่คุณไว้วางใจได้</span>',
    'hero3-p': 'ได้รับการรับรอง ISO/IEC 27001:2022 และ CSA STAR Certification การรักษาความมั่นคงปลอดภัยทางสารสนเทศตามมาตรฐานสากลที่องค์กรชั้นนำทั่วโลกให้การยอมรับ',
    'hero3-btn1': 'ดูการรับรอง',
    'hero3-btn2': 'ติดต่อเรา',
    'scroll-down': 'เลื่อนลง',
    // About
    'about-tag': 'เกี่ยวกับเรา',
    'about-h2': 'Security Life Cycle<br><span class="text-gradient">บริษัทในเครือ INET</span>',
    'about-p': 'บริษัท Security Life Cycle (SLC) เป็นบริษัทในเครือ INET เพื่อดูแลกลุ่มลูกค้าและให้บริการด้าน Cyber Security ครบวงจร โดยให้บริการด้านความปลอดภัยทางไซเบอร์ เพื่อมุ่งเน้นการรักษาความปลอดภัย ตั้งแต่การประเมินความเสี่ยง การป้องกัน การตรวจจับ และการตอบสนองต่อภัยคุกคาม ตลอดจนการฟื้นฟู และพัฒนาเพื่อให้ระบบขององค์กรมีความปลอดภัยสูงสุด',
    'about-btn1': 'ดูบริการทั้งหมด',
    'about-btn2': 'ปรึกษาผู้เชี่ยวชาญ',
    'about-stat1': 'เฝ้าระวังตลอดเวลา',
    'about-stat2': 'บริการ Security',
    'about-stat3': '27001:2022 Certified',
    'about-stat4': 'บริษัทในเครือ',
    // Services
    'svc-tag': 'บริการของเรา',
    'svc-h2': 'Cyber Security ครบวงจร',
    'svc-p': 'เราให้บริการด้านความปลอดภัยทางไซเบอร์ครอบคลุมทุกมิติ เพื่อปกป้องธุรกิจและองค์กรของคุณจากภัยคุกคามในทุกรูปแบบ',
    'svc1-p': 'ระบบสำรองข้อมูลและกู้คืนระบบสำหรับธุรกิจ ด้วยโซลูชัน Backup & Disaster Recovery ที่ครบวงจร ช่วยให้ธุรกิจสามารถกู้คืนระบบได้อย่างรวดเร็ว',
    'svc2-p': 'ระบบบริหารจัดการ Log ที่ช่วยรวบรวม จัดเก็บ วิเคราะห์ และตรวจสอบ Event จากระบบต่างๆ เพื่อการตรวจสอบ Compliance และค้นหาภัยคุกคาม',
    'svc3-p': 'เพิ่มความปลอดภัยในการเข้าถึงระบบด้วย MFA ยืนยันตัวตนหลายชั้น ป้องกันการเข้าถึงโดยไม่ได้รับอนุญาต แม้รหัสผ่านจะถูกขโมย',
    'svc4-p': 'ทดสอบเจาะระบบโดยผู้เชี่ยวชาญเพื่อค้นหาช่องโหว่ก่อนที่แฮกเกอร์จะค้นพบ ด้วยกระบวนการทดสอบมาตรฐานสากลที่ครอบคลุมทุกเลเยอร์',
    'svc5-p': 'ปกป้องเว็บแอปพลิเคชันจาก SQL Injection, XSS และการโจมตีรูปแบบอื่นๆ ด้วย Web Application Firewall และการสแกนช่องโหว่แบบเรียลไทม์',
    'svc6-p': 'Security Information and Event Management ระบบรวบรวมและวิเคราะห์ข้อมูล Security Log จากทั่วทั้งองค์กร เพื่อตรวจจับภัยคุกคามได้อย่างรวดเร็ว',
    'svc7-p': 'ปกป้องอุปกรณ์ปลายทาง ไม่ว่าจะเป็น PC, Laptop, Mobile ด้วยระบบ EDR/XDR ที่ใช้ AI ตรวจจับและตอบสนองต่อภัยคุกคามอัตโนมัติ',
    'svc8-p': 'ศูนย์เฝ้าระวังภัยคุกคามทางไซเบอร์แบบ Managed Service ตลอด 24 ชั่วโมง ด้วยทีมผู้เชี่ยวชาญและเทคโนโลยี AI ที่ตรวจจับและตอบสนองต่อภัยคุกคามแบบเรียลไทม์',
    'learn-more': 'เรียนรู้เพิ่มเติม',
    // Why SLC
    'why-tag': 'ทำไมต้อง SLC',
    'why-h2': 'เหตุใดองค์กรชั้นนำเลือก SLC',
    'why-p': 'เรามุ่งมั่นส่งมอบความปลอดภัยทางไซเบอร์ระดับโลก ด้วยทีมผู้เชี่ยวชาญที่มีประสบการณ์และเทคโนโลยีที่ล้ำสมัย',
    'tab0-name': 'รับรองความปลอดภัย',
    'tab1-name': 'มาตรฐานระดับสากล',
    'tab2-name': 'พัฒนาอย่างต่อเนื่อง',
    'tab3-name': 'เชื่อถือได้',
    'tab4-name': 'รวดเร็ว',
    'tab5-name': 'ลดค่าใช้จ่าย',
    'tab6-name': 'ปลอดภัย',
    'tab7-name': 'บริการที่หลากหลาย',
    'tab0-h': 'รับรองความปลอดภัย',
    'tab0-p': 'ได้รับการรับรอง CSA STAR Certification การรักษาความมั่นคงปลอดภัยทางสารสนเทศตามมาตรฐานสากล ISO/IEC 27001:2022 เพื่อให้มั่นใจว่าบริการของเรามีมาตรฐานความปลอดภัยสูงสุดที่องค์กรชั้นนำทั่วโลกยอมรับ',
    'tab1-h': 'มาตรฐานระดับสากล',
    'tab1-p': 'ได้รับการรับรองการควบคุมคุณภาพการให้บริการตามมาตรฐานสากล ISO/IEC 20000-1:2018 Service Management System (SMS) รับรองคุณภาพบริการในระดับมาตรฐานโลก',
    'tab2-h': 'พัฒนาอย่างต่อเนื่อง',
    'tab2-p': 'เนื่องจากภัยคุกคามทางไซเบอร์มีการพัฒนาและวิวัฒนาการตลอดเวลา โดยทาง SLC จะดำเนินการติดตามและอัปเดตข่าวสารเกี่ยวกับภัยคุกคามทางไซเบอร์ให้กับผู้ใช้บริการอยู่เสมอ พร้อมทั้งวิธีรับมือและวิธีแก้ไขปัญหา',
    'tab3-h': 'เชื่อถือได้',
    'tab3-p': 'เพิ่มความเชื่อมั่นและความน่าเชื่อถือให้กับองค์กรหรือธุรกิจในด้านความปลอดภัยของข้อมูล ลดความเสียหาย และความเสี่ยงจากการถูกขโมยข้อมูลหรือโจมตีจากผู้ไม่หวังดี',
    'tab4-h': 'รวดเร็ว',
    'tab4-p': 'มีการตอบสนองต่อเหตุการณ์ภัยคุกคามอย่างรวดเร็วและทันท่วงที เพื่อแก้ไขปัญหาที่อาจทำให้องค์กรหยุดชะงัก และเพื่อลดความเสียหายที่อาจเกิดขึ้นกับองค์กรได้',
    'tab5-h': 'ลดค่าใช้จ่าย',
    'tab5-p': 'มีทางเลือกที่ยืดหยุ่น ช่วยลดค่าใช้จ่ายให้เหมาะสำหรับองค์กรหรือธุรกิจที่ต้องการระบบ IT ที่ใช้งานง่ายและไม่ต้องเป็นกังวลในเรื่องค่าใช้จ่ายเริ่มต้น โดยคิดค่าบริการแบบ Pay per use',
    'tab6-h': 'ปลอดภัย',
    'tab6-p': 'มีการสังเกตการณ์และเฝ้าระวังเหตุการณ์ต่างๆ จากภัยคุกคามทางไซเบอร์ตลอด 24 ชั่วโมง เพื่อความปลอดภัยขององค์กรหรือธุรกิจที่ขับเคลื่อนด้วยเทคโนโลยีสมัยใหม่',
    'tab7-h': 'บริการที่หลากหลาย',
    'tab7-p': 'มีบริการที่ควบคุมตั้งแต่วิเคราะห์ความเสี่ยง การกำหนดแนวทางการป้องกัน การดำเนินการเสริมความปลอดภัย ตลอดจนการตรวจสอบและปรับปรุงระบบ เพื่อมั่นใจว่าสามารถรับมือกับภัยคุกคามได้อย่างมีประสิทธิภาพ',
    // Stats
    'stat1-label': 'ลูกค้าองค์กรที่ไว้วางใจ',
    'stat2-label': 'ชั่วโมงเฝ้าระวังต่อวัน',
    'stat3-label': '% SLA Uptime Guarantee',
    'stat4-label': 'บริการ Cyber Security',
    // Certifications
    'cert-tag': 'การรับรอง',
    'cert-h2': 'ได้รับการรับรองมาตรฐาน',
    'cert-p': 'SLC ได้รับการรับรองจากองค์กรมาตรฐานสากลชั้นนำ เพื่อยืนยันคุณภาพการให้บริการที่องค์กรชั้นนำทั่วโลกให้ความไว้วางใจ',
    'cert1-p': 'การรักษาความมั่นคงปลอดภัยทางสารสนเทศตาม Cloud Security Alliance (CSA) มาตรฐานความปลอดภัยสำหรับคลาวด์ระดับสากล',
    'cert2-p': 'มาตรฐานระบบบริหารจัดการความปลอดภัยของข้อมูล (ISMS) ที่ได้รับการยอมรับในระดับสากล เพื่อปกป้องข้อมูลขององค์กรอย่างมีระบบ',
    'cert3-p': 'มาตรฐานระบบบริหารจัดการบริการ (SMS) ที่รับรองคุณภาพการควบคุมและการให้บริการด้าน IT ในระดับมาตรฐานโลก',
    // Contact
    'contact-tag': 'ติดต่อเรา',
    'contact-h2': 'พร้อมให้คำปรึกษา<br><span class="text-gradient">ด้าน Cyber Security</span>',
    'contact-p': 'ทีมผู้เชี่ยวชาญของเรายินดีให้คำปรึกษาและออกแบบโซลูชันที่เหมาะสมสำหรับองค์กรของคุณ ติดต่อเราได้เลย',
    'contact-addr-h': 'ที่อยู่',
    'contact-addr': 'บริษัท Security Life Cycle (SLC)<br>บริษัทในเครือ INET กรุงเทพมหานคร',
    'contact-tel-h': 'โทรศัพท์',
    'contact-email-h': 'อีเมล',
    'contact-hours-h': 'เวลาทำการ',
    'contact-hours': 'จันทร์ – ศุกร์ 08:30 – 17:30 น.<br>CSOC เฝ้าระวัง 24 ชั่วโมง',
    'form-h3': 'ส่งข้อความหาเรา',
    'form-name-l': 'ชื่อ – นามสกุล *',
    'form-name-ph': 'กรอกชื่อของคุณ',
    'form-comp-l': 'ชื่อบริษัท / องค์กร',
    'form-comp-ph': 'บริษัทของคุณ',
    'form-email-l': 'อีเมล *',
    'form-phone-l': 'เบอร์โทรศัพท์',
    'form-svc-l': 'บริการที่สนใจ',
    'form-svc-ph': '-- เลือกบริการ --',
    'form-msg-l': 'ข้อความ / รายละเอียดเพิ่มเติม *',
    'form-msg-ph': 'อธิบายความต้องการหรือปัญหาที่พบ...',
    'form-submit': 'ส่งข้อความ',
    // Footer
    'footer-desc': 'Security Life Cycle (SLC) ผู้ให้บริการ Cyber Security ครบวงจร บริษัทในเครือ INET มุ่งมั่นปกป้องธุรกิจขององค์กรจากภัยคุกคามทางไซเบอร์ด้วยมาตรฐานระดับสากล',
    'footer-svc-h': 'บริการ',
    'footer-company-h': 'บริษัท',
    'footer-contact-h': 'ติดต่อ',
    'footer-about': 'เกี่ยวกับเรา',
    'footer-why': 'ทำไมต้อง SLC',
    'footer-cert': 'การรับรองมาตรฐาน',
    'footer-career': 'ร่วมงานกับเรา',
    'footer-news': 'ข่าวสาร',
    'footer-contact-link': 'ติดต่อเรา',
    'footer-privacy': 'นโยบายความเป็นส่วนตัว',
    'footer-terms': 'เงื่อนไขการใช้บริการ',
    'footer-cta': 'ปรึกษาผู้เชี่ยวชาญ',
    'footer-copy': '© 2025 Security Life Cycle Co., Ltd. (SLC) บริษัทในเครือ INET สงวนลิขสิทธิ์',
  },
  en: {
    'page-title': 'SLC - Security Life Cycle | Full-service Cyber Security Provider',
    'nav-home': 'Home',
    'nav-about': 'About Us',
    'nav-services': 'Services',
    'nav-contact': 'Contact',
    'nav-cta': 'Consult an Expert',
    'mob-home': 'Home',
    'mob-about': 'About Us',
    'mob-services': 'Services',
    'mob-why': 'Why SLC',
    'mob-cert': 'Certifications',
    'mob-contact': 'Contact Us',
    'mob-cta': 'Free Consultation',
    'hero1-tag': 'Complete Cyber Security',
    'hero1-h1': 'Protect Your Business<br>from<span class="accent"> Cyber Threats</span>',
    'hero1-p': 'Security Life Cycle (SLC) provides comprehensive cybersecurity services — from risk assessment, prevention, detection, and incident response — 24 hours a day.',
    'hero1-btn1': 'Our Services',
    'hero1-btn2': 'Consult an Expert',
    'hero2-tag': 'CSOC As a Service',
    'hero2-h1': 'Monitor Threats<br><span class="accent">24 Hours a Day</span>',
    'hero2-p': 'Our Cyber Security Operations Center (CSOC) is staffed by experts who detect, analyze, and respond to threats in real time using advanced AI and Machine Learning.',
    'hero2-btn1': 'Learn More',
    'hero2-btn2': 'Contact Us',
    'hero3-tag': 'ISO/IEC 27001:2022 Certified',
    'hero3-h1': 'International Standards<br><span class="accent">You Can Trust</span>',
    'hero3-p': 'Certified under ISO/IEC 27001:2022 and CSA STAR — internationally recognized information security standards trusted by leading organizations worldwide.',
    'hero3-btn1': 'View Certifications',
    'hero3-btn2': 'Contact Us',
    'scroll-down': 'Scroll Down',
    'about-tag': 'About Us',
    'about-h2': 'Security Life Cycle<br><span class="text-gradient">An INET Group Company</span>',
    'about-p': 'Security Life Cycle (SLC) is a subsidiary of INET, dedicated to delivering comprehensive cybersecurity services. We focus on full-lifecycle protection — from risk assessment, prevention, detection, and threat response, to recovery and continuous improvement — ensuring the highest level of security for your organization.',
    'about-btn1': 'View All Services',
    'about-btn2': 'Consult an Expert',
    'about-stat1': 'Monitoring Round the Clock',
    'about-stat2': 'Security Services',
    'about-stat3': '27001:2022 Certified',
    'about-stat4': 'INET Group Company',
    'svc-tag': 'Our Services',
    'svc-h2': 'Complete Cyber Security',
    'svc-p': 'We provide multi-layered cybersecurity services to protect your business and organization from threats of every kind.',
    'svc1-p': 'Enterprise-grade backup and disaster recovery solutions that ensure rapid system restoration, minimizing downtime and data loss.',
    'svc2-p': 'Centralized log management that collects, stores, analyzes, and audits events across all systems for compliance and threat hunting.',
    'svc3-p': 'Strengthen access security with MFA multi-layer identity verification — protecting accounts even when passwords are compromised.',
    'svc4-p': 'Expert-led penetration testing to uncover vulnerabilities before attackers do, following internationally recognized testing methodologies.',
    'svc5-p': 'Protect web applications from SQL Injection, XSS, and other attacks with a Web Application Firewall and real-time vulnerability scanning.',
    'svc6-p': 'Security Information and Event Management — collects and analyzes security logs from across your organization for rapid threat detection.',
    'svc7-p': 'Protect all endpoints — PCs, Laptops, and Mobile devices — with AI-powered EDR/XDR that automatically detects and responds to threats.',
    'svc8-p': 'Managed 24/7 Cyber Security Operations Center as a Service, powered by expert teams and AI technology for real-time threat detection and response.',
    'learn-more': 'Learn More',
    'why-tag': 'Why SLC',
    'why-h2': 'Why Leading Organizations Choose SLC',
    'why-p': 'We are committed to delivering world-class cybersecurity through experienced specialists and cutting-edge technology.',
    'tab0-name': 'Certified Security',
    'tab1-name': 'International Standards',
    'tab2-name': 'Continuous Improvement',
    'tab3-name': 'Reliable',
    'tab4-name': 'Fast Response',
    'tab5-name': 'Cost Reduction',
    'tab6-name': 'Secure',
    'tab7-name': 'Comprehensive Services',
    'tab0-h': 'Certified Security',
    'tab0-p': 'Certified under CSA STAR and ISO/IEC 27001:2022, ensuring our services meet the highest security standards recognized by leading organizations worldwide.',
    'tab1-h': 'International Standards',
    'tab1-p': 'Certified for service quality management under ISO/IEC 20000-1:2018 Service Management System (SMS), guaranteeing world-class IT service delivery.',
    'tab2-h': 'Continuous Improvement',
    'tab2-p': 'As cyber threats constantly evolve, SLC continuously monitors and updates clients on the latest threats, mitigation strategies, and remediation steps to minimize organizational risk.',
    'tab3-h': 'Reliable',
    'tab3-p': 'Enhance trust and credibility in your organization\'s data security, reducing losses and risks from data theft or malicious attacks.',
    'tab4-h': 'Fast Response',
    'tab4-p': 'We respond rapidly and promptly to threat incidents, resolving issues that could disrupt operations and minimizing potential damage to your organization.',
    'tab5-h': 'Cost Reduction',
    'tab5-p': 'Flexible pay-per-use pricing reduces upfront investment. Ideal for organizations that need reliable IT security without worrying about initial infrastructure costs.',
    'tab6-h': 'Secure',
    'tab6-p': 'Continuous 24/7 monitoring and surveillance of all cyber threat events, keeping your technology-driven organization safe at all times.',
    'tab7-h': 'Comprehensive Services',
    'tab7-p': 'End-to-end services — from risk analysis, security policy definition, and hardening, to ongoing monitoring and system improvement — ensuring effective threat management.',
    'stat1-label': 'Enterprise Clients Served',
    'stat2-label': 'Hours Monitored Per Day',
    'stat3-label': '% SLA Uptime Guarantee',
    'stat4-label': 'Cyber Security Services',
    'cert-tag': 'Certifications',
    'cert-h2': 'Our Standard Certifications',
    'cert-p': 'SLC is certified by leading international standards bodies, validating the quality of our services trusted by top organizations worldwide.',
    'cert1-p': 'Cloud security certification by the Cloud Security Alliance (CSA) — the international standard for cloud-based information security.',
    'cert2-p': 'International Information Security Management System (ISMS) standard that protects organizational data systematically and comprehensively.',
    'cert3-p': 'Service Management System (SMS) standard certifying the quality and control of IT service delivery at a world-class level.',
    'contact-tag': 'Contact Us',
    'contact-h2': 'Ready to Advise on<br><span class="text-gradient">Cyber Security</span>',
    'contact-p': 'Our experts are ready to consult and design the right solution for your organization. Contact us today.',
    'contact-addr-h': 'Address',
    'contact-addr': 'Security Life Cycle Co., Ltd. (SLC)<br>An INET Group Company, Bangkok, Thailand',
    'contact-tel-h': 'Telephone',
    'contact-email-h': 'Email',
    'contact-hours-h': 'Business Hours',
    'contact-hours': 'Mon – Fri 08:30 – 17:30<br>CSOC monitoring 24/7',
    'form-h3': 'Send Us a Message',
    'form-name-l': 'Full Name *',
    'form-name-ph': 'Enter your name',
    'form-comp-l': 'Company / Organization',
    'form-comp-ph': 'Your company',
    'form-email-l': 'Email *',
    'form-phone-l': 'Phone Number',
    'form-svc-l': 'Service of Interest',
    'form-svc-ph': '-- Select a service --',
    'form-msg-l': 'Message / Additional Details *',
    'form-msg-ph': 'Describe your needs or issues...',
    'form-submit': 'Send Message',
    'footer-desc': 'Security Life Cycle (SLC) — Full-service Cyber Security provider and INET Group company, committed to protecting organizations from cyber threats with international standards.',
    'footer-svc-h': 'Services',
    'footer-company-h': 'Company',
    'footer-contact-h': 'Contact',
    'footer-about': 'About Us',
    'footer-why': 'Why SLC',
    'footer-cert': 'Certification Standards',
    'footer-career': 'Careers',
    'footer-news': 'News',
    'footer-contact-link': 'Contact Us',
    'footer-privacy': 'Privacy Policy',
    'footer-terms': 'Terms of Service',
    'footer-cta': 'Consult an Expert',
    'footer-copy': '© 2025 Security Life Cycle Co., Ltd. (SLC) An INET Group Company. All rights reserved.',
  }
};

// Map i18n keys → DOM selectors and property
const i18nMap = [
  // page
  { key: 'page-title', sel: null, prop: 'title' },
  // navbar
  { key: 'nav-home', sel: '.nav-menu li:nth-child(1) .nav-link', prop: 'text' },
  { key: 'nav-about', sel: '.nav-menu li:nth-child(2) .nav-link', prop: 'text' },
  { key: 'nav-services', sel: '.nav-menu li:nth-child(3) > .nav-link', prop: 'innerHTML', suffix: ' <i class="ri-arrow-down-s-line"></i>' },
  { key: 'nav-contact', sel: '.nav-menu li:nth-child(4) .nav-link', prop: 'text' },
  { key: 'nav-cta', sel: '.nav-actions > .btn-primary', prop: 'text' },
  // mobile
  { key: 'mob-home', sel: '#mobile-menu a:nth-child(1)', prop: 'text' },
  { key: 'mob-about', sel: '#mobile-menu a:nth-child(2)', prop: 'text' },
  { key: 'mob-services', sel: '#mobile-menu a:nth-child(3)', prop: 'text' },
  { key: 'mob-why', sel: '#mobile-menu a:nth-child(4)', prop: 'text' },
  { key: 'mob-cert', sel: '#mobile-menu a:nth-child(5)', prop: 'text' },
  { key: 'mob-contact', sel: '#mobile-menu a:nth-child(6)', prop: 'text' },
  { key: 'mob-cta', sel: '#mobile-menu .btn-primary', prop: 'text' },
  // Hero slides (innerHTML for <br> and spans)
  { key: 'hero1-tag', sel: '#slide-0 .hero-tag', prop: 'textEndNode' },
  { key: 'hero1-h1', sel: '#slide-0 h1', prop: 'innerHTML' },
  { key: 'hero1-p', sel: '#slide-0 p', prop: 'text' },
  { key: 'hero1-btn1', sel: '#slide-0 .btn-primary', prop: 'textFirst' },
  { key: 'hero1-btn2', sel: '#slide-0 .btn-outline', prop: 'text' },
  { key: 'hero2-tag', sel: '#slide-1 .hero-tag', prop: 'textEndNode' },
  { key: 'hero2-h1', sel: '#slide-1 h1', prop: 'innerHTML' },
  { key: 'hero2-p', sel: '#slide-1 p', prop: 'text' },
  { key: 'hero2-btn1', sel: '#slide-1 .btn-primary', prop: 'textFirst' },
  { key: 'hero2-btn2', sel: '#slide-1 .btn-outline', prop: 'text' },
  { key: 'hero3-tag', sel: '#slide-2 .hero-tag', prop: 'textEndNode' },
  { key: 'hero3-h1', sel: '#slide-2 h1', prop: 'innerHTML' },
  { key: 'hero3-p', sel: '#slide-2 p', prop: 'text' },
  { key: 'hero3-btn1', sel: '#slide-2 .btn-primary', prop: 'textFirst' },
  { key: 'hero3-btn2', sel: '#slide-2 .btn-outline', prop: 'text' },
  { key: 'scroll-down', sel: '.scroll-indicator span', prop: 'text' },
  // About
  { key: 'about-tag', sel: '#about .tag', prop: 'text' },
  { key: 'about-h2', sel: '#about h2', prop: 'innerHTML' },
  { key: 'about-p', sel: '#about > .container > div > div:first-child > p', prop: 'text' },
  { key: 'about-btn1', sel: '#about .btn-primary', prop: 'text' },
  { key: 'about-btn2', sel: '#about .btn-outline', prop: 'text' },
  { key: 'about-stat1', sel: '#about .reveal.delay-2 div div:nth-child(1) div:last-child', prop: 'text' },
  { key: 'about-stat2', sel: '#about .reveal.delay-2 div div:nth-child(2) div:last-child', prop: 'text' },
  { key: 'about-stat3', sel: '#about .reveal.delay-2 div div:nth-child(3) div:last-child', prop: 'text' },
  { key: 'about-stat4', sel: '#about .reveal.delay-2 div div:nth-child(4) div:last-child', prop: 'text' },
  // Services
  { key: 'svc-tag', sel: '#services .tag', prop: 'text' },
  { key: 'svc-h2', sel: '#services h2', prop: 'text' },
  { key: 'svc-p', sel: '#services .section-header p', prop: 'text' },
  { key: 'svc1-p', sel: '#services .service-card:nth-child(1) p', prop: 'text' },
  { key: 'svc2-p', sel: '#services .service-card:nth-child(2) p', prop: 'text' },
  { key: 'svc3-p', sel: '#services .service-card:nth-child(3) p', prop: 'text' },
  { key: 'svc4-p', sel: '#services .service-card:nth-child(4) p', prop: 'text' },
  { key: 'svc5-p', sel: '#services .service-card:nth-child(5) p', prop: 'text' },
  { key: 'svc6-p', sel: '#services .service-card:nth-child(6) p', prop: 'text' },
  { key: 'svc7-p', sel: '#services .service-card:nth-child(7) p', prop: 'text' },
  { key: 'svc8-p', sel: '#services .service-card:nth-child(8) p', prop: 'text' },
  // Why SLC
  { key: 'why-tag', sel: '#why-slc .tag', prop: 'text' },
  { key: 'why-h2', sel: '#why-slc h2', prop: 'text' },
  { key: 'why-p', sel: '#why-slc .section-header p', prop: 'text' },
  { key: 'tab0-name', sel: '.why-tab:nth-child(1)', prop: 'tabText', num: '01' },
  { key: 'tab1-name', sel: '.why-tab:nth-child(2)', prop: 'tabText', num: '02' },
  { key: 'tab2-name', sel: '.why-tab:nth-child(3)', prop: 'tabText', num: '03' },
  { key: 'tab3-name', sel: '.why-tab:nth-child(4)', prop: 'tabText', num: '04' },
  { key: 'tab4-name', sel: '.why-tab:nth-child(5)', prop: 'tabText', num: '05' },
  { key: 'tab5-name', sel: '.why-tab:nth-child(6)', prop: 'tabText', num: '06' },
  { key: 'tab6-name', sel: '.why-tab:nth-child(7)', prop: 'tabText', num: '07' },
  { key: 'tab7-name', sel: '.why-tab:nth-child(8)', prop: 'tabText', num: '08' },
  { key: 'tab0-h', sel: '#tab-0 h3', prop: 'text' }, { key: 'tab0-p', sel: '#tab-0 p', prop: 'text' },
  { key: 'tab1-h', sel: '#tab-1 h3', prop: 'text' }, { key: 'tab1-p', sel: '#tab-1 p', prop: 'text' },
  { key: 'tab2-h', sel: '#tab-2 h3', prop: 'text' }, { key: 'tab2-p', sel: '#tab-2 p', prop: 'text' },
  { key: 'tab3-h', sel: '#tab-3 h3', prop: 'text' }, { key: 'tab3-p', sel: '#tab-3 p', prop: 'text' },
  { key: 'tab4-h', sel: '#tab-4 h3', prop: 'text' }, { key: 'tab4-p', sel: '#tab-4 p', prop: 'text' },
  { key: 'tab5-h', sel: '#tab-5 h3', prop: 'text' }, { key: 'tab5-p', sel: '#tab-5 p', prop: 'text' },
  { key: 'tab6-h', sel: '#tab-6 h3', prop: 'text' }, { key: 'tab6-p', sel: '#tab-6 p', prop: 'text' },
  { key: 'tab7-h', sel: '#tab-7 h3', prop: 'text' }, { key: 'tab7-p', sel: '#tab-7 p', prop: 'text' },
  // Stats
  { key: 'stat1-label', sel: '#stats .stat-item:nth-child(1) .stat-label', prop: 'text' },
  { key: 'stat2-label', sel: '#stats .stat-item:nth-child(2) .stat-label', prop: 'text' },
  { key: 'stat3-label', sel: '#stats .stat-item:nth-child(3) .stat-label', prop: 'text' },
  { key: 'stat4-label', sel: '#stats .stat-item:nth-child(4) .stat-label', prop: 'text' },
  // Certifications
  { key: 'cert-tag', sel: '#certifications .tag', prop: 'text' },
  { key: 'cert-h2', sel: '#certifications h2', prop: 'text' },
  { key: 'cert-p', sel: '#certifications .section-header p', prop: 'text' },
  { key: 'cert1-p', sel: '#certifications .cert-card:nth-child(1) p', prop: 'text' },
  { key: 'cert2-p', sel: '#certifications .cert-card:nth-child(2) p', prop: 'text' },
  { key: 'cert3-p', sel: '#certifications .cert-card:nth-child(3) p', prop: 'text' },
  // Contact
  { key: 'contact-tag', sel: '#contact .tag', prop: 'text' },
  { key: 'contact-h2', sel: '#contact .contact-layout > div:first-child h2', prop: 'innerHTML' },
  { key: 'contact-p', sel: '#contact .contact-layout > div:first-child > p', prop: 'text' },
  { key: 'contact-addr-h', sel: '#contact .contact-detail:nth-child(2) h4', prop: 'text' },
  { key: 'contact-addr', sel: '#contact .contact-detail:nth-child(2) span', prop: 'innerHTML' },
  { key: 'contact-tel-h', sel: '#contact .contact-detail:nth-child(3) h4', prop: 'text' },
  { key: 'contact-email-h', sel: '#contact .contact-detail:nth-child(4) h4', prop: 'text' },
  { key: 'contact-hours-h', sel: '#contact .contact-detail:nth-child(5) h4', prop: 'text' },
  { key: 'contact-hours', sel: '#contact .contact-detail:nth-child(5) span', prop: 'innerHTML' },
  { key: 'form-h3', sel: '.contact-form h3', prop: 'text' },
  { key: 'form-name-l', sel: 'label[for="name"]', prop: 'text' },
  { key: 'form-name-ph', sel: '#name', prop: 'placeholder' },
  { key: 'form-comp-l', sel: 'label[for="company"]', prop: 'text' },
  { key: 'form-comp-ph', sel: '#company', prop: 'placeholder' },
  { key: 'form-email-l', sel: 'label[for="email"]', prop: 'text' },
  { key: 'form-phone-l', sel: 'label[for="phone"]', prop: 'text' },
  { key: 'form-svc-l', sel: 'label[for="service"]', prop: 'text' },
  { key: 'form-svc-ph', sel: '#service option[value=""]', prop: 'text' },
  { key: 'form-msg-l', sel: 'label[for="message"]', prop: 'text' },
  { key: 'form-msg-ph', sel: '#message', prop: 'placeholder' },
  { key: 'form-submit', sel: '.form-submit', prop: 'textFirst' },
  // Footer
  { key: 'footer-desc', sel: '.footer-brand p', prop: 'text' },
  { key: 'footer-svc-h', sel: '.footer-col:nth-child(2) h5', prop: 'text' },
  { key: 'footer-company-h', sel: '.footer-col:nth-child(3) h5', prop: 'text' },
  { key: 'footer-contact-h', sel: '.footer-col:nth-child(4) h5', prop: 'text' },
  { key: 'footer-about', sel: '.footer-col:nth-child(3) ul li:nth-child(1) a', prop: 'text' },
  { key: 'footer-why', sel: '.footer-col:nth-child(3) ul li:nth-child(2) a', prop: 'text' },
  { key: 'footer-cert', sel: '.footer-col:nth-child(3) ul li:nth-child(3) a', prop: 'text' },
  { key: 'footer-career', sel: '.footer-col:nth-child(3) ul li:nth-child(4) a', prop: 'text' },
  { key: 'footer-news', sel: '.footer-col:nth-child(3) ul li:nth-child(5) a', prop: 'text' },
  { key: 'footer-contact-link', sel: '.footer-col:nth-child(4) ul li:nth-child(1) a', prop: 'text' },
  { key: 'footer-privacy', sel: '.footer-col:nth-child(4) ul li:nth-child(2) a', prop: 'text' },
  { key: 'footer-terms', sel: '.footer-col:nth-child(4) ul li:nth-child(3) a', prop: 'text' },
  { key: 'footer-cta', sel: '.footer-col:nth-child(4) .btn-primary', prop: 'text' },
  { key: 'footer-copy', sel: '.footer-copy', prop: 'text' },
];

let currentLang = 'th';

function applyLang(lang) {
  currentLang = lang;
  const t = translations[lang];
  document.documentElement.lang = lang;

  i18nMap.forEach(({ key, sel, prop, num, suffix }) => {
    const val = t[key];
    if (!val) return;

    if (key === 'page-title') { document.title = val; return; }

    const el = document.querySelector(sel);
    if (!el) return;

    if (prop === 'text') {
      el.textContent = val;
    } else if (prop === 'innerHTML') {
      el.innerHTML = val + (suffix || '');
    } else if (prop === 'placeholder') {
      el.placeholder = val;
    } else if (prop === 'textFirst') {
      // set first text node only (preserve child icon elements)
      const nodes = [...el.childNodes];
      const textNode = nodes.find(n => n.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.textContent = val + ' ';
    } else if (prop === 'textEndNode') {
      // hero-tag has a .dot span — update text after it
      const nodes = [...el.childNodes];
      const textNode = nodes.find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
      if (textNode) textNode.textContent = ' ' + val;
    } else if (prop === 'tabText') {
      el.innerHTML = `<span class="tab-num">${num}</span> ${val}`;
    }
  });

  // Update learn-more spans inside service cards
  document.querySelectorAll('.learn-more').forEach(el => {
    const icon = el.querySelector('i');
    el.textContent = t['learn-more'] + ' ';
    if (icon) el.appendChild(icon);
  });

  // Update lang button active states
  document.getElementById('lang-th').classList.toggle('active', lang === 'th');
  document.getElementById('lang-en').classList.toggle('active', lang === 'en');
}

document.getElementById('lang-th')?.addEventListener('click', () => applyLang('th'));
document.getElementById('lang-en')?.addEventListener('click', () => applyLang('en'));

// ── SERVICE CARD TILT EFFECT ─────────────────────────────────
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const tiltX = ((y - cy) / cy) * 3;
    const tiltY = ((cx - x) / cx) * 3;
    card.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Production build — console output suppressed

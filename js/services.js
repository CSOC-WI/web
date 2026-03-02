/* ============================================================
   SLC - Services Data & Modal Logic for index.html
   ============================================================ */

const servicesData = [
    {
        id: 'baas-draas',
        title: 'Backup & DR Solution',
        icon: 'fa-cloud-arrow-up',
        shortDesc: 'บริการสำรองข้อมูลบนคลาวด์และโซลูชันกู้คืนระบบไอทีในกรณีฉุกเฉิน ลดต้นทุนและเพิ่มประสิทธิภาพการจัดการข้อมูล',
        fullDesc: `
      <p><strong>Backup as a Service (BaaS) และ Disaster Recovery as a Service (DRaaS): โซลูชันสำคัญสำหรับการปกป้องข้อมูลองค์กร</strong></p>
      <p>ในยุคดิจิทัลที่ข้อมูลเป็นหัวใจสำคัญของทุกองค์กร การสูญเสียข้อมูลหรือระบบล่มอาจก่อให้เกิดความเสียหายร้ายแรงทั้งในด้านการดำเนินธุรกิจ ความเชื่อมั่นของลูกค้า และความปลอดภัยของข้อมูล ดังนั้น Backup as a Service (BaaS) และ Disaster Recovery as a Service (DRaaS) จึงกลายเป็นโซลูชันที่สำคัญสำหรับองค์กร</p>
      <p><strong>Backup as a Service (BaaS)</strong> คือบริการสำรองข้อมูลที่ดำเนินการผ่านระบบคลาวด์ โดยองค์กรไม่จำเป็นต้องจัดการระบบสำรองข้อมูลด้วยตนเอง ลดความยุ่งยากในการดูแลโครงสร้างพื้นฐาน ระบบจะทำการสำรองข้อมูลโดยอัตโนมัติและสามารถกู้คืนข้อมูลได้อย่างรวดเร็วเมื่อเกิดปัญหา</p>
      <p><strong>ข้อดีของ Backup as a Service (BaaS):</strong></p>
      <ul>
        <li>ปกป้องข้อมูลจากการสูญหาย – ลดความเสี่ยงจาก Human Error, Ransomware และระบบล่ม</li>
        <li>ลดภาระของทีม IT – ไม่ต้องจัดการ Backup ด้วยตนเอง เพราะเป็นบริการแบบ Managed Service</li>
        <li>รองรับการขยายตัวขององค์กร (Scalability) – สามารถเพิ่มพื้นที่จัดเก็บข้อมูลได้ตามต้องการ</li>
        <li>สามารถกู้คืนข้อมูลได้ง่าย – ใช้เทคโนโลยี Incremental Backup และ Snapshot Recovery</li>
      </ul>
      <p><strong>Disaster Recovery as a Service (DRaaS)</strong> เป็นบริการที่ช่วยให้องค์กรสามารถกู้คืนระบบและดำเนินธุรกิจต่อได้อย่างรวดเร็วในกรณีที่เกิดเหตุการณ์ไม่คาดคิด เช่น ไฟดับ ระบบล่ม หรือภัยธรรมชาติ</p>
      <p><strong>ข้อดีของ Disaster Recovery as a Service (DRaaS):</strong></p>
      <ul>
        <li>ลด Downtime ของธุรกิจ – สามารถกู้คืนระบบได้อย่างรวดเร็ว (Low RTO/RPO)</li>
        <li>มีความยืดหยุ่นสูง – รองรับทั้ง On-Premises, Hybrid Cloud และ Multi-Cloud</li>
        <li>ลดค่าใช้จ่ายในการสร้าง DR Site – ไม่ต้องลงทุนโครงสร้างพื้นฐาน DR ด้วยตนเอง</li>
        <li>ทดสอบการกู้คืนได้ (DR Testing) – สามารถจำลองสถานการณ์จริงประเมินแผน DR ได้</li>
      </ul>`
    },
    {
        id: 'log-solution',
        title: 'Log Solution',
        icon: 'fa-file-lines',
        shortDesc: 'โซลูชันรวบรวมและจัดเก็บข้อมูล Log จากอุปกรณ์ต่างๆ เพื่อตรวจสอบย้อนหลัง รองรับ พ.ร.บ. ไซเบอร์ (มศอ.4003.1-2560)',
        fullDesc: `
      <p><strong>Log Solution</strong> เป็นโซลูชันที่ช่วยให้องค์กรสามารถรวบรวม จัดเก็บ และจัดการข้อมูล Log จากอุปกรณ์และแอปพลิเคชันต่าง ๆ ภายในองค์กร เพื่อให้สามารถตรวจสอบและวิเคราะห์เหตุการณ์ด้าน IT และ Cybersecurity ได้อย่างมีประสิทธิภาพ</p>
      <p>ข้อดีของ Log Solution คือช่วยตรวจสอบและติดตามเหตุการณ์ในระบบ IT และเครือข่ายแบบเรียลไทม์ ซึ่งช่วยให้ผู้ดูแลระบบสามารถตรวจสอบย้อนหลังเพื่อระบุสาเหตุของปัญหาได้ง่ายขึ้น</p>
      <p>สามารถรวม Log จากหลายแหล่ง เช่น Firewall, Server, Database และ Cloud โดย <strong>รองรับมาตรฐาน มศอ.4003.1-2560 ตาม พ.ร.บ. การรักษาความมั่นคงปลอดภัยไซเบอร์</strong></p>
      <p>นอกจากนี้ ยังสามารถผสานการทำงานร่วมกับโซลูชันอื่น ๆ เช่น SIEM, EDR, IPS เพื่อเพิ่มขีดความสามารถในการวิเคราะห์และป้องกันภัยคุกคามทางไซเบอร์</p>`
    },
    {
        id: 'mfa',
        title: 'Multi-Factor Authentication',
        icon: 'fa-mobile-screen-button',
        shortDesc: 'โซลูชันยืนยันตัวตนหลายปัจจัย เพิ่มความปลอดภัยในการเข้าถึงบัญชี ลดความเสี่ยงจากการขโมยรหัสผ่านและ Phishing',
        fullDesc: `
      <p><strong>Multi-Factor Authentication (MFA)</strong> โซลูชันการยืนยันตัวตนหลายปัจจัย ที่ช่วยเพิ่มความปลอดภัยในการเข้าถึงบัญชีหรือระบบต่างๆ โดยกำหนดให้ผู้ใช้ต้องผ่านการตรวจสอบตัวตนมากกว่าหนึ่งขั้นตอน ซึ่งช่วยลดความเสี่ยงจากการถูกโจมตี</p>
      <p>ข้อดีของ MFA คือความสามารถที่ช่วยเพิ่มความปลอดภัยในการเข้าถึงบัญชีหรือระบบได้อย่างมีประสิทธิภาพ โดยช่วยป้องกันภัยคุกคามไซเบอร์ที่เกิดจากการโจรกรรมข้อมูล และลดความเสี่ยงจากการขโมยรหัสผ่าน</p>
      <p>การนำ MFA ไปใช้ยังช่วยให้องค์กรหรือธุรกิจมีความน่าเชื่อถือ ซึ่งเป็นข้อกำหนดสำคัญสำหรับองค์กรที่ต้องการรักษาความปลอดภัยของข้อมูลลูกค้าและพนักงาน</p>`
    },
    {
        id: 'pentest',
        title: 'Penetration Testing',
        icon: 'fa-user-ninja',
        shortDesc: 'บริการจำลองการโจมตีทางไซเบอร์เพื่อหาช่องโหว่ในระบบ พร้อมรายงานระดับความรุนแรงและแนวทางแก้ไข',
        fullDesc: `
      <p><strong>บริการการทดสอบเจาะระบบ (Penetration Testing / Pentest)</strong> เป็นกระบวนการจำลองการโจมตีทางไซเบอร์ในรูปแบบต่างๆ เพื่อค้นหาช่องโหว่ในระบบเครือข่าย แอปพลิเคชัน หรืออุปกรณ์ IT ขององค์กร</p>
      <p>เป้าหมายเพื่อให้องค์กรทราบถึงช่องโหว่ที่มีความเสี่ยงที่องค์กรจะโดนโจมตี และทราบถึงแนวทางแก้ไข ลดความเสี่ยง หรือปรับปรุงจุดอ่อนด้านความมั่นคงปลอดภัย</p>
      <p><strong>ประโยชน์ของการทดสอบเจาะระบบ:</strong></p>
      <ul>
        <li>ค้นหาและประเมินช่องโหว่ที่อาจถูกแฮกเกอร์โจมตี</li>
        <li>จัดทำรายงานผลการทดสอบ พร้อมข้อมูลระดับความรุนแรง (Critical, High, Medium, Low)</li>
        <li>อธิบายและแนะนำแนวทางการแก้ไขสำหรับแต่ละช่องโหว่</li>
        <li>มีทีมงานผู้เชี่ยวชาญที่พร้อมให้บริการตลอดการดำเนินการ</li>
      </ul>`
    },
    {
        id: 'waf',
        title: 'Web Security (WAF)',
        icon: 'fa-shield-cat',
        shortDesc: 'Web Application Firewall ปกป้องเว็บแอปพลิเคชัน ตรวจจับและบล็อกการโจมตีที่เป็นอันตรายก่อนถึงเซิร์ฟเวอร์หลัก',
        fullDesc: `
      <p><strong>Web Application Firewall (WAF)</strong> เป็นเทคโนโลยีที่ออกแบบมาเพื่อปกป้องเว็บแอปพลิเคชันจากภัยคุกคามทางไซเบอร์ โดยทำหน้าที่ตรวจจับและป้องกันการโจมตีที่มุ่งเป้าไปยังเว็บไซต์ แอปพลิเคชัน และ API</p>
      <p>WAF ทำงานโดยการวิเคราะห์ทราฟฟิกที่เข้ามา ตรวจจับพฤติกรรมที่ผิดปกติ และบล็อกการเข้าถึงที่เป็นอันตรายก่อนที่ข้อมูลจะถูกส่งไปยังเซิร์ฟเวอร์หลัก</p>
      <p>ด้วยความสามารถที่ครอบคลุม WAF จึงเป็นเครื่องมือสำคัญในการป้องกันการโจมตีที่มักพบในเว็บไซต์ เช่น:</p>
      <ul>
        <li>SQL Injection</li>
        <li>Cross-Site Scripting (XSS)</li>
        <li>การโจมตีแบบ DDoS ในระดับ Application Layer</li>
        <li>การแอบอ้าง (Spoofing)</li>
        <li>และการเข้าถึงข้อมูลที่ไม่ได้รับอนุญาต</li>
      </ul>`
    },
    {
        id: 'siem',
        title: 'SIEM',
        icon: 'fa-network-wired',
        shortDesc: 'Security Information and Event Management ระบบรวบรวม วิเคราะห์ และแจ้งเตือนภัยคุกคามแบบเรียลไทม์',
        fullDesc: `
      <p><strong>SIEM (Security Information and Event Management)</strong> ช่วยให้องค์กรสามารถรวบรวม วิเคราะห์ และแจ้งเตือนภัยคุกคามทางไซเบอร์ได้อย่างมีประสิทธิภาพ</p>
      <p><strong>ข้อดีของ SIEM:</strong></p>
      <ul>
        <li><strong>ตรวจจับภัยคุกคามแบบเรียลไทม์</strong> – วิเคราะห์ข้อมูลจาก Logs, Network, และ Endpoints เพื่อตรวจจับพฤติกรรมที่ผิดปกติทันที</li>
        <li><strong>Correlation Rules</strong> – เชื่อมโยงเหตุการณ์ต่าง ๆ เพื่อระบุภัยคุกคาม เช่น Insider Threat</li>
        <li><strong>ตอบสนองเร็ว</strong> – แจ้งเตือนทันทีเมื่อเกิดภัยคุกคาม</li>
        <li><strong>Forensics &amp; Threat Intelligence</strong> – สนับสนุนการตรวจสอบย้อนหลังและการทำ Threat Hunting</li>
        <li><strong>ลดภาระงานด้วย AI</strong> – ลด False Positive และเพิ่มความแม่นยำในการระบุภัยคุกคาม</li>
        <li><strong>ทำงานร่วมกับโซลูชันอื่น ๆ</strong> – เช่น EDR, Firewall, และ Cloud Security</li>
      </ul>`
    },
    {
        id: 'endpoint',
        title: 'Endpoint Security',
        icon: 'fa-laptop-medical',
        shortDesc: 'โซลูชันปกป้องอุปกรณ์ปลายทาง (คอมพิวเตอร์, เซิร์ฟเวอร์) ตรวจจับและป้องกันมัลแวร์แบบรวมศูนย์',
        fullDesc: `
      <p>ในยุคที่เทคโนโลยีมีบทบาทสำคัญ ความปลอดภัยของอุปกรณ์ปลายทาง (Endpoints) กลายเป็นสิ่งจำเป็นที่องค์กรต้องให้ความสำคัญ <strong>Endpoint Security</strong> คือแนวทางการรักษาความปลอดภัยที่มุ่งเน้นการปกป้องอุปกรณ์ที่เชื่อมต่อกับเครือข่ายขององค์กร</p>
      <p>เป็นโซลูชันสำคัญที่ทำหน้าที่:</p>
      <ul>
        <li>ตรวจจับและป้องกันมัลแวร์ (Malware Prevention)</li>
        <li>ควบคุมการเข้าถึงข้อมูลที่สำคัญ</li>
        <li>วิเคราะห์พฤติกรรมที่ผิดปกติ (Behavioral Analysis)</li>
        <li>เพิ่มความปลอดภัยผ่านการจัดการแบบศูนย์กลาง (Centralized Management)</li>
      </ul>
      <p>ระบบนี้ช่วยให้องค์กรสามารถลดความเสี่ยงด้านความปลอดภัยและรับมือกับการโจมตีทางไซเบอร์ได้อย่างมีประสิทธิภาพ</p>`
    },
    {
        id: 'csoc',
        title: 'CSOC As a Service',
        icon: 'fa-tower-observation',
        shortDesc: 'บริการศูนย์เฝ้าระวังและตอบสนองภัยคุกคามทางไซเบอร์ 24 ชั่วโมง โดยไม่ต้องลงทุนสร้างทีมเอง',
        fullDesc: `
      <p><strong>CSOC as a Service</strong> ศูนย์เฝ้าระวังภัยคุกคามทางไซเบอร์ (Cyber Security Operation Center: CSOC) มีบทบาทสำคัญในการเฝ้าระวัง ตรวจจับ วิเคราะห์ และตอบสนองต่อภัยคุกคามแบบเรียลไทม์ตลอด 24 ชั่วโมง</p>
      <p>การใช้บริการ CSOC as a Service ช่วยให้องค์กรเสริมสร้างการรักษาความปลอดภัยได้โดยไม่ต้องลงทุนสูงในโครงสร้างพื้นฐานหรือจัดหาบุคลากรเฉพาะทาง</p>
      <p><strong>จุดเด่นของบริการ:</strong></p>
      <ul>
        <li>ใช้เทคโนโลยีที่ทันสมัย เช่น AI, Machine Learning, Threat Intelligence และ Automation</li>
        <li>ระบุและแจ้งเตือนพฤติกรรมที่ผิดปกติ และป้องกันการโจมตีแบบเรียลไทม์</li>
        <li>ปรับขนาดการให้บริการได้ตามความต้องการ (Scalability)</li>
        <li>รองรับสภาพแวดล้อมทั้ง On-premises, Cloud และ Hybrid Environment</li>
      </ul>`
    }
];

// ── MODAL LOGIC ─────────────────────────────────────────────

const _modal = document.getElementById('serviceModal');
const _modalContainer = document.getElementById('modalContainer');

const openModal = (serviceId) => {
    const service = servicesData.find(s => s.id === serviceId);
    if (!service) return;
    document.getElementById('modalTitle').innerText = service.title;
    // Icon class is from a hardcoded allowlist — safe to use
    document.getElementById('modalIcon').innerHTML = `<i class="fa-solid ${service.icon}"></i>`;
    // fullDesc is hardcoded static HTML — not user-supplied
    document.getElementById('modalBody').innerHTML = service.fullDesc;
    _modal.classList.remove('hidden');
    _modal.classList.add('flex');
    void _modal.offsetWidth;
    _modal.classList.remove('opacity-0');
    _modalContainer.classList.remove('scale-95');
    document.body.classList.add('modal-open');
};

const closeModal = () => {
    _modal.classList.add('opacity-0');
    _modalContainer.classList.add('scale-95');
    setTimeout(() => {
        _modal.classList.add('hidden');
        _modal.classList.remove('flex');
        document.body.classList.remove('modal-open');
    }, 300);
};

// ── RENDER SERVICES & INIT ───────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    // Render service cards
    const grid = document.getElementById('services-grid');
    let html = '';
    servicesData.forEach(service => {
        html += `
      <div class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-8 flex flex-col h-full service-card group">
        <div class="w-14 h-14 bg-slc-light text-slc-accent rounded-xl flex items-center justify-center text-2xl mb-6 transition-transform duration-300 service-icon">
          <i class="fa-solid ${service.icon}"></i>
        </div>
        <h4 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-slc-accent transition-colors">${service.title}</h4>
        <p class="text-gray-600 mb-6 flex-grow text-sm leading-relaxed">${service.shortDesc}</p>
        <button onclick="openModal('${service.id}')" class="text-slc-accent font-semibold flex items-center hover:text-[#52a654] transition mt-auto group-hover:translate-x-2 duration-300">
          อ่านรายละเอียด <i class="fa-solid fa-arrow-right ml-2 text-sm"></i>
        </button>
      </div>`;
    });
    grid.innerHTML = html;

    // Navbar shadow on scroll
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (window.scrollY > 10) {
            nav.classList.add('shadow-md');
        } else {
            nav.classList.remove('shadow-md');
        }
    });

    // Close modal on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !_modal.classList.contains('hidden')) {
            closeModal();
        }
    });
});

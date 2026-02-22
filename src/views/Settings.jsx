import React, { useState } from 'react';
import { 
  User, MapPin, Globe, Mail, Instagram, Facebook, ExternalLink, Phone, 
  BookOpen, ChevronDown, ChevronUp, LineChart, Sliders, Zap, Bot 
} from 'lucide-react';

const ProfileView = () => {
  // State สำหรับเช็คโหลดรูปโปรไฟล์
  const [imageError, setImageError] = useState(false);
  
  // State สำหรับจัดการ Accordion คู่มือการใช้งาน
  const [openSection, setOpenSection] = useState('dashboard'); // ตั้งค่าเริ่มต้นให้เปิดหน้าแรกไว้

  // ข้อมูลคู่มือการใช้งาน (อัปเดตเนื้อหาแบบ How-to)
  const manualSections = [
    {
      id: 'dashboard',
      title: '1. การดูข้อมูลภาพรวมและกราฟ',
      icon: <LineChart size={20} className="text-emerald-500" />,
      content: (
        <ul className="list-disc pl-5 space-y-2 text-slate-600">
          <li><strong>สภาพอากาศ:</strong> แสดงอุณหภูมิและความชื้นในโรงเรือนจากเซ็นเซอร์ DHT11</li>
          <li><strong>ดินและปุ๋ย:</strong> แสดงค่าความชื้น, อุณหภูมิดิน, pH, EC (ความนำไฟฟ้า/ปริมาณปุ๋ย) และธาตุอาหาร N-P-K แบบ Real-time</li>
          <li><strong>ประวัติ & กราฟ:</strong> สามารถดูแนวโน้มการเปลี่ยนแปลงของสภาพแวดล้อมย้อนหลังเพื่อนำไปวิเคราะห์การเติบโตของพืชได้</li>
        </ul>
      )
    },
    {
      id: 'control',
      title: '2. การควบคุมอุปกรณ์และการตั้งเวลา',
      icon: <Sliders size={20} className="text-blue-500" />,
      content: (
        <div className="space-y-4 text-slate-600">
          <p>ไปที่เมนู <strong>"ควบคุมอุปกรณ์"</strong> เพื่อสั่งงานอุปกรณ์ต่างๆ ภายในฟาร์ม</p>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <h5 className="font-semibold text-slate-700 mb-2"> วิธีสั่งเปิดอุปกรณ์ และ ตั้งเวลาการทำงาน</h5>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>คลิกที่ปุ่ม <strong>"ตั้งเวลา / เปิดทำงาน"</strong> บนการ์ดอุปกรณ์ที่ต้องการ (เช่น ปั๊มน้ำหลัก, พัดลม)</li>
              <li>หน้าต่างตั้งค่าจะปรากฏขึ้น ให้เลือกระยะเวลาการทำงาน (หน่วยเป็น วินาที / นาที / ชั่วโมง)</li>
              <li>หากต้องการให้เครื่องเปิดทำงานตามเวลาที่กำหนด ให้ตั้งค่า <strong>เวลาเริ่ม (Start Time)</strong></li>
              <li>เลือกโหมดการทำงาน (ทำครั้งเดียว, ทำทุกวัน หรือ เลือกวันเฉพาะเจาะจง)</li>
              <li>กด <strong>ยืนยัน/บันทึก</strong> เพื่อส่งคำสั่งไปยังฟาร์ม</li>
            </ol>
          </div>
          <p className="text-sm bg-blue-50 text-blue-700 p-2 rounded border border-blue-100">
            <strong>ความปลอดภัย:</strong> เมื่อคุณสั่งเปิด "ปั๊มน้ำหลัก" หรือ "ปั๊มวิตามิน" ระบบจะทำการเปิด <strong>วาล์วที่เกี่ยวข้องให้พร้อมกันอัตโนมัติ</strong> เพื่อป้องกันปัญหาแรงดันน้ำอั้นจนท่อแตก
          </p>
        </div>
      )
    },
    {
      id: 'automation',
      title: '3. การสร้างระบบกฎอัตโนมัติ)',
      icon: <Zap size={20} className="text-amber-500" />,
      content: (
        <div className="space-y-4 text-slate-600">
          <p>ไปที่เมนู <strong>"ระบบอัตโนมัติ"</strong> เพื่อสร้างเงื่อนไขให้ฟาร์มทำงานและตัดสินใจเองตลอด 24 ชม.</p>
          
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <h5 className="font-semibold text-slate-700 mb-2"> วิธีสร้างกฎใหม่ (Add Rule)</h5>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>กดปุ่ม <strong>"+ เพิ่มกฎใหม่ (Add Rule)"</strong> ที่มุมขวาบนของหน้าจอ</li>
              <li><strong>ตั้งชื่อกฎ:</strong> พิมพ์ชื่อที่เข้าใจง่าย เช่น <em>"เปิดพัดลมเมื่ออากาศร้อน"</em></li>
              <li><strong>เงื่อนไข (IF):</strong> เลือกค่าที่ต้องการตรวจสอบ ➔ เลือกเครื่องหมาย (มากกว่า/น้อยกว่า) ➔ พิมพ์ค่าตัวเลข (เช่น อุณหภูมิ &gt; 35)</li>
              <li><strong>สั่งงาน (THEN):</strong> เลือกอุปกรณ์ที่ต้องการควบคุม ➔ เลือกสถานะ (เปิด หรือ ปิด)</li>
              <li>กดปุ่ม <strong>"บันทึกกฎ"</strong> ระบบจะเริ่มตรวจสอบเงื่อนไขนี้ทันที</li>
            </ol>
          </div>

          <p className="text-sm">
            <strong>การจัดการกฎ:</strong> คุณสามารถเลื่อนสวิตช์สีเขียว (Toggle) ในรายการกฎ เพื่อ <strong>เปิด/พักการทำงาน</strong> ของกฎนั้นๆ ได้ชั่วคราว หรือกดไอคอนถังขยะเพื่อลบกฎทิ้งอย่างถาวร
          </p>
        </div>
      )
    },
    {
      id: 'ai',
      title: '4. ผู้ช่วย AI ตรวจสุขภาพพืช',
      icon: <Bot size={20} className="text-purple-500" />,
      content: (
        <ul className="list-disc pl-5 space-y-2 text-slate-600">
          <li>หากพบต้นไม้มีอาการผิดปกติ (เช่น ใบเหลือง, รากเน่า) ให้ถ่ายรูปแล้วนำมาอัปโหลดที่เมนู "ผู้ช่วย AI"</li>
          <li>พิมพ์คำถามของคุณลงไป จากนั้น AI จะ <strong>ดึงค่าเซ็นเซอร์ปัจจุบันจากฐานข้อมูล</strong> (อุณหภูมิ, pH, NPK ฯลฯ) ไปประมวลผลร่วมกับรูปภาพของคุณ</li>
          <li>AI จะตอบกลับพร้อมวิเคราะห์สาเหตุของโรค และแนะนำการปรับตั้งค่าเครื่องให้เหมาะสมที่สุด</li>
        </ul>
      )
    }
  ];

  const toggleSection = (id) => {
    if (openSection === id) {
      setOpenSection(null);
    } else {
      setOpenSection(id);
    }
  };

  return (
    <div className="max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-10">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50">
        <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
          <BookOpen size={24} className="text-emerald-600" />
          คู่มือการใช้งาน & ติดต่อผู้สร้าง
        </h3>
        <p className="text-sm text-slate-500 mt-1">วิธีการใช้งาน Smart Farm Pro และข้อมูลติดต่อผู้พัฒนา</p>
      </div>

      <div className="p-6 space-y-10">
        
        {/* =========================================
            SECTION 1: คู่มือการใช้งาน (User Manual) 
        ========================================= */}
        <div>
          <h4 className="font-bold text-slate-800 mb-6 text-lg border-l-4 border-emerald-500 pl-3">
            คู่มือการใช้งาน
          </h4>
          
          <div className="space-y-3">
            {manualSections.map((section) => (
              <div 
                key={section.id} 
                className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-200"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
                    openSection === section.id ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 font-semibold text-slate-700">
                    {section.icon}
                    {section.title}
                  </div>
                  <div className="text-slate-400">
                    {openSection === section.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>
                
                {/* Accordion Content */}
                {openSection === section.id && (
                  <div className="p-5 border-t border-slate-100 bg-white leading-relaxed text-sm">
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <hr className="border-slate-200" />

        {/* =========================================
            SECTION 2: ข้อมูลผู้สร้าง (Creator Profile) 
        ========================================= */}
        <div>
          <h4 className="font-bold text-slate-800 mb-6 text-lg border-l-4 border-blue-500 pl-3">
            ข้อมูลผู้สร้างและการติดต่อ 
          </h4>
          
          <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
            
            {/* Profile Image Area */}
            <div className="flex flex-col items-center gap-3">
               <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden relative">
                 {!imageError ? (
                   <img 
                     src="/photo/photo.jpg" 
                     alt="Profile" 
                     className="w-full h-full object-cover"
                     onError={() => setImageError(true)} 
                   />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                     <User size={48} />
                   </div>
                 )}
               </div>
            </div>
            
            {/* Info Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-1">ชื่อที่แสดง (Name)</label>
                <div className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">
                  นาย ซุลกิฟลี อาแว
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">อีเมล (Email)</label>
                <div className="flex items-center gap-2 text-slate-700 border-b border-slate-100 pb-2">
                    <Mail size={18} className="text-slate-400"/>
                    <span>zulkifleeawae432@gmail.com</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">เบอร์ติดต่อ (Phone)</label>
                <div className="flex items-center gap-2 text-slate-700 border-b border-slate-100 pb-2">
                    <Phone size={18} className="text-slate-400"/>
                    <span>097-416-9008</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <h5 className="font-bold text-slate-600 mb-4 flex items-center gap-2 text-sm">
            <Globe size={18} className="text-rose-500" /> ช่องทางการติดต่ออื่นๆ
          </h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Website */}
             <div className="col-span-1 md:col-span-2">
                <a 
                  href="https://smart-farm-app-ashen.vercel.app/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors group"
                >
                   <div className="p-2 bg-white rounded-full shadow-sm text-emerald-500">
                      <Globe size={18} />
                   </div>
                   <span className="font-medium text-sm truncate flex-1">https://smart-farm-app-ashen.vercel.app/</span>
                   <ExternalLink size={16} className="opacity-50 group-hover:opacity-100"/>
                </a>
             </div>

             {/* Facebook */}
             <div>
                <a 
                  href="https://www.facebook.com/zycudsi.null" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors group"
                >
                   <div className="p-2 bg-white rounded-full shadow-sm text-blue-600">
                      <Facebook size={18} />
                   </div>
                   <span className="font-medium text-sm truncate flex-1">Zulkiflee Awae</span>
                   <ExternalLink size={16} className="opacity-50 group-hover:opacity-100"/>
                </a>
             </div>
             
             {/* Instagram */}
             <div>
                <a 
                  href="https://www.instagram.com/zulkiflee.___/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100 transition-colors group"
                >
                   <div className="p-2 bg-white rounded-full shadow-sm text-pink-500">
                      <Instagram size={18} />
                   </div>
                   <span className="font-medium text-sm truncate flex-1">zulkiflee.___</span>
                   <ExternalLink size={16} className="opacity-50 group-hover:opacity-100"/>
                </a>
             </div>

             {/* Address */}
             <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 text-slate-700">
                   <div className="p-2 bg-white rounded-full shadow-sm text-slate-500">
                      <MapPin size={18} />
                   </div>
                   <span className="font-medium text-sm"> Thailand Songkhla, Chana </span>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileView;
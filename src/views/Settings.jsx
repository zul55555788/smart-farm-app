import React, { useState } from 'react';
import { User, MapPin, Globe, Mail, Instagram, Facebook, ExternalLink, Phone } from 'lucide-react';

const ProfileView = () => {
  // สร้าง State เช็คว่าโหลดรูปได้ไหม
  const [imageError, setImageError] = useState(false);

  return (
    <div className="max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <h3 className="font-bold text-lg text-slate-800">ข้อมูลผู้สร้าง (Creator Profile)</h3>
        <p className="text-sm text-slate-400">รายละเอียดและช่องทางการติดต่อ</p>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Section 1: ข้อมูลส่วนตัว */}
        <div>
          <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
            <User size={20} className="text-blue-500" /> ข้อมูลส่วนตัว (Personal Info)
          </h4>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Profile Image Area (แสดงรูปอย่างเดียว แก้ไขไม่ได้) */}
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
            
            {/* Info Fields (แบบข้อความธรรมดา) */}
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
        </div>

        <hr className="border-slate-100"/>

        {/* Section 2: ช่องทางการติดต่อ (คลิกได้) */}
        <div>
          <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
            <Globe size={20} className="text-rose-500" /> ช่องทางการติดต่อ (Social Media)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             
             {/* Website */}
             <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-1">เว็บไซต์ (Website)</label>
                <a 
                  href="https://smart-farm-app-ashen.vercel.app/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors group"
                >
                   <div className="p-2 bg-white rounded-full shadow-sm text-emerald-500">
                      <Globe size={20} />
                   </div>
                   <span className="font-medium truncate flex-1">https://smart-farm-app-ashen.vercel.app/</span>
                   <ExternalLink size={16} className="opacity-50 group-hover:opacity-100"/>
                </a>
             </div>

             {/* Facebook */}
             <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Facebook</label>
                <a 
                  href="https://www.facebook.com/zycudsi.null" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors group"
                >
                   <div className="p-2 bg-white rounded-full shadow-sm text-blue-600">
                      <Facebook size={20} />
                   </div>
                   <span className="font-medium truncate flex-1">Zulkiflee Awae</span>
                   <ExternalLink size={16} className="opacity-50 group-hover:opacity-100"/>
                </a>
             </div>
             
             {/* Instagram */}
             <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Instagram</label>
                <a 
                  href="https://www.instagram.com/zulkiflee.___/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100 transition-colors group"
                >
                   <div className="p-2 bg-white rounded-full shadow-sm text-pink-500">
                      <Instagram size={20} />
                   </div>
                   <span className="font-medium truncate flex-1">zulkiflee.___</span>
                   <ExternalLink size={16} className="opacity-50 group-hover:opacity-100"/>
                </a>
             </div>

             {/* Address */}
             <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-1">ที่อยู่ (Address)</label>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 text-slate-700">
                   <div className="p-2 bg-white rounded-full shadow-sm text-slate-500">
                      <MapPin size={20} />
                   </div>
                   <span className="font-medium"> Thailand Songkhla, Chana </span>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileView;
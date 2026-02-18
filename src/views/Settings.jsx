import React from 'react';
import { Edit3, Clock, Wifi, Bell, Save } from 'lucide-react';

const Settings = () => {
  return (
    <div className="max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="font-bold text-lg text-slate-800">ตั้งค่าระบบ (System Settings)</h3>
        <p className="text-sm text-slate-400">จัดการการเชื่อมต่อและพารามิเตอร์ต่างๆ ของ ESP32</p>
      </div>
      <div className="p-6 space-y-8">
        <div>
          <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Edit3 size={18} /> ข้อมูลทั่วไป (General)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-slate-600 mb-1">ชื่อแปลง/โรงเรือน</label><input type="text" defaultValue="ระบบฟาม" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-600 mb-1">ตั้งเวลาให้น้ำ (Daily Schedule)</label><div className="flex items-center gap-2"><Clock size={18} className="text-slate-400"/><input type="time" defaultValue="08:00" className="px-4 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none" /><span className="text-sm text-slate-500">ทุกวัน</span></div></div>
          </div>
        </div>
        <hr className="border-slate-100"/>
        <div>
          <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Wifi size={18} /> การเชื่อมต่อ (Connection)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-slate-600 mb-1">WiFi SSID (ESP32)</label><input type="text" defaultValue="SmartFarm_2.4G" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-600 mb-1">WiFi Password</label><input type="password" defaultValue="********" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none" /></div>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Bell size={18} /> การแจ้งเตือน (Notification)</h4>
          <div><label className="block text-sm font-medium text-slate-600 mb-1">Line Notify Token</label><div className="flex gap-2"><input type="password" defaultValue="token_xyz_123" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none bg-slate-50" /><button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-sm">Test</button></div></div>
        </div>
        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"><Save size={18} /> บันทึกการตั้งค่า</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
import React from 'react';
import { Droplets, Wind, FlaskConical, Zap, AlertTriangle, Clock, Timer, XCircle } from 'lucide-react';

const DeviceControl = ({ devices, handleDeviceClick, cancelSchedule }) => {
  return (
    <div>
      <div className="mb-6 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
        <AlertTriangle className="text-blue-500 mt-1" size={20} />
        <div>
            <h4 className="font-bold text-blue-700">Smart Control Mode</h4>
            <p className="text-sm text-blue-600">กดปุ่มที่อุปกรณ์เพื่อสั่งงานทันที หรือตั้งเวลาทำงานอัตโนมัติแบบรายวัน</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map(device => (
          <div key={device.id} className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all cursor-pointer group ${device.status ? 'border-emerald-500 ring-4 ring-emerald-50' : 'border-slate-100 hover:border-slate-300'}`}>
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-xl transition-colors ${device.status ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  {device.type === 'pump' && <Droplets size={32} />}
                  {device.type === 'fan' && <Wind size={32} />}
                  {device.type === 'chemical' && <FlaskConical size={32} />}
                  {device.type === 'light' && <Zap size={32} />}
              </div>
              <div className="flex flex-col items-end gap-1">
                  <div className={`w-3 h-3 rounded-full ${device.status ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                  {device.schedule && (<div className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100"><Clock size={10} /> {device.schedule}</div>)}
              </div>
            </div>
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{device.name}</h3>
                    <p className="text-sm text-slate-400"> </p>
                </div>
                
                {/* 🔴 ส่วนที่ปรับปรุงปุ่มยกเลิกเวลาให้สวยขึ้น */}
                {device.schedule && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); cancelSchedule(device.id); }} 
                        className="flex items-center gap-1.5 text-xs font-bold text-rose-500 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm active:scale-95"
                    >
                        <XCircle size={14} />
                        ยกเลิกเวลา
                    </button>
                )}
                
            </div>
            <button onClick={() => handleDeviceClick(device)} className={`w-full py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${device.status ? 'bg-emerald-500 text-white shadow-emerald-200 hover:bg-emerald-600' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                {device.status ? 'ปิดการทำงาน (OFF)' : (<><Timer size={18} /><span>ตั้งเวลา / เปิดทำงาน</span></>)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceControl;
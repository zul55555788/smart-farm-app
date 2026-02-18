import React from 'react';
import { Timer, Calendar, Clock, Check } from 'lucide-react';

const TimerModal = ({ 
  isOpen, onClose, device, 
  timerMode, setTimerMode, 
  config, setConfig, 
  onConfirm 
}) => {
  if (!isOpen || !device) return null;

  const days = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

  const toggleDaySelection = (dayIndex) => {
    const currentDays = config.selectedDays;
    if (currentDays.includes(dayIndex)) {
      setConfig({ ...config, selectedDays: currentDays.filter(d => d !== dayIndex) });
    } else {
      setConfig({ ...config, selectedDays: [...currentDays, dayIndex] });
    }
  };

  const toggleTimeSlot = (id) => {
    const newSlots = config.timeSlots.map(slot => slot.id === id ? { ...slot, active: !slot.active } : slot);
    setConfig({ ...config, timeSlots: newSlots });
  };

  const updateTimeSlot = (id, newTime) => {
    const newSlots = config.timeSlots.map(slot => slot.id === id ? { ...slot, time: newTime } : slot);
    setConfig({ ...config, timeSlots: newSlots });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-slate-100 flex justify-center bg-slate-50/50">
           <div className="flex bg-slate-200/80 p-1 rounded-xl w-full max-w-[280px]">
             <button onClick={() => setTimerMode('timer')} className={`flex-1 py-2 px-2 rounded-lg text-xs sm:text-sm font-bold transition-all shadow-sm ${timerMode === 'timer' ? 'bg-white text-emerald-600 shadow' : 'text-slate-500 hover:text-slate-700'}`}>นับถอยหลัง</button>
             <button onClick={() => setTimerMode('schedule')} className={`flex-1 py-2 px-2 rounded-lg text-xs sm:text-sm font-bold transition-all shadow-sm ${timerMode === 'schedule' ? 'bg-white text-emerald-600 shadow' : 'text-slate-500 hover:text-slate-700'}`}>ตั้งเวลาทุกวัน</button>
           </div>
        </div>
        <div className="p-6 text-center">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500 shadow-emerald-100 shadow-md">{timerMode === 'timer' ? <Timer size={28} /> : <Calendar size={28} />}</div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">{timerMode === 'timer' ? 'เปิดใช้งานทันที' : 'ตั้งเวลาทำงานอัตโนมัติ'}</h3>
          <p className="text-sm text-slate-500 mb-6">{device.name}</p>
          
          <div className="mb-6 text-left">
            <label className="text-xs text-slate-400 font-bold ml-1 uppercase tracking-wider">ระยะเวลา (DURATION)</label>
            <div className="flex gap-2 mt-1 h-12">
                <input type="number" placeholder="0" className="w-[60%] px-4 h-full border border-slate-200 rounded-xl text-center text-xl font-bold text-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none transition-all" value={config.durationVal} onChange={(e) => setConfig({...config, durationVal: e.target.value})} autoFocus />
                <select className="w-[40%] px-2 h-full border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:border-emerald-500 focus:outline-none text-center text-sm font-bold appearance-none cursor-pointer hover:bg-slate-100 transition-colors" value={config.durationUnit} onChange={(e) => setConfig({...config, durationUnit: e.target.value})}>
                <option value="seconds">วินาที</option><option value="minutes">นาที</option><option value="hours">ชั่วโมง</option>
                </select>
            </div>
          </div>

          {timerMode === 'schedule' && (
              <div className="mb-6 text-left animate-in slide-in-from-top-2 duration-200">
                  <label className="text-xs text-slate-400 font-bold ml-1 uppercase tracking-wider">เริ่มเวลา (START TIME)</label>
                  <div className="mt-2 space-y-2">
                    {config.timeSlots.map((slot) => (
                        <div key={slot.id} className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${slot.active ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
                             <button onClick={() => toggleTimeSlot(slot.id)} className={`w-6 h-6 rounded-full flex items-center justify-center border ${slot.active ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'}`}> {slot.active && <Check size={14} />} </button>
                             <div className="flex-1 flex items-center gap-2"><Clock size={16} className={slot.active ? 'text-emerald-600' : 'text-slate-400'} /><input type="time" value={slot.time} onChange={(e) => updateTimeSlot(slot.id, e.target.value)} disabled={!slot.active} className="bg-transparent font-bold text-slate-700 focus:outline-none w-full disabled:text-slate-400"/></div>
                        </div>
                    ))}
                  </div>
                  <div className="mb-6 mt-4 text-left">
                     <label className="text-xs text-slate-400 font-bold ml-1 uppercase tracking-wider">โหมดการทำงาน (REPEAT)</label>
                     <div className="flex gap-2 mt-2 bg-slate-100 p-1 rounded-xl">
                        <button onClick={() => setConfig({...config, repeatMode: 'once'})} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${config.repeatMode === 'once' ? 'bg-white shadow text-emerald-600' : 'text-slate-500'}`}>ครั้งเดียว</button>
                        <button onClick={() => setConfig({...config, repeatMode: 'everyday'})} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${config.repeatMode === 'everyday' ? 'bg-white shadow text-emerald-600' : 'text-slate-500'}`}>ทุกวัน</button>
                        <button onClick={() => setConfig({...config, repeatMode: 'custom'})} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${config.repeatMode === 'custom' ? 'bg-white shadow text-emerald-600' : 'text-slate-500'}`}>เลือกวัน</button>
                     </div>
                  </div>
                  {config.repeatMode === 'custom' && (
                     <div className="mb-6 flex justify-between gap-1">
                         {days.map((d, index) => (
                             <button key={index} onClick={() => toggleDaySelection(index)} className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${config.selectedDays.includes(index) ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' : 'bg-slate-100 text-slate-400'}`}>{d}</button>
                         ))}
                     </div>
                 )}
               </div>
          )}

          <div className="flex gap-3 mt-8">
            <button onClick={onClose} className="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors active:scale-95">ยกเลิก</button>
            <button onClick={onConfirm} className="flex-1 py-3.5 rounded-xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all active:scale-95 active:shadow-none">{timerMode === 'timer' ? 'เริ่มทำงาน' : 'บันทึกเวลา'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerModal;
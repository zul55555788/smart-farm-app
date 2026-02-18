import React from 'react';
import { Sparkles, Wind, Thermometer, Droplets, Layers, Sprout, Activity, Zap, Cpu } from 'lucide-react';
import StatCard from '../components/StatCard';
import NPKBar from '../components/NPKBar';

const Dashboard = ({ sensorData, systemLogs, handleQuickAnalysis }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
         <div><h3 className="text-xl font-bold flex items-center gap-2"><Sparkles className="text-yellow-300" /> วิเคราะห์สุขภาพฟาร์มด้วย AI</h3><p className="text-indigo-100 mt-1 text-sm">ใช้ Gemini AI ประมวลผลค่าเซนเซอร์ทั้งหมดเพื่อหาความผิดปกติและแนะนำแนวทางแก้ไข</p></div>
         <button onClick={handleQuickAnalysis} className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-md hover:bg-indigo-50 transition-all active:scale-95 whitespace-nowrap">วิเคราะห์ทันที ✨</button>
      </div>
      
      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Wind size={16}/> สภาพอากาศ (DHT11)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StatCard title="อุณหภูมิอากาศ" value={sensorData.airTemp} unit="°C" icon={Thermometer} color="#f43f5e" subValue="DHT11 Sensor" subtitle="Air Temp" />
        <StatCard title="ความชื้นอากาศ" value={sensorData.airHum} unit="%" icon={Droplets} color="#3b82f6" subValue="DHT11 Sensor" subtitle="Air Humidity" />
      </div>

      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Layers size={16}/> ดินและปุ๋ย (7-in-1 Modbus RS485)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="ความชื้นในดิน" value={sensorData.soilMoisture} unit="%" icon={Sprout} color="#10b981" subtitle="Soil Moisture" />
        <StatCard title="อุณหภูมิดิน" value={sensorData.soilTemp} unit="°C" icon={Thermometer} color="#f59e0b" subtitle="Soil Temp" />
        <StatCard title="ค่า pH" value={sensorData.ph} unit="pH" icon={Activity} color="#8b5cf6" subtitle="Acidity" />
        <StatCard title="ค่า EC" value={sensorData.ec} unit="mS/cm" icon={Zap} color="#6366f1" subtitle="Conductivity" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-6"><h3 className="font-bold text-slate-800 flex items-center gap-2"><Sprout size={20} className="text-emerald-500"/> ธาตุอาหาร (NPK)</h3><span className="text-xs text-slate-400">7-in-1 Sensor</span></div>
           <div className="space-y-6"><NPKBar label="Nitrogen (N)" value={sensorData.n} max={200} color="#3b82f6" /><NPKBar label="Phosphorus (P)" value={sensorData.p} max={100} color="#f59e0b" /><NPKBar label="Potassium (K)" value={sensorData.k} max={300} color="#ef4444" /></div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 xl:col-span-2">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Cpu size={20} className="text-purple-500"/> ประวัติการทำงานระบบ (System Logs)</h3>
          <div className="space-y-4 relative pl-4 border-l-2 border-slate-100 max-h-[250px] overflow-y-auto">
              {systemLogs.length === 0 ? (<p className="text-sm text-slate-400">ยังไม่มีการแจ้งเตือนใหม่</p>) : (systemLogs.map(log => (<div key={log.id} className="relative mb-4 last:mb-0"><span className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white ${log.type === 'success' ? 'bg-emerald-500' : log.type === 'warning' ? 'bg-orange-500' : log.type === 'info' ? 'bg-blue-500' : 'bg-slate-400'}`}></span><p className="text-xs text-slate-400 mb-1">{log.time}</p><p className="text-sm text-slate-700">{log.message}</p></div>)))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
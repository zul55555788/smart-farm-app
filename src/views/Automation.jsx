import React from 'react';
import { Plus, ChevronRight, Trash2 } from 'lucide-react';

const Automation = ({ rules, toggleRule, deleteRule, onOpenAddModal, devices }) => {
  
  // Helper functions for display inside this component
  const getDeviceName = (id) => { 
    if (id === 'notify') return 'แจ้งเตือน Line'; 
    const dev = devices.find(d => d.id === id); 
    return dev ? dev.name : id; 
  };
  
  const getSensorLabel = (key) => { 
    const labels = { airTemp: 'อุณหภูมิอากาศ (DHT11)', airHum: 'ความชื้นอากาศ (DHT11)', soilMoisture: 'ความชื้นดิน (Modbus)', soilTemp: 'อุณหภูมิดิน (Modbus)', ph: 'pH (Modbus)', ec: 'EC (Modbus)' }; 
    return labels[key] || key; 
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">กฎการทำงานอัตโนมัติ (Automation Rules)</h3>
        <button onClick={onOpenAddModal} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium shadow-md shadow-slate-200">
          <Plus size={16} /> เพิ่มกฎใหม่ (Add Rule)
        </button>
      </div>
      <div className="grid gap-4">
        {rules.map(rule => (
          <div key={rule.id} className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${rule.active ? 'border-l-emerald-500' : 'border-l-slate-300'}`}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-bold text-lg text-slate-800">{rule.name}</h4>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${rule.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{rule.active ? 'ACTIVE' : 'INACTIVE'}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg inline-flex flex-wrap">
                <span className="font-mono font-medium text-blue-600 uppercase flex items-center gap-1">IF {getSensorLabel(rule.sensor)} {rule.operator} {rule.value}</span>
                <span className="text-slate-400"><ChevronRight size={16}/></span>
                <span className="font-mono font-medium text-emerald-600 uppercase flex items-center gap-1">THEN {getDeviceName(rule.actionDevice)} {rule.actionDevice === 'notify' ? '' : (rule.actionState ? '(ON)' : '(OFF)')}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="relative inline-flex items-center cursor-pointer" title="เปิด/ปิด กฎนี้">
                <input type="checkbox" checked={rule.active} onChange={() => toggleRule(rule.id)} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
              <button onClick={() => deleteRule(rule.id, rule.name)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="ลบกฎ"><Trash2 size={20} /></button>
            </div>
          </div>
        ))}
        {rules.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
            <p>ยังไม่มีกฎอัตโนมัติ กดปุ่ม "เพิ่มกฎใหม่" เพื่อเริ่มต้น</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Automation;
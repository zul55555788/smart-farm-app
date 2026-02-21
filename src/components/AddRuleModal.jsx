import React from 'react';
import { X } from 'lucide-react';

const AddRuleModal = ({ isOpen, onClose, onSubmit, devices, newRule, setNewRule }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">เพิ่มกฎอัตโนมัติ (Add Rule)</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">ชื่อกฎ</label>
            <input type="text" required placeholder="เช่น เปิดปั๊มเมื่อดินแห้ง" value={newRule.name} onChange={(e) => setNewRule({...newRule, name: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-600 mb-2">เงื่อนไข (IF)</label>
              <select value={newRule.sensor} onChange={(e) => setNewRule({...newRule, sensor: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none text-sm">
                <option value="airTemp">อุณหภูมิอากาศ</option><option value="airHum">ความชื้นอากาศ</option><option value="soilMoisture">ความชื้นดิน</option><option value="ph">pH</option><option value="ec">EC</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">เครื่องหมาย</label>
              <select value={newRule.operator} onChange={(e) => setNewRule({...newRule, operator: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none text-sm">
                <option value=">">มากกว่า</option><option value="<">น้อยกว่า</option><option value="=">เท่ากับ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">ค่า (Value)</label>
              <input type="number" required step="0.1" value={newRule.value} onChange={(e) => setNewRule({...newRule, value: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">สั่งงาน (THEN)</label>
              <select value={newRule.actionDevice} onChange={(e) => setNewRule({...newRule, actionDevice: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none text-sm">
                {devices.map(d => (<option key={d.id} value={d.id}>{d.name}</option>))}
                
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">สถานะ (Action)</label>
              <select value={newRule.actionState} onChange={(e) => setNewRule({...newRule, actionState: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none text-sm">
                <option value="true">เปิด (ON)</option><option value="false">ปิด (OFF)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">ยกเลิก</button>
            <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-lg shadow-emerald-200">บันทึกกฎ</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRuleModal;
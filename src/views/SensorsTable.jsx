import React from 'react';
import { Calendar } from 'lucide-react';

const SensorsTable = ({ historyData }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="font-bold text-lg text-slate-800">ข้อมูลเซ็นเซอร์ย้อนหลัง (Data Log)</h3>
        <div className="flex gap-2">
          <div className="flex items-center border border-slate-200 rounded-lg px-2 bg-slate-50">
            <Calendar size={16} className="text-slate-400 mr-2"/>
            <input type="date" className="bg-transparent border-none text-sm text-slate-600 focus:outline-none py-1.5"/>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Timestamp</th>
              <th className="p-4 font-semibold text-right">Air Temp</th>
              <th className="p-4 font-semibold text-right">Air Hum</th>
              <th className="p-4 font-semibold text-right">Soil Temp</th>
              <th className="p-4 font-semibold text-right">Soil Hum</th>
              <th className="p-4 font-semibold text-right">pH</th>
              <th className="p-4 font-semibold text-right">EC</th>
              <th className="p-4 font-semibold text-right">N</th>
              <th className="p-4 font-semibold text-right">P</th>
              <th className="p-4 font-semibold text-right">K</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {historyData && historyData.length > 0 ? (
              historyData.map((row) => (
                <tr key={row.id || Math.random()} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium font-mono text-slate-500">{row.timestamp}</td>
                  <td className="p-4 text-right">{row.air_temp}</td>
                  <td className="p-4 text-right">{row.air_humidity}</td>
                  <td className="p-4 text-right">{row.soil_temp}</td>
                  <td className="p-4 text-right">{row.soil_moisture}</td>
                  <td className="p-4 text-right">{row.ph}</td>
                  <td className="p-4 text-right">{row.ec}</td>
                  <td className="p-4 text-right text-blue-600">{row.n}</td>
                  <td className="p-4 text-right text-orange-600">{row.p}</td>
                  <td className="p-4 text-right text-red-600">{row.k}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="10" className="p-8 text-center text-slate-400">กำลังโหลดข้อมูล... หรือไม่มีข้อมูลย้อนหลัง</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SensorsTable;
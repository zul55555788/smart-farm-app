import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Database, X } from 'lucide-react';

const SensorsTable = ({ historyData }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const tableContainerRef = useRef(null); // อ้างอิงตัวกล่องตารางเพื่อใช้ Scroll

  // ฟังก์ชันเช็คว่าแถวนี้ตรงกับวันที่เลือกไหม
  const isRowMatched = (timestamp) => {
    if (!selectedDate) return false;
    try {
      // แปลง timestamp "dd/MM/yyyy HH:mm" -> "yyyy-mm-dd"
      const datePart = timestamp.split(' ')[0];
      const [day, month, year] = datePart.split('/');
      const rowDateISO = `${year}-${month}-${day}`;
      return rowDateISO === selectedDate;
    } catch (e) {
      return false;
    }
  };

  // Effect: เมื่อเลือกวันที่ ให้เลื่อน (Scroll) ไปหาแถวแรกที่เจอทันที
  useEffect(() => {
    if (selectedDate && historyData) {
      // หา index ของแถวแรกที่ตรงกับวันที่
      const firstMatchIndex = historyData.findIndex(row => isRowMatched(row.timestamp));
      
      if (firstMatchIndex !== -1) {
        // หา Element แถวนั้นด้วย ID
        const rowElement = document.getElementById(`row-${firstMatchIndex}`);
        if (rowElement) {
          rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [selectedDate, historyData]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full max-h-[800px]">
      
      {/* Header Section */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
        <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-slate-800">ข้อมูลเซ็นเซอร์ย้อนหลัง (Data Log)</h3>
            <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-full font-mono">
                {historyData ? historyData.length : 0} รายการ
            </span>
        </div>
        <div className="flex gap-2">
          <div className={`flex items-center border rounded-lg px-2 relative transition-colors ${selectedDate ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
            <Calendar size={16} className={`${selectedDate ? 'text-red-500' : 'text-slate-400'} mr-2`}/>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`bg-transparent border-none text-sm focus:outline-none py-1.5 ${selectedDate ? 'text-red-700 font-bold' : 'text-slate-600'}`}
            />
            {selectedDate && (
              <button 
                onClick={() => setSelectedDate('')}
                className="ml-2 p-1 rounded-full hover:bg-red-200 text-red-500 transition-colors"
                title="ล้างการค้นหา"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Container - Scrollable Area */}
      <div ref={tableContainerRef} className="overflow-auto custom-scrollbar flex-1">
        <table className="w-full text-left border-collapse relative">
          <thead className="sticky top-0 z-10 shadow-sm">
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold sticky top-0 bg-slate-50">Timestamp</th>
              <th className="p-4 font-semibold text-right sticky top-0 bg-slate-50">Air Temp</th>
              <th className="p-4 font-semibold text-right sticky top-0 bg-slate-50">Air Hum</th>
              <th className="p-4 font-semibold text-right sticky top-0 bg-slate-50">Soil Temp</th>
              <th className="p-4 font-semibold text-right sticky top-0 bg-slate-50">Soil Hum</th>
              <th className="p-4 font-semibold text-right sticky top-0 bg-slate-50">pH</th>
              <th className="p-4 font-semibold text-right sticky top-0 bg-slate-50">EC</th>
              <th className="p-4 font-semibold text-right sticky top-0 bg-slate-50">N</th>
              <th className="p-4 font-semibold text-right sticky top-0 bg-slate-50">P</th>
              <th className="p-4 font-semibold text-right sticky top-0 bg-slate-50">K</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {historyData && historyData.length > 0 ? (
              historyData.map((row, index) => {
                // เช็คว่าแถวนี้ตรงกับวันที่ค้นหาหรือไม่
                const isMatch = isRowMatched(row.timestamp);

                return (
                  <tr 
                    key={row.id || index} 
                    id={`row-${index}`} // กำหนด ID ให้แต่ละแถวเพื่อใช้ Scroll ไปหา
                    className={`transition-colors duration-500 
                      ${isMatch 
                        ? 'bg-red-100 border-l-4 border-l-red-500' // ถ้าตรง: พื้นแดง ขอบซ้ายแดงเข้ม
                        : 'hover:bg-slate-50 border-l-4 border-l-transparent' // ถ้าไม่ตรง: ปกติ
                      }`
                    }
                  >
                    <td className={`p-4 font-medium font-mono whitespace-nowrap ${isMatch ? 'text-red-900 font-bold' : 'text-slate-500'}`}>
                      {row.timestamp}
                    </td>
                    <td className="p-4 text-right">{row.air_temp}</td>
                    <td className="p-4 text-right">{row.air_humidity}</td>
                    <td className="p-4 text-right">{row.soil_temp}</td>
                    <td className="p-4 text-right">{row.soil_moisture}</td>
                    <td className="p-4 text-right">{row.ph}</td>
                    <td className="p-4 text-right">{row.ec}</td>
                    <td className="p-4 text-right text-blue-600 font-medium">{row.n}</td>
                    <td className="p-4 text-right text-orange-600 font-medium">{row.p}</td>
                    <td className="p-4 text-right text-red-600 font-medium">{row.k}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                 <td colSpan="10" className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                    <Database size={32} className="opacity-20"/>
                    <span>ไม่พบข้อมูลย้อนหลัง</span>
                 </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SensorsTable;
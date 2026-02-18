import React, { useMemo } from 'react';
import { Wind, Layers, Activity, Sprout } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ComposedChart, Line, BarChart, Bar 
} from 'recharts';

const HistoryAnalytics = ({ graphData }) => {
  
  // 🟢 เพิ่มส่วนนี้: คำนวณข้อมูลที่จะแสดงในกราฟ
  const chartData = useMemo(() => {
    if (!graphData || graphData.length === 0) return [];
    
    // เลือกวิธีตัดข้อมูล: เอา 20 ตัวล่าสุด (Last 20)
    // ถ้าอยากได้มากกว่านี้ เปลี่ยนเลข 20 เป็นเลขอื่น
    const limit = 50; 
    
    // ถ้าข้อมูลมีมากกว่า limit ให้ตัดเอาเฉพาะส่วนท้าย
    if (graphData.length > limit) {
      return graphData.slice(graphData.length - limit);
    }
    
    return graphData;
  }, [graphData]);

  return (
    <div className="space-y-6">
      {/* --- กราฟสภาพอากาศ --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Wind size={20} className="text-blue-500"/> สภาพอากาศ (Air Condition)
            {/* แสดงข้อความบอกว่ากำลังแสดงข้อมูลล่าสุด */}
            <span className="text-xs font-normal text-slate-400 ml-auto">
               (แสดง {chartData.length} รายการล่าสุด)
            </span>
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}> {/* 🟢 ใช้ chartData แทน graphData */}
              <defs>
                <linearGradient id="colorAirTemp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient>
                <linearGradient id="colorAirHum" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend />
              <Area type="monotone" dataKey="airTemp" stroke="#f43f5e" fill="url(#colorAirTemp)" name="Air Temp (°C)" strokeWidth={2} />
              <Area type="monotone" dataKey="airHum" stroke="#3b82f6" fill="url(#colorAirHum)" name="Air Humidity (%)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- กราฟดิน --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
         <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Layers size={20} className="text-emerald-500"/> ดิน (Soil Condition)</h3>
         <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}> {/* 🟢 ใช้ chartData */}
                  <defs>
                    <linearGradient id="colorSoilHum" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                    <linearGradient id="colorSoilTemp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip contentStyle={{ borderRadius: '12px' }} />
                  <Legend />
                  <Area type="monotone" dataKey="soilMoisture" stroke="#10b981" fill="url(#colorSoilHum)" name="Soil Moisture (%)" strokeWidth={2} />
                  <Area type="monotone" dataKey="soilTemp" stroke="#f59e0b" fill="url(#colorSoilTemp)" name="Soil Temp (°C)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>
      
      {/* --- กราฟเคมีและธาตุอาหาร --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Activity size={20} className="text-purple-500"/> เคมีในดิน (Chemical)</h3>
            <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}> {/* 🟢 ใช้ chartData */}
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="time" hide />
                      <YAxis yAxisId="left" domain={[0, 14]} label={{ value: 'pH', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 5]} label={{ value: 'EC', angle: 90, position: 'insideRight' }} />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="ph" stroke="#8b5cf6" name="pH" strokeWidth={2} dot={false} />
                      <Line yAxisId="right" type="monotone" dataKey="ec" stroke="#6366f1" name="EC (mS/cm)" strokeWidth={2} dot={false} />
                  </ComposedChart>
               </ResponsiveContainer>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Sprout size={20} className="text-green-600"/> ธาตุอาหาร (Nutrients)</h3>
            <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}> {/* 🟢 ใช้ chartData */}
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="time" hide />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="n" fill="#3b82f6" name="N" stackId="a" />
                      <Bar dataKey="p" fill="#f59e0b" name="P" stackId="a" />
                      <Bar dataKey="k" fill="#ef4444" name="K" stackId="a" />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
};

export default HistoryAnalytics;
import React from 'react';

const NPKBar = ({ label, value, max, color }) => (
  <div className="mb-3">
    <div className="flex justify-between text-xs mb-1 font-medium">
      <span className="text-slate-600">{label}</span>
      <span className="text-slate-800">{value} mg/kg</span>
    </div>
    <div className="w-full bg-slate-100 rounded-full h-2.5">
      <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: `${(value/max)*100}%`, backgroundColor: color }}></div>
    </div>
  </div>
);

export default NPKBar;
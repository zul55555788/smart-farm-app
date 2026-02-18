import React from 'react';

const StatCard = ({ title, value, unit, icon: Icon, color, subValue, trend, subtitle }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 rounded-full opacity-10 group-hover:opacity-20 transition-opacity`} style={{ backgroundColor: color }}></div>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-opacity-10`} style={{ backgroundColor: color }}>
        <Icon size={24} style={{ color: color }} />
      </div>
      {trend && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
          {trend === 'up' ? '↑ High' : '↓ Normal'}
        </span>
      )}
    </div>
    <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
    <div className="flex items-baseline gap-1">
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      <span className="text-sm text-slate-400">{unit}</span>
    </div>
    {subtitle && <p className="text-[10px] uppercase text-slate-400 mt-1 font-semibold tracking-wider">{subtitle}</p>}
    {subValue && <p className="text-xs text-slate-400 mt-2">{subValue}</p>}
  </div>
);

export default StatCard;
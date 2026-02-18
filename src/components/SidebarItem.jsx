import React from 'react';
import { Sparkles } from 'lucide-react';

const SidebarItem = ({ id, icon: Icon, label, special, activeTab, setActiveTab, setSidebarOpen }) => (
  <button 
    onClick={() => { setActiveTab(id); setSidebarOpen(false); }} 
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1 ${activeTab === id ? special ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
  >
    <Icon size={20} className={special ? (activeTab !== id ? 'text-indigo-400 group-hover:text-white' : '') : ''} />
    <span className="font-medium">{label}</span>
    {special && <Sparkles size={16} className={`ml-auto ${activeTab === id ? 'text-yellow-300' : 'text-indigo-400'}`} />}
  </button>
);

export default SidebarItem;
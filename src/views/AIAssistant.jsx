import React from 'react';
import { Bot, Sparkles, X, Camera, Send } from 'lucide-react';

const AIAssistant = ({ 
  chatHistory, 
  aiInput, setAiInput, 
  isThinking, 
  onSendMessage, 
  selectedImage, 
  onImageSelect, 
  clearImage, 
  fileInputRef,
  chatEndRef,
  sensorData
}) => {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-indigo-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500 p-2 rounded-lg text-white"><Bot size={24} /></div>
          <div><h3 className="font-bold text-slate-800">Smart Farm Assistant</h3><p className="text-xs text-slate-500">Powered by Gemini AI • เชื่อมต่อข้อมูล Real-time</p></div>
        </div>
        <div className="text-xs text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full font-medium hidden sm:block">Context: {sensorData.airTemp}°C, {sensorData.soilMoisture}% Soil</div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl shadow-sm whitespace-pre-line ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'}`}>
              {msg.role === 'model' && <div className="flex items-center gap-2 mb-2 text-indigo-500 font-bold text-xs"><Sparkles size={12} /> AI Advice</div>}
              {msg.image && (<div className="mb-3 rounded-lg overflow-hidden border border-white/20"><img src={msg.image} alt="User upload" className="max-w-full h-auto max-h-64" /></div>)}
              {msg.text}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-slate-500 text-sm">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span><span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></span><span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></span>กำลังวิเคราะห์ข้อมูล...
            </div>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        {selectedImage && (
          <div className="mb-2 flex items-center gap-2 bg-indigo-50 p-2 rounded-lg w-fit border border-indigo-100">
            <img src={selectedImage.previewUrl} alt="Preview" className="w-12 h-12 object-cover rounded-md" />
            <div className="flex flex-col"><span className="text-xs text-indigo-700 font-medium truncate max-w-[150px]">{selectedImage.file.name}</span><span className="text-[10px] text-indigo-400">พร้อมส่งให้ AI วิเคราะห์</span></div>
            <button onClick={clearImage} className="p-1 hover:bg-indigo-200 rounded-full text-indigo-500 transition-colors ml-2"><X size={14} /></button>
          </div>
        )}
        <div className="flex gap-2 relative items-end">
          <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={onImageSelect} />
          <button onClick={() => fileInputRef.current.click()} className="p-3 mb-[1px] bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 hover:text-indigo-600 transition-all border border-slate-200" title="แนบรูปภาพ"><Camera size={20} /></button>
          <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && onSendMessage()} placeholder={selectedImage ? "พิมพ์คำถามเกี่ยวกับรูปภาพ..." : "ถามปัญหาการเกษตร..."} className="flex-1 pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50" />
          <button onClick={onSendMessage} disabled={isThinking || (!aiInput.trim() && !selectedImage)} className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"><Send size={18} /></button>
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
            <button onClick={() => setAiInput('วิเคราะห์สุขภาพฟาร์มให้หน่อย')} className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-full border border-slate-200 transition-colors whitespace-nowrap">📊 วิเคราะห์ภาพรวม</button>
            <button onClick={() => setAiInput('ตอนนี้ควรใส่ปุ๋ยไหม?')} className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-full border border-slate-200 transition-colors whitespace-nowrap">🧪 ควรใส่ปุ๋ยไหม?</button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
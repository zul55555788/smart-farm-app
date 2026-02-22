import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Activity, Zap, Settings, LogOut, Menu, Sprout, History, Cpu, User, Bot, Plus } from 'lucide-react';

// --- Imports (Config & Components) ---
import { apiKey, SHEET_API_URL } from './config';
import LoginScreen from './components/LoginScreen';
import SidebarItem from './components/SidebarItem';
import TimerModal from './components/TimerModal';
import AddRuleModal from './components/AddRuleModal'; 

// --- Imports (Views) ---
import Dashboard from './views/Dashboard';
import DeviceControl from './views/DeviceControl';
import HistoryAnalytics from './views/HistoryAnalytics';
import Automation from './views/Automation'; 
import SettingsView from './views/Settings'; 
import AIAssistant from './views/AIAssistant'; 
import SensorsTable from './views/SensorsTable';

// --- Main App Component ---
const SmartFarmPro = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [lastUpdateTime, setLastUpdateTime] = useState('-');

  // 1️⃣ Data State
  const [sensorData, setSensorData] = useState({ airTemp: 0, airHum: 0, soilTemp: 0, soilMoisture: 0, ph: 0, ec: 0, n: 0, p: 0, k: 0 });
  const [realSensorHistory, setRealSensorHistory] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [devices, setDevices] = useState([
    { id: 'pump1', name: 'ปั๊มน้ำหลัก', type: 'pump', status: false, lastActive: '-', schedule: null },
    { id: 'vitA', name: 'ปั๊มวิตามิน A', type: 'chemical', status: false, lastActive: '-', schedule: null },
    { id: 'vitB', name: 'ปั๊มวิตามิน B', type: 'chemical', status: false, lastActive: '-', schedule: null },
    { id: 'fan', name: 'พัดลมระบายอากาศ', type: 'fan', status: false, lastActive: '-', schedule: null },
    { id: 'led', name: 'ไฟ LED โรงเรือน', type: 'light', status: false, lastActive: '-', schedule: null },
  ]);

  // 2️⃣ Automation & Logs
  const [rules, setRules] = useState([]); 
  const [systemLogs, setSystemLogs] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [schedules, setSchedules] = useState([]); 
  
  // 🟢 State สำหรับเก็บคิวงานตั้งเวลาของระบบนาฬิกา
  const [scheduledTasks, setScheduledTasks] = useState([]);
  
  // 3️⃣ UI States
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [selectedDeviceForTimer, setSelectedDeviceForTimer] = useState(null);
  const [timerMode, setTimerMode] = useState('timer');
  const [scheduleConfig, setScheduleConfig] = useState({ durationVal: '10', durationUnit: 'minutes', timeSlots: [{ id: 1, time: '08:00', active: true }, { id: 2, time: '12:00', active: false }, { id: 3, time: '17:00', active: false }], repeatMode: 'everyday', selectedDays: [0, 1, 2, 3, 4, 5, 6] });
  
  const [isAddRuleModalOpen, setIsAddRuleModalOpen] = useState(false);
  const [newRule, setNewRule] = useState({ name: '', sensor: 'airTemp', operator: '>', value: '', actionDevice: 'pump1', actionState: 'true' });

  // 4️⃣ AI Chat State
  const [aiChatHistory, setAiChatHistory] = useState([{ role: 'model', text: 'สวัสดีครับ ผมคือผู้ช่วย AI ประจำฟาร์มของคุณ มีปัญหาเรื่องการปลูกพืช หรือต้องการวิเคราะห์ข้อมูลฟาร์ม ถามผมได้เลยครับ! 🌱' }]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  // --- Functions ---
  const fetchRealData = async () => {
    try {
      const sensorRes = await fetch(`${SHEET_API_URL}?action=getSensor`);
      const sensorJson = await sensorRes.json();
      if (sensorJson) {
        setSensorData(prev => ({
          ...prev,
          airTemp: parseFloat(sensorJson.air_temp) || 0,
          airHum: parseFloat(sensorJson.air_humidity) || 0,
          soilTemp: parseFloat(sensorJson.soil_temp) || prev.soilTemp || 0,
          soilMoisture: parseFloat(sensorJson.soil_moisture) || 0,
          ph: parseFloat(sensorJson.ph) || 0,
          ec: parseFloat(sensorJson.ec) || prev.ec || 0,
          n: parseFloat(sensorJson.n) || prev.n || 0,
          p: parseFloat(sensorJson.p) || prev.p || 0,
          k: parseFloat(sensorJson.k) || prev.k || 0,
        }));
        setLastUpdateTime(new Date().toLocaleTimeString('th-TH'));
      }

      const deviceRes = await fetch(`${SHEET_API_URL}?action=getDevices`);
      const deviceJson = await deviceRes.json();
      if (Array.isArray(deviceJson)) {
        setDevices(prevDevices => 
          prevDevices.map(localDev => {
            const remoteDev = deviceJson.find(r => r.device === localDev.id || r.device === localDev.name);
            if (remoteDev) {
              return { ...localDev, status: remoteDev.state === 'ON' || remoteDev.state === 1 || remoteDev.state === true };
            }
            return localDev;
          })
        );
      }

      const logsRes = await fetch(`${SHEET_API_URL}?action=getLogs`);
      const logsJson = await logsRes.json();
      if (Array.isArray(logsJson)) setSystemLogs(logsJson);

      const historyRes = await fetch(`${SHEET_API_URL}?action=getSensorHistory`);
      const historyJson = await historyRes.json();
      if (Array.isArray(historyJson)) {
          setRealSensorHistory(historyJson);
          const formattedGraphData = [...historyJson].reverse().map(item => ({
            time: item.timestamp.split(' ')[1],
            fullDate: item.timestamp,
            airTemp: parseFloat(item.air_temp), airHum: parseFloat(item.air_humidity),
            soilTemp: parseFloat(item.soil_temp), soilMoisture: parseFloat(item.soil_moisture),
            ph: parseFloat(item.ph), ec: parseFloat(item.ec),
            n: parseFloat(item.n), p: parseFloat(item.p), k: parseFloat(item.k)
          }));
          setGraphData(formattedGraphData);
      }

      const rulesRes = await fetch(`${SHEET_API_URL}?action=getRules`);
      const rulesJson = await rulesRes.json();
      if (Array.isArray(rulesJson)) {
          const formattedRules = rulesJson.map(r => ({ ...r, active: r.active === true || r.active === 'TRUE' || r.active === 'true', actionState: String(r.actionState) }));
          setRules(formattedRules);
      }
    } catch (err) { }
  };

  const sendControlToAPI = async (deviceId, state, mode = 'manual', duration = 0) => {
    try {
      await fetch(SHEET_API_URL, {
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'control_device', device_id: deviceId, state: state ? 'ON' : 'OFF', mode: mode, duration: duration })
      });
      if(mode === 'manual') setTimeout(() => { fetchRealData(); }, 1000);
    } catch (error) { console.error("Error sending command:", error); }
  };

  const addSystemLog = (message, type = 'info') => {
    const id = Date.now();
    const newLog = { id, time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }), message, type };
    setSystemLogs(prev => [newLog, ...prev].slice(0, 20));
    setToasts(prev => [...prev, newLog]);
    setTimeout(() => { setToasts(prev => prev.filter(log => log.id !== id)); }, 4000);
  };

  const getDeviceName = (id) => { if (id === 'notify') return 'แจ้งเตือน Line'; const dev = devices.find(d => d.id === id); return dev ? dev.name : id; };

  // --- Effects ---
  useEffect(() => {
    if (isLoggedIn) {
      fetchRealData();
      const interval = setInterval(fetchRealData, 3000); 
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const checkAutomation = () => {
      rules.forEach(rule => {
        if (!rule.active) return;
        let currentValue = 0;
        if (rule.sensor === 'airTemp') currentValue = sensorData.airTemp;
        else if (rule.sensor === 'airHum') currentValue = sensorData.airHum;
        else if (rule.sensor === 'soilMoisture') currentValue = sensorData.soilMoisture;
        else if (rule.sensor === 'soilTemp') currentValue = sensorData.soilTemp;
        else if (rule.sensor === 'ph') currentValue = sensorData.ph;
        else if (rule.sensor === 'ec') currentValue = sensorData.ec;

        let isConditionMet = false;
        const ruleValue = parseFloat(rule.value);
        if (rule.operator === '>' && currentValue > ruleValue) isConditionMet = true;
        if (rule.operator === '<' && currentValue < ruleValue) isConditionMet = true;
        if (rule.operator === '=' && Math.abs(currentValue - ruleValue) < 0.1) isConditionMet = true;

        if (isConditionMet) {
            if (rule.actionDevice !== 'notify') {
                const targetDevice = devices.find(d => d.id === rule.actionDevice);
                const targetState = String(rule.actionState) === 'true'; 
                if (targetDevice && targetDevice.status !== targetState) {
                    addSystemLog(`🤖 กฎ "${rule.name}" ทำงาน: สั่ง ${targetDevice.name} -> ${targetState ? 'เปิด' : 'ปิด'}`, 'warning');
                    sendControlToAPI(targetDevice.id, targetState, 'auto');
                    setDevices(prev => prev.map(d => d.id === targetDevice.id ? { ...d, status: targetState } : d));
                }
            }
        }
      });
    };
    checkAutomation();
  }, [sensorData, rules, devices, isLoggedIn]);

  // ---------------------------------------------------------
  // ⏰ ระบบนาฬิกาคอยเช็คเวลาอัตโนมัติ (รันทุกๆ 1 วินาที)
  // ---------------------------------------------------------
  useEffect(() => {
    if (!isLoggedIn) return; // ไม่ทำงานถ้ายังไม่ล็อกอิน

    const clock = setInterval(() => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }); 
      const currentDay = now.getDay(); 

      setScheduledTasks(prevTasks => {
        let isUpdated = false;
        
        const newTasks = prevTasks.filter(task => {
          
          // โหมด 1: นับถอยหลัง (Timer) ปิดอุปกรณ์
          if (task.timerMode === 'timer') {
            if (now.getTime() >= task.executeAtTime) {
              console.log(`⏰ ถึงเวลา! สั่งงาน: ${task.deviceId} -> ${task.action}`);
              
              sendControlToAPI(task.deviceId, task.action === 'ON', 'auto', 0);
              addSystemLog(`ครบเวลาที่ตั้งไว้: สั่ง ${task.action === 'ON' ? 'เปิด' : 'ปิด'} ${getDeviceName(task.deviceId)} อัตโนมัติ`, 'warning');
              
              return false; // ทำเสร็จแล้ว ลบออก
            }
            return true;
          }

          // โหมด 2: ตั้งเวลา (Schedule) เปิดอุปกรณ์
          if (task.timerMode === 'schedule') {
            const isToday = task.config.repeatMode === 'everyday' || 
                            (task.config.repeatMode === 'custom' && task.config.selectedDays.includes(currentDay)) ||
                            task.config.repeatMode === 'once';

            if (isToday) {
              task.config.timeSlots.forEach(slot => {
                // เช็คว่าถึงเวลาที่ตั้งไว้พอดี และยังไม่ได้ส่งคำสั่ง
                if (slot.active && slot.time === currentTime && !slot.hasExecuted) {
                  console.log(`⏰ ถึงเวลา! สั่งงาน: ${task.deviceId} -> ${task.action}`);
                  
                  // สั่งเปิดเครื่อง
                  sendControlToAPI(task.deviceId, true, 'auto', task.config.durationVal);
                  addSystemLog(`⏰ ระบบตั้งเวลาอัตโนมัติ: สั่งเปิด ${getDeviceName(task.deviceId)}`, 'info');
                  
                  // คำนวณเวลาปิด แล้วเพิ่มคิวลงไปแบบโหมด 1
                  let durationMs = task.config.durationVal * 1000;
                  if (task.config.durationUnit === 'minutes') durationMs *= 60;
                  if (task.config.durationUnit === 'hours') durationMs *= 3600;

                  // แทรกคิวสั่งปิดแบบเงียบๆ
                  setTimeout(() => {
                     setScheduledTasks(current => [...current, {
                        id: Date.now(),
                        deviceId: task.deviceId,
                        timerMode: 'timer',
                        executeAtTime: new Date().getTime() + durationMs,
                        action: 'OFF'
                     }]);
                  }, 500);
                  
                  slot.hasExecuted = true; 
                  isUpdated = true;
                }
              });

              // ปลดล็อคเมื่อผ่านนาทีนั้นไปแล้ว
              task.config.timeSlots.forEach(slot => {
                if (slot.time !== currentTime && slot.hasExecuted) {
                  slot.hasExecuted = false;
                  isUpdated = true;
                }
              });
            }

            // ถ้าเป็นโหมดครั้งเดียว และทำเสร็จหมดแล้ว ให้ลบทิ้ง
            if (task.config.repeatMode === 'once' && task.config.timeSlots.every(s => !s.active || s.hasExecuted)) {
               return false; 
            }
            return true;
          }
          return true;
        });

        return isUpdated || newTasks.length !== prevTasks.length ? newTasks : prevTasks;
      });

    }, 1000); 

    return () => clearInterval(clock);
  }, [isLoggedIn, devices]);

  // --- Handlers ---
  const handleDeviceClick = (device) => {
    if (device.status) {
      setDevices(prev => prev.map(d => d.id === device.id ? { ...d, status: false } : d));
      addSystemLog(`สั่งปิด ${device.name}`, 'normal');
      sendControlToAPI(device.id, false); 
    } else {
      setSelectedDeviceForTimer(device);
      setScheduleConfig({ durationVal: '10', durationUnit: 'minutes', timeSlots: [{ id: 1, time: '08:00', active: true }, { id: 2, time: '12:00', active: false }, { id: 3, time: '17:00', active: false }], repeatMode: 'everyday', selectedDays: [0, 1, 2, 3, 4, 5, 6] });
      setTimerMode('timer');
      setShowTimerModal(true);
    }
  };

  // 🟢 ฟังก์ชันนี้ถูกแก้ไขเพื่อรองรับระบบนาฬิกา
  const confirmTimerSettings = () => {
    if (!selectedDeviceForTimer) return;
    const val = parseInt(scheduleConfig.durationVal);
    if (!val || val <= 0) return;
    let unitLabel = scheduleConfig.durationUnit === 'seconds' ? 'วินาที' : scheduleConfig.durationUnit === 'minutes' ? 'นาที' : 'ชั่วโมง';
    
    if (timerMode === 'timer') {
        // --- 1. โหมดสั่งเปิดทันที และนับถอยหลังปิด ---
        let durationMs = val * 1000;
        if (scheduleConfig.durationUnit === 'minutes') durationMs *= 60;
        if (scheduleConfig.durationUnit === 'hours') durationMs *= 3600;

        const executeAtTime = new Date().getTime() + durationMs;

        setDevices(prev => prev.map(d => d.id === selectedDeviceForTimer.id ? { ...d, status: true } : d));
        addSystemLog(`สั่งเปิด ${selectedDeviceForTimer.name} เป็นเวลา ${val} ${unitLabel}`, 'success');
        sendControlToAPI(selectedDeviceForTimer.id, true, 'manual', val); 

        // โยนคิวสั่ง "ปิด" เข้าไปในระบบนาฬิกา
        setScheduledTasks(prev => [...prev, {
          id: Date.now(),
          deviceId: selectedDeviceForTimer.id,
          timerMode: 'timer',
          executeAtTime: executeAtTime,
          action: 'OFF'
        }]);

    } else {
        // --- 2. โหมดตั้งเวลาล่วงหน้า (Schedule) ---
        const newSchedule = { id: Date.now(), deviceId: selectedDeviceForTimer.id, config: { ...scheduleConfig } };
        
        // เซฟลง UI ให้เห็นว่าตั้งเวลาไว้แล้ว
        setSchedules(prev => [...prev.filter(s => s.deviceId !== selectedDeviceForTimer.id), newSchedule]);
        const activeSlots = scheduleConfig.timeSlots.filter(s => s.active).length;
        setDevices(prev => prev.map(d => d.id === selectedDeviceForTimer.id ? { ...d, schedule: `${activeSlots} เวลา` } : d));
        addSystemLog(`ตั้งเวลา ${selectedDeviceForTimer.name} เรียบร้อย`, 'info');

        // โยนคิวสั่ง "เปิด" เข้าไปในระบบนาฬิกา
        setScheduledTasks(prev => [...prev, {
          id: Date.now(),
          deviceId: selectedDeviceForTimer.id,
          timerMode: 'schedule',
          config: JSON.parse(JSON.stringify(scheduleConfig)), 
          action: 'ON'
        }]);
    }
    
    setShowTimerModal(false);
    setSelectedDeviceForTimer(null);
  };

  // 🟢 ฟังก์ชันยกเลิกคิวงาน
  const cancelSchedule = (deviceId) => { 
    setSchedules(prev => prev.filter(s => s.deviceId !== deviceId)); 
    setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, schedule: null } : d)); 
    
    // เคลียร์ออกจากคิวระบบนาฬิกาด้วย
    setScheduledTasks(prev => prev.filter(t => t.deviceId !== deviceId));
    
    addSystemLog(`ยกเลิกการตั้งเวลาของ ${getDeviceName(deviceId)}`, 'warning'); 
  };

  const toggleRule = async (id) => {
    const targetRule = rules.find(r => r.id === id);
    if (!targetRule) return;
    const newActiveState = !targetRule.active;
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: newActiveState } : r));
    
    if (!newActiveState && targetRule.actionDevice !== 'notify') {
         sendControlToAPI(targetRule.actionDevice, false, 'auto');
         setDevices(prev => prev.map(d => d.id === targetRule.actionDevice ? { ...d, status: false } : d));
         addSystemLog(`⛔ ปิดกฎ "${targetRule.name}" -> สั่งปิด ${getDeviceName(targetRule.actionDevice)} ทันที`, 'warning');
    }

    try {
        await fetch(SHEET_API_URL, {
            method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'toggle_rule', rule_id: id, active: newActiveState })
        });
        if(newActiveState) addSystemLog(`เปลี่ยนสถานะกฎ "${targetRule.name}": เปิดใช้งาน`, 'info');
    } catch (error) { console.error(error); }
  };

  const deleteRule = async (id, ruleName) => {
    if (window.confirm(`คุณต้องการลบกฎ "${ruleName}" ใช่หรือไม่?`)) {
      setRules(prev => prev.filter(r => r.id !== id));
      addSystemLog(`กำลังลบกฎ: ${ruleName}`, 'warning');
      try {
          await fetch(SHEET_API_URL, {
            method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete_rule', rule_id: id })
          });
          setTimeout(() => { fetchRealData(); }, 1500);
      } catch (error) {}
    }
  };

  const handleAddRule = async (e) => {
    e.preventDefault();
    const ruleToAdd = {
        name: newRule.name, sensor: newRule.sensor, operator: newRule.operator,
        value: parseFloat(newRule.value), actionDevice: newRule.actionDevice,
        actionState: newRule.actionState, active: true
    };
    const tempId = Date.now();
    setRules(prev => [...prev, { ...ruleToAdd, id: tempId }]);
    setIsAddRuleModalOpen(false);
    setNewRule({ name: '', sensor: 'airTemp', operator: '>', value: '', actionDevice: 'pump1', actionState: 'true' });
    addSystemLog(`กำลังบันทึกกฎ: ${ruleToAdd.name}`, 'info');

    try {
        await fetch(SHEET_API_URL, {
            method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'add_rule', ...ruleToAdd })
        });
        setTimeout(() => { fetchRealData(); addSystemLog(`บันทึกกฎสำเร็จ`, 'success'); }, 1500);
    } catch (error) {}
  };

  // AI & Handlers
  useEffect(() => { if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' }); }, [aiChatHistory]);
  const convertToBase64 = (file) => new Promise((resolve, reject) => { const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = () => resolve(reader.result); reader.onerror = error => reject(error); });
  const handleImageSelect = (e) => { const file = e.target.files[0]; if (file) { const previewUrl = URL.createObjectURL(file); setSelectedImage({ file, previewUrl }); } };
  const clearSelectedImage = () => { if (selectedImage?.previewUrl) URL.revokeObjectURL(selectedImage.previewUrl); setSelectedImage(null); if (fileInputRef.current) fileInputRef.current.value = ''; };
  
  const callGeminiAI = async (prompt, isAnalysis = false, imageBase64 = null, imageMimeType = null) => {
    setIsAiThinking(true);
    
    const farmContext = `
      Data: Air ${sensorData.airTemp}°C/${sensorData.airHum}%, Soil ${sensorData.soilTemp}°C/${sensorData.soilMoisture}%. 
      Devices: ${devices.filter(d=>d.status).map(d=>d.name).join(',')||'None'}. 
      Role: Expert Agricultural AI (Thai Language).
    `;
    
    const parts = [{ text: farmContext + "\n\nUser Question: " + (prompt || "Analyze Farm Status") }];
    if (imageBase64) parts.push({ inline_data: { mime_type: imageMimeType || "image/jpeg", data: imageBase64 } });

    const modelList = [
        "gemini-2.5-flash",        // รุ่น Stable (แนะนำ)
        "gemini-2.0-flash",        // รุ่นรอง (ใช้ได้ถึง มี.ค. 2026)
        "gemini-3-flash-preview",  // รุ่นใหม่ล่าสุด (Preview)
        "gemini-pro"               // รุ่นพื้นฐาน (เผื่อไว้สุดท้าย)
    ];

    let success = false;
    let finalError = "";

    for (const model of modelList) {
        try {
            console.log(`🤖 Trying AI Model: ${model}...`);
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ contents: [{ parts }] }) 
            });

            if (!res.ok) {
                const errData = await res.json().catch(()=>({}));
                if (res.status === 404) throw new Error(`Model ${model} not found`);
                throw new Error(errData.error?.message || `HTTP ${res.status}`);
            }

            const data = await res.json();
            const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (aiResponse) {
                const msg = { role: 'model', text: aiResponse };
                setAiChatHistory(prev => isAnalysis ? [...prev, { role: 'user', text: '⚡ วิเคราะห์สุขภาพฟาร์ม' }, msg] : [...prev, msg]);
                success = true;
                break; 
            }
        } catch (e) {
            console.warn(`❌ Model ${model} failed:`, e.message);
            finalError = e.message;
        }
    }

    if (!success) {
        const errorMsg = { role: 'model', text: `⚠️ ขออภัยครับ ระบบ AI ขัดข้อง\nสาเหตุ: ${finalError}\n(กรุณาตรวจสอบ API Key ใน config.js อีกครั้ง)` };
        setAiChatHistory(prev => [...prev, errorMsg]);
    }

    setIsAiThinking(false);
  };

  const handleSendMessage = async () => { if (!aiInput.trim() && !selectedImage) return; let img = null, mime = null; let msg = { role: 'user', text: aiInput }; if (selectedImage) { const b64 = await convertToBase64(selectedImage.file); img = b64.split(',')[1]; mime = selectedImage.file.type; msg.image = b64; if (!aiInput.trim()) msg.text = "ส่งรูปภาพ..."; } setAiChatHistory(prev => [...prev, msg]); const txt = aiInput; setAiInput(''); clearSelectedImage(); callGeminiAI(txt, false, img, mime); };
  const handleQuickAnalysis = () => { setActiveTab('ai-assistant'); callGeminiAI('', true); };

  if (!isLoggedIn) return <LoginScreen onLogin={(user) => { setCurrentUser(user); setIsLoggedIn(true); }} />;

  return (
    <div className="flex h-screen bg-[#F1F5F9] font-sans text-slate-800 overflow-hidden relative">
      
      {/* 🔴 Global Modals */}
      {showTimerModal && (
        <TimerModal 
          isOpen={showTimerModal} onClose={() => setShowTimerModal(false)}
          device={selectedDeviceForTimer} timerMode={timerMode} setTimerMode={setTimerMode}
          config={scheduleConfig} setConfig={setScheduleConfig} onConfirm={confirmTimerSettings}
        />
      )}

      {isAddRuleModalOpen && (
        <AddRuleModal 
          isOpen={isAddRuleModalOpen} onClose={() => setIsAddRuleModalOpen(false)}
          onSubmit={handleAddRule} devices={devices} newRule={newRule} setNewRule={setNewRule}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-emerald-500 p-2 rounded-lg"><Sprout className="text-white" size={20} /></div>
          <div><h1 className="text-xl font-bold tracking-tight">Smart Farm</h1><p className="text-xs text-slate-400">Pro Edition</p></div>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" activeTab={activeTab} setActiveTab={setActiveTab} setSidebarOpen={setSidebarOpen} />
          <SidebarItem id="ai-assistant" icon={Bot} label="ผู้ช่วย AI" special={true} activeTab={activeTab} setActiveTab={setActiveTab} setSidebarOpen={setSidebarOpen} />
          <SidebarItem id="sensors" icon={Activity} label="ข้อมูลเซ็นเซอร์" activeTab={activeTab} setActiveTab={setActiveTab} setSidebarOpen={setSidebarOpen} />
          <SidebarItem id="control" icon={Zap} label="ควบคุมอุปกรณ์" activeTab={activeTab} setActiveTab={setActiveTab} setSidebarOpen={setSidebarOpen} />
          <SidebarItem id="history" icon={History} label="ประวัติ & กราฟ" activeTab={activeTab} setActiveTab={setActiveTab} setSidebarOpen={setSidebarOpen} />
          <SidebarItem id="automation" icon={Cpu} label="ระบบอัตโนมัติ" activeTab={activeTab} setActiveTab={setActiveTab} setSidebarOpen={setSidebarOpen} />
          <SidebarItem id="settings" icon={Settings} label="คู่มือการใช้งาน" activeTab={activeTab} setActiveTab={setActiveTab} setSidebarOpen={setSidebarOpen} />
        </nav>
        <div className="p-4 border-t border-slate-800">
             <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all"><LogOut size={20} /><span className="font-medium">ออกจากระบบ</span></button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}
        
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-6 z-20 sticky top-0">
             <div className="flex items-center gap-4">
                 <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><Menu size={24} /></button>
                 <h2 className="text-lg font-bold text-slate-800 hidden sm:block">Smart Farm Dashboard</h2>
             </div>
             <div className="flex items-center gap-4">
                 <div className="text-right hidden xl:block"><p className="text-xs text-slate-400">Last Update</p><p className="text-sm font-mono font-medium text-slate-600">{lastUpdateTime}</p></div>
                 <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center"><User size={16} className="text-slate-500" /></div>
                 </div>
             </div>
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-8">
          
          {activeTab === 'dashboard' && (
            <Dashboard sensorData={sensorData} systemLogs={systemLogs} handleQuickAnalysis={handleQuickAnalysis} />
          )}

          {activeTab === 'ai-assistant' && (
            <AIAssistant 
                chatHistory={aiChatHistory} aiInput={aiInput} setAiInput={setAiInput}
                isThinking={isAiThinking} onSendMessage={handleSendMessage}
                selectedImage={selectedImage} onImageSelect={handleImageSelect} clearImage={clearSelectedImage}
                fileInputRef={fileInputRef} chatEndRef={chatEndRef} sensorData={sensorData}
            />
          )}

          {activeTab === 'sensors' && (
             <SensorsTable historyData={realSensorHistory} />
          )}

          {activeTab === 'control' && (
             <DeviceControl devices={devices} handleDeviceClick={handleDeviceClick} cancelSchedule={cancelSchedule} />
          )}

          {activeTab === 'history' && (
             <HistoryAnalytics graphData={graphData} />
          )}

          {activeTab === 'automation' && (
            <Automation 
                rules={rules} toggleRule={toggleRule} deleteRule={deleteRule}
                onOpenAddModal={() => setIsAddRuleModalOpen(true)} devices={devices}
            />
          )}

          {activeTab === 'settings' && <SettingsView />}
          
          {/* Toast Notifications */}
          <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            {toasts.map(log => (
                <div key={log.id} className="bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 animate-in slide-in-from-right duration-300">
                    <div className={`w-2 h-2 rounded-full ${log.type === 'success' ? 'bg-emerald-500' : log.type === 'warning' ? 'bg-orange-500' : log.type === 'info' ? 'bg-blue-500' : 'bg-slate-400'}`}></div>
                    <div><p className="text-xs text-slate-400">{log.time}</p><p className="text-sm font-medium text-slate-700">{log.message}</p></div>
                </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

const App = SmartFarmPro;
export default App;
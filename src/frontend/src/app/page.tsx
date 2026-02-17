"use client";
import { useState } from 'react';
import axios from 'axios';
import { Upload, ShieldCheck, FileText, AlertCircle, Search, Activity, Lock } from 'lucide-react';

// Mock Data to simulate the "Database" state for the demo
const MOCK_EVIDENCE = [
  { id: "EV-001", patient: "PT-10293", type: "Clinical Note", date: "2024-02-14", status: "GOLD", risk: "High", summary: "Patient reports persistent chest pain." },
  { id: "EV-002", patient: "PT-10293", type: "Lab Result", date: "2024-02-15", status: "SILVER", risk: "Pending", summary: " awaiting AI analysis..." },
  { id: "EV-003", patient: "PT-10293", type: "Raw DICOM", date: "2024-02-16", status: "BRONZE", risk: "N/A", summary: "Raw binary storage." },
];

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [patientId, setPatientId] = useState('PT-10293');
  const [status, setStatus] = useState('idle');
  const [evidenceList, setEvidenceList] = useState(MOCK_EVIDENCE);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);
    
    const meta = {
      patient_id: patientId,
      source_system: "WEB_DASHBOARD",
      evidence_type: "clinical_note",
      ai_confidence_score: 0.95
    };
    formData.append('metadata_json', JSON.stringify(meta));

    try {
      const res = await axios.post('http://localhost:8000/api/v1/evidence/ingest', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Simulate adding the new file to the table instantly
      const newEvidence = {
        id: res.data.evidence_id.split('/').pop() || "EV-NEW",
        patient: patientId,
        type: "Clinical Note",
        date: new Date().toISOString().split('T')[0],
        status: "SILVER", // Starts as Silver (Validated)
        risk: "Analyzing...",
        summary: "Processing..."
      };
      
      setEvidenceList([newEvidence, ...evidenceList]);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Sovereign Health Portal
          </span>
        </div>
        <div className="flex gap-4 text-sm font-medium text-slate-500">
          <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
          <span className="hover:text-blue-600 cursor-pointer">Patients</span>
          <span className="hover:text-blue-600 cursor-pointer">Audit Logs</span>
          <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs">
            <Lock className="w-3 h-3" /> Secure Connection
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Upload Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" /> Ingest Evidence
            </h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Patient ID</label>
                <input 
                  type="text" 
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition cursor-pointer relative">
                <input 
                  type="file" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-blue-600 font-medium">{file ? file.name : "Click to select file"}</p>
                <p className="text-xs text-slate-400 mt-1">PDF, TXT, DICOM supported</p>
              </div>
              <button 
                type="submit" 
                disabled={!file || status === 'uploading'}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition shadow-md hover:shadow-lg"
              >
                {status === 'uploading' ? 'Encrypting & Signing...' : 'Secure Upload'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Evidence Dashboard */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" /> Recent Activity
              </h2>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input type="text" placeholder="Search records..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none" />
              </div>
            </div>
            
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Patient</th>
                  <th className="px-6 py-3">Status (Tier)</th>
                  <th className="px-6 py-3">AI Analysis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {evidenceList.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" /> {item.type}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{item.patient}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                        item.status === 'GOLD' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        item.status === 'SILVER' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                        'bg-orange-50 text-orange-700 border-orange-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.status === 'GOLD' ? (
                        <div>
                          <p className="text-red-600 font-bold text-xs">Risk: {item.risk}</p>
                          <p className="text-slate-500 text-xs truncate w-32">{item.summary}</p>
                        </div>
                      ) : (
                        <button className="text-xs text-blue-600 font-medium hover:underline">
                          Run Analysis &rarr;
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
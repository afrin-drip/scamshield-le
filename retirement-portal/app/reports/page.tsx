'use client';
import { useState } from 'react';
export default function ReportsPage(){
  const [period,setPeriod]=useState<'monthly'|'quarterly'>('monthly');
  const [generating,setGenerating]=useState(false);
  function generateCSV(){
    setGenerating(true);
    setTimeout(()=>{
      const csv='Name,Room,Incidents,High Risk,Blocked
Dorothy Banks,204A,12,3,45
Harold Chen,112B,2,0,8
Margaret Ellis,305C,28,14,112';
      const blob=new Blob([csv],{type:'text/csv'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`scamshield-report-${period}-${new Date().toISOString().slice(0,7)}.csv`;a.click();URL.revokeObjectURL(url);setGenerating(false);
    },800);
  }
  return(<div><div className="mb-6"><h1 className="text-2xl font-bold text-white">Reports</h1><p className="text-gray-400 text-sm mt-1">Generate and export incident reports</p></div><div className="bg-gray-900 rounded-xl p-6 max-w-lg"><h2 className="text-sm font-semibold text-gray-300 mb-4">Generate Report</h2><div className="space-y-4"><div><label className="text-xs text-gray-400 block mb-2">Report Period</label><div className="flex gap-2">{(['monthly','quarterly'] as const).map(p=><button key={p} onClick={()=>setPeriod(p)} className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${period===p?'bg-red-600 border-red-600 text-white':'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'}`}>{p.charAt(0).toUpperCase()+p.slice(1)}</button>)}</div></div><button onClick={generateCSV} disabled={generating} className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors">{generating?'Generating…':'Export CSV Report'}</button></div></div></div>);
}
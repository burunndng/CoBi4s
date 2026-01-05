
import React from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';
import { AppState } from '../types';
import { INITIAL_STATE } from '../constants';

interface SettingsProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const AppSettings: React.FC<SettingsProps> = ({ state, setState }) => {
  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cognibias-data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setState(parsed);
        alert('Import successful.');
      } catch (err) {
        alert('Import failed: Invalid format.');
      }
    };
    reader.readAsText(file);
  };

  const resetData = () => {
    if (window.confirm('This will erase all progress. Continue?')) {
      setState(INITIAL_STATE as any);
      localStorage.removeItem('cognibias-storage');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-12">
      <header>
        <h1 className="serif text-3xl text-white">Settings</h1>
        <p className="text-slate-500 text-sm">System configuration and data management.</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">System Status</h2>
        <div className="surface rounded-xl p-5 flex items-center justify-between">
          <div>
             <div className="text-white font-medium text-sm">Engine Status</div>
             <div className="text-xs text-slate-500 uppercase tracking-widest">Optimized Flash Model Active</div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</h2>
        <div className="surface rounded-xl overflow-hidden divide-y divide-white/5 border-white/10">
           <button onClick={exportData} className="w-full p-4 text-left hover:bg-white/[0.02] flex items-center justify-between group">
             <div>
               <div className="text-white text-sm font-medium">Export Data</div>
               <div className="text-xs text-slate-500">Download JSON backup</div>
             </div>
             <Download size={16} className="text-slate-600 group-hover:text-white" />
           </button>
           
           <label className="w-full p-4 text-left hover:bg-white/[0.02] flex items-center justify-between group cursor-pointer">
             <div>
               <div className="text-white text-sm font-medium">Import Data</div>
               <div className="text-xs text-slate-500">Restore from JSON</div>
             </div>
             <Upload size={16} className="text-slate-600 group-hover:text-white" />
             <input type="file" className="hidden" accept=".json" onChange={importData} />
           </label>

           <button onClick={resetData} className="w-full p-4 text-left hover:bg-red-500/5 flex items-center justify-between group">
             <div>
               <div className="text-red-400 text-sm font-medium">Reset Progress</div>
               <div className="text-xs text-red-400/60">Clear all local storage</div>
             </div>
             <Trash2 size={16} className="text-red-400/60 group-hover:text-red-400" />
           </button>
        </div>
      </section>
    </div>
  );
};

export default AppSettings;

import React, { useState } from 'react';
import { DecisionLog } from '../../types';
import { auditDecision } from '../../services/apiService';
import { Loader2, ArrowRight } from 'lucide-react';

interface InputFormProps {
  onComplete: (log: DecisionLog) => void;
  onCancel: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onComplete, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setLoading(true);
    try {
      const audit = await auditDecision(title, description);
      
      const newLog: DecisionLog = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        title,
        description,
        detectedBiases: audit.detectedBiases.map((b: any) => ({
            biasId: b.biasName, // AI returns name, we store as ID for display mostly
            reasoning: b.reasoning,
            challengingQuestion: b.challengingQuestion
        })),
        userReflections: {},
        finalConclusion: '',
        status: 'audited'
      };

      onComplete(newLog);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze decision. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-xl font-serif text-white mb-6">Draft New Decision</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Decision Title</label>
          <input 
            type="text" 
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-rose-500 outline-none"
            placeholder="e.g., Should I quit my job?"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Context & Reasoning</label>
          <textarea 
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full h-40 bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-rose-500 outline-none resize-none"
            placeholder="Describe the situation and your current inclination..."
            disabled={loading}
          />
          <p className="text-xs text-slate-600 mt-2">The AI will play 'Red Team' and challenge your logic.</p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <BrainCircuit size={18} />}
            {loading ? 'Analyzing...' : 'Audit Decision'}
          </button>
        </div>
      </form>
    </div>
  );
};

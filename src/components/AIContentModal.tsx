import React, { useState } from 'react';
import { X, Sparkles, Loader2, Copy, Check, Lightbulb } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

interface AIContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Idea {
  type: string;
  title: string;
  description: string;
}

export default function AIContentModal({ isOpen, onClose }: AIContentModalProps) {
  const { clients } = useApp();
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const generateIdeas = async () => {
    const client = clients.find(c => c.id === selectedClientId);
    if (!client) return;

    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate 5 creative social media content ideas for a client named "${client.name}" in Turkish. 
        The client's brand focus is related to their name. 
        Provide the output in JSON format as an array of objects with "type" (Post, Reels, Story, Carousel, or Video), "title", and "description" fields. All text must be in Turkish.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ['type', 'title', 'description'],
            },
          },
        },
      });

      const result = JSON.parse(response.text || '[]');
      setIdeas(result);
    } catch (error) {
      console.error('Error generating ideas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <header className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI İçerik Fikir Üreticisi</h2>
              <p className="text-sm text-indigo-100">Müşterileriniz için yaratıcı ilham alın.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-700">Müşteri Seçin</label>
            <div className="flex gap-3">
              <select 
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                value={selectedClientId}
                onChange={e => setSelectedClientId(e.target.value)}
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <button 
                onClick={generateIdeas}
                disabled={isLoading}
                className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all active:scale-95"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Oluştur
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-gray-500 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
                <p className="animate-pulse font-medium">Taze fikirler hazırlanıyor...</p>
              </div>
            ) : ideas.length > 0 ? (
              <div className="grid gap-4">
                {ideas.map((idea, idx) => (
                  <div key={idx} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest px-2 py-0.5 bg-indigo-50 rounded border border-indigo-100">
                        {idea.type}
                      </span>
                      <button 
                        onClick={() => copyToClipboard(`${idea.title}: ${idea.description}`, idx)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                      >
                        {copiedIndex === idx ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">{idea.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{idea.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                <Lightbulb className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm">Bir müşteri seçin ve AI fikirlerini görmek için oluştur butonuna tıklayın.</p>
              </div>
            )}
          </div>
        </div>

        <footer className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Kapat
          </button>
        </footer>
      </div>
    </div>
  );
}

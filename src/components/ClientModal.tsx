import React, { useState } from 'react';
import { X, Palette, Target, Type } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Client } from '../types';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client;
}

export default function ClientModal({ isOpen, onClose, client }: ClientModalProps) {
  const { addClient, updateClient } = useApp();
  const [formData, setFormData] = useState<Partial<Client>>(
    client || {
      name: '',
      brandColor: '#4f46e5',
      monthlyTargets: { posts: 10, reels: 5, stories: 15 },
    }
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (client) {
      updateClient({ ...client, ...formData } as Client);
    } else {
      addClient(formData as Omit<Client, 'id'>);
    }
    onClose();
  };

  const targetLabels: Record<string, string> = {
    posts: 'Post',
    reels: 'Reels',
    stories: 'Hikaye'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <header className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">{client ? 'Müşteriyi Düzenle' : 'Yeni Müşteri Ekle'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Type className="w-4 h-4 text-gray-400" /> Müşteri Adı
            </label>
            <input 
              type="text" required placeholder="Örn: Aden Gıda"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Palette className="w-4 h-4 text-gray-400" /> Marka Rengi
            </label>
            <div className="flex gap-3 items-center">
              <input 
                type="color" className="w-12 h-12 p-1 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer"
                value={formData.brandColor}
                onChange={e => setFormData({ ...formData, brandColor: e.target.value })}
              />
              <input 
                type="text" className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                value={formData.brandColor}
                onChange={e => setFormData({ ...formData, brandColor: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-400" /> Aylık Hedefler
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['posts', 'reels', 'stories'].map((field) => (
                <div key={field} className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{targetLabels[field]}</label>
                  <input 
                    type="number" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                    value={(formData.monthlyTargets as any)?.[field]}
                    onChange={e => setFormData({ 
                      ...formData, 
                      monthlyTargets: { ...formData.monthlyTargets!, [field]: parseInt(e.target.value) || 0 } 
                    })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">İptal</button>
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-95">
              {client ? 'Değişiklikleri Kaydet' : 'Müşteri Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

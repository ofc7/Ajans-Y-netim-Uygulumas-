import React, { useState } from 'react';
import { X, Plus, User as UserIcon, Calendar, Tag, Type, FileText, Link as LinkIcon, Hash, Clock, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task, ContentType, TaskStatus } from '../types';
import { cn } from '../lib/utils';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
}

const contentTypes: ContentType[] = ['Post', 'Reels', 'Hikaye', 'Kaydırmalı', 'Video'];
const statuses: TaskStatus[] = ['Planlandı', 'Tasarımda', 'Müşteri Onayı Bekliyor', 'Yayına Hazır', 'Yayınlandı'];

export default function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
  const { clients, users, addTask, updateTask } = useApp();
  const [formData, setFormData] = useState<Partial<Task>>(
    task || {
      clientId: clients[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      type: 'Post',
      title: '',
      description: '',
      assignedStaff: [],
      status: 'Planlandı',
    }
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      updateTask({ ...task, ...formData } as Task);
    } else {
      addTask(formData as Omit<Task, 'id'>);
    }
    onClose();
  };

  const toggleStaff = (userId: string) => {
    const current = formData.assignedStaff || [];
    if (current.includes(userId)) {
      setFormData({ ...formData, assignedStaff: current.filter(id => id !== userId) });
    } else {
      setFormData({ ...formData, assignedStaff: [...current, userId] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <header className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{task ? 'Görevi Düzenle' : 'Yeni Görev Oluştur'}</h2>
            <p className="text-sm text-gray-500">Sosyal medya içeriğiniz için detayları doldurun.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-gray-400" />
                Müşteri
              </label>
              <select 
                required
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                value={formData.clientId}
                onChange={e => setFormData({ ...formData, clientId: e.target.value })}
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                Tarih
              </label>
              <input 
                type="date"
                required
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                İçerik Türü
              </label>
              <div className="flex flex-wrap gap-2">
                {contentTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type })}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      formData.type === type 
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" 
                        : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                Durum
              </label>
              <select 
                required
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as TaskStatus })}
              >
                {statuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Type className="w-4 h-4 text-gray-400" />
              İçerik Başlığı
            </label>
            <input 
              type="text"
              required
              placeholder="Örn: Yeni Ürün Lansmanı Postu"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              Açıklama
            </label>
            <textarea 
              rows={3}
              placeholder="Bu içerik ne hakkında?"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              Ekip Üyelerini Ata
            </label>
            <div className="flex flex-wrap gap-3">
              {users.map(user => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => toggleStaff(user.id)}
                  className={cn(
                    "flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all",
                    formData.assignedStaff?.includes(user.id)
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                      : "bg-white border-gray-100 text-gray-600 hover:border-gray-300"
                  )}
                >
                  <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                  <span className="text-xs font-medium">{user.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-400" />
                Hashtagler
              </label>
              <input 
                type="text"
                placeholder="#sosyalmedya #pazarlama"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                value={formData.hashtags}
                onChange={e => setFormData({ ...formData, hashtags: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-gray-400" />
                Tasarım Linki
              </label>
              <input 
                type="url"
                placeholder="https://figma.com/..."
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                value={formData.designLink}
                onChange={e => setFormData({ ...formData, designLink: e.target.value })}
              />
            </div>
          </div>
        </form>

        <footer className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            İptal
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-95"
          >
            {task ? 'Değişiklikleri Kaydet' : 'Görev Oluştur'}
          </button>
        </footer>
      </div>
    </div>
  );
}

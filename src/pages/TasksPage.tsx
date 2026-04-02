import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search, Filter, MoreHorizontal, Calendar, User as UserIcon, Tag } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '../lib/utils';
import { TaskStatus, Task } from '../types';
import TaskModal from '../components/TaskModal';

const statusColors: Record<TaskStatus, string> = {
  'Planlandı': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Tasarımda': 'bg-blue-100 text-blue-700 border-blue-200',
  'Müşteri Onayı Bekliyor': 'bg-orange-100 text-orange-700 border-orange-200',
  'Yayına Hazır': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Yayınlandı': 'bg-green-100 text-green-700 border-green-200',
};

export default function TasksPage() {
  const { tasks, clients, users } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Hepsi');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         clients.find(c => c.id === t.clientId)?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Hepsi' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Görevler</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Tüm içerik üretimini yönetin ve takip edin.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedTask(undefined);
            setIsTaskModalOpen(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Görev
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Görev veya müşteri ara..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select 
            className="flex-1 lg:flex-none px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Hepsi">Tüm Durumlar</option>
            <option value="Planlandı">Planlandı</option>
            <option value="Tasarımda">Tasarımda</option>
            <option value="Müşteri Onayı Bekliyor">Müşteri Onayı Bekliyor</option>
            <option value="Yayına Hazır">Yayına Hazır</option>
            <option value="Yayınlandı">Yayınlandı</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filtrele
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Görev</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Müşteri</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tarih</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Atanan</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTasks.map(task => {
                const client = clients.find(c => c.id === task.clientId);
                const assignedUsers = users.filter(u => task.assignedStaff.includes(u.id));

                return (
                  <tr 
                    key={task.id} 
                    onClick={() => {
                      setSelectedTask(task);
                      setIsTaskModalOpen(true);
                    }}
                    className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-indigo-600 uppercase mb-0.5">{task.type}</span>
                        <span className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{task.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: client?.brandColor }}
                        />
                        <span className="text-sm text-gray-600">{client?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{format(parseISO(task.date), 'd MMM yyyy', { locale: tr })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2 overflow-hidden">
                        {assignedUsers.map(user => (
                          <img 
                            key={user.id}
                            className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                            src={user.avatar}
                            alt={user.name}
                            title={user.name}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide", statusColors[task.status as TaskStatus])}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredTasks.map(task => {
            const client = clients.find(c => c.id === task.clientId);
            const assignedUsers = users.filter(u => task.assignedStaff.includes(u.id));

            return (
              <div 
                key={task.id}
                onClick={() => {
                  setSelectedTask(task);
                  setIsTaskModalOpen(true);
                }}
                className="p-4 space-y-3 active:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{task.type}</span>
                    <h3 className="text-sm font-bold text-gray-900">{task.title}</h3>
                  </div>
                  <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase", statusColors[task.status as TaskStatus])}>
                    {task.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: client?.brandColor }}
                    />
                    <span>{client?.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{format(parseISO(task.date), 'd MMM', { locale: tr })}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {assignedUsers.map(user => (
                      <img 
                        key={user.id}
                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                        src={user.avatar}
                        alt={user.name}
                      />
                    ))}
                  </div>
                  <button className="p-1.5 text-gray-400">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">Kriterlere uygun görev bulunamadı.</p>
          </div>
        )}
      </div>

      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        task={selectedTask}
      />
    </div>
  );
}

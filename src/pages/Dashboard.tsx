import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { format, isToday, isAfter, addDays, isBefore, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { AlertCircle, Calendar as CalendarIcon, CheckCircle2, Clock, Plus, Sparkles, Copy } from 'lucide-react';
import { cn } from '../lib/utils';
import { TaskStatus, ContentType, Task } from '../types';
import TaskModal from '../components/TaskModal';
import AIContentModal from '../components/AIContentModal';
import QuickStatusSelector from '../components/QuickStatusSelector';

const statusColors: Record<TaskStatus, string> = {
  'Planlandı': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Tasarımda': 'bg-blue-100 text-blue-700 border-blue-200',
  'Müşteri Onayı Bekliyor': 'bg-orange-100 text-orange-700 border-orange-200',
  'Yayına Hazır': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Yayınlandı': 'bg-green-100 text-green-700 border-green-200',
};

export default function Dashboard() {
  const { tasks, clients } = useApp();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const today = new Date();
  const next7Days = addDays(today, 7);

  const todayTasks = tasks.filter(t => isToday(parseISO(t.date)));
  const upcomingTasks = tasks.filter(t => {
    const date = parseISO(t.date);
    return isAfter(date, today) && isBefore(date, next7Days);
  });
  const overdueTasks = tasks.filter(t => {
    const date = parseISO(t.date);
    return isBefore(date, today) && !isToday(date) && t.status !== 'Yayınlandı';
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Kıyı Medya Müşteri Yönetim Paneli</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Tekrar hoş geldin! İşte bugün olanlar.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setIsAIModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            AI Fikirleri
          </button>
          <button 
            onClick={() => {
              setSelectedTask(undefined);
              setIsTaskModalOpen(true);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Yeni Görev
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Today's Tasks */}
        <section className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600 shrink-0" />
              Bugün
            </h2>
            <span className="text-[10px] md:text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full shrink-0">
              {todayTasks.length} görev
            </span>
          </div>
          <div className="space-y-3 md:space-y-4">
            {todayTasks.length > 0 ? (
              todayTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onClick={() => {
                    setSelectedTask(task);
                    setIsTaskModalOpen(true);
                  }}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Bugün için görev yok.</p>
            )}
          </div>
        </section>

        {/* Upcoming Tasks */}
        <section className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600 shrink-0" />
              Gelecek 7 Gün
            </h2>
            <span className="text-[10px] md:text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full shrink-0">
              {upcomingTasks.length} görev
            </span>
          </div>
          <div className="space-y-3 md:space-y-4">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  showDate 
                  onClick={() => {
                    setSelectedTask(task);
                    setIsTaskModalOpen(true);
                  }}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Gelecek görev yok.</p>
            )}
          </div>
        </section>

        {/* Overdue Tasks */}
        <section className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              Gecikenler
            </h2>
            <span className="text-[10px] md:text-xs font-medium px-2 py-1 bg-red-50 text-red-600 rounded-full shrink-0">
              {overdueTasks.length} görev
            </span>
          </div>
          <div className="space-y-3 md:space-y-4">
            {overdueTasks.length > 0 ? (
              overdueTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  showDate 
                  isOverdue 
                  onClick={() => {
                    setSelectedTask(task);
                    setIsTaskModalOpen(true);
                  }}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Her şey yolunda!</p>
            )}
          </div>
        </section>
      </div>

      {/* Clients Overview */}
      <section className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Müşteri Özeti</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {clients.map(client => {
            const clientTasks = tasks.filter(t => t.clientId === client.id);
            const publishedCount = clientTasks.filter(t => t.status === 'Yayınlandı').length;
            const progress = Math.min(100, Math.round((publishedCount / (client.monthlyTargets.posts + client.monthlyTargets.reels + client.monthlyTargets.stories)) * 100));

            return (
              <div key={client.id} className="p-3 md:p-4 border border-gray-100 rounded-lg hover:border-indigo-200 transition-colors group overflow-hidden">
                <div className="flex items-center gap-3 mb-3 md:mb-4">
                  <div 
                    className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-white font-bold shrink-0 text-sm md:text-base"
                    style={{ backgroundColor: client.brandColor }}
                  >
                    {client.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors truncate text-sm md:text-base">{client.name}</h3>
                    <p className="text-[10px] md:text-xs text-gray-500 truncate">{clientTasks.length} toplam görev</p>
                  </div>
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <div className="flex justify-between text-[10px] md:text-xs font-medium">
                    <span className="text-gray-500">Aylık İlerleme</span>
                    <span className="text-indigo-600">%{progress}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1 md:h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        task={selectedTask}
      />
      <AIContentModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
      />
    </div>
  );
}

function TaskItem({ task, showDate = false, isOverdue = false, onClick }: { task: any, showDate?: boolean, isOverdue?: boolean, onClick?: () => void, key?: any }) {
  const { clients, updateTask, duplicateTask } = useApp();
  const client = clients.find(c => c.id === task.clientId);

  return (
    <div 
      onClick={onClick}
      className="group p-3 border border-gray-50 rounded-lg hover:bg-gray-50 hover:border-gray-200 transition-all cursor-pointer relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-1 gap-2">
        <span className="text-[10px] md:text-xs font-bold text-indigo-600 uppercase tracking-wider shrink-0">{task.type}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {showDate && (
            <span className={cn("text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 rounded uppercase", isOverdue ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-500")}>
              {format(parseISO(task.date), 'd MMM', { locale: tr })}
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateTask(task.id);
            }}
            title="Kopyala"
            className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>
      </div>
      <h4 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors pr-6">{task.title}</h4>
      <div className="flex items-center gap-2 mt-2">
        <div 
          className="w-2 h-2 rounded-full shrink-0" 
          style={{ backgroundColor: client?.brandColor }}
        />
        <span className="text-[10px] md:text-xs text-gray-500 truncate max-w-[80px] md:max-w-[120px]">{client?.name}</span>
        <div className="ml-auto flex items-center gap-1.5">
          <QuickStatusSelector
            currentStatus={task.status}
            onStatusChange={(newStatus) => updateTask({ ...task, status: newStatus })}
            className="hidden group-hover:flex"
          />
          <span className={cn("text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 uppercase tracking-tighter md:tracking-normal", statusColors[task.status as TaskStatus])}>
            {task.status}
          </span>
        </div>
      </div>
    </div>
  );
}

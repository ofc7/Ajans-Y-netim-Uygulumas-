import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  parseISO
} from 'date-fns';
import { tr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Copy } from 'lucide-react';
import { cn } from '../lib/utils';
import { TaskStatus, Task } from '../types';
import TaskModal from '../components/TaskModal';
import QuickStatusSelector from '../components/QuickStatusSelector';

const statusColors: Record<TaskStatus, string> = {
  'Planlandı': 'bg-yellow-500',
  'Tasarımda': 'bg-blue-500',
  'Müşteri Onayı Bekliyor': 'bg-orange-500',
  'Yayına Hazır': 'bg-indigo-500',
  'Yayınlandı': 'bg-green-500',
};

export default function CalendarPage() {
  const { tasks, clients, updateTask, duplicateTask } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTask({ ...task, date: date.toISOString() });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const selectedDayTasks = tasks.filter(t => isSameDay(parseISO(t.date), selectedDate));

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Takvim</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">İçerik planınızı görselleştirin.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
            <button 
              onClick={prevMonth}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="px-4 text-sm font-semibold text-gray-900 min-w-[140px] text-center capitalize">
              {format(currentDate, 'MMMM yyyy', { locale: tr })}
            </span>
            <button 
              onClick={nextMonth}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <button 
            onClick={() => {
              setSelectedTask(undefined);
              setIsTaskModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Yeni Görev
          </button>
        </div>
      </header>

      {/* Mobile Date Strip */}
      <div className="lg:hidden bg-white border border-gray-200 rounded-xl p-4 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 capitalize">{format(selectedDate, 'd MMMM yyyy', { locale: tr })}</h3>
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{selectedDayTasks.length} Görev</span>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {calendarDays.filter(day => isSameMonth(day, monthStart)).map(day => {
            const isSelected = isSameDay(day, selectedDate);
            const hasTasks = tasks.some(t => isSameDay(parseISO(t.date), day));
            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[48px] h-16 rounded-xl transition-all border",
                  isSelected ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white border-gray-100 text-gray-600 hover:border-indigo-200"
                )}
              >
                <span className="text-[10px] uppercase font-bold opacity-70">{format(day, 'EEE', { locale: tr })}</span>
                <span className="text-lg font-bold">{format(day, 'd')}</span>
                {hasTasks && !isSelected && <div className="w-1 h-1 bg-indigo-400 rounded-full mt-1" />}
              </button>
            );
          })}
        </div>

        <div className="mt-6 space-y-3">
          {selectedDayTasks.length > 0 ? (
            selectedDayTasks.map(task => {
              const client = clients.find(c => c.id === task.clientId);
              return (
                <div 
                  key={task.id}
                  onClick={() => {
                    setSelectedTask(task);
                    setIsTaskModalOpen(true);
                  }}
                  className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3 active:scale-[0.98] transition-transform"
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shrink-0"
                    style={{ backgroundColor: client?.brandColor }}
                  >
                    {client?.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase truncate">{task.type}</span>
                      <span className={cn("text-[8px] font-bold px-1.5 py-0.5 rounded-full border uppercase", statusColors[task.status as TaskStatus].replace('bg-', 'text-').replace('500', '600') + " bg-white")}>
                        {task.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 truncate">{task.title}</h4>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-sm text-gray-500">Bu gün için planlanmış görev yok.</p>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Calendar Grid */}
      <div className="hidden lg:block bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
        <div className="min-w-[800px]">
          {/* Weekdays header */}
          <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
            {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map((day) => (
              <div key={day} className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              const dayTasks = tasks.filter(t => isSameDay(parseISO(t.date), day));
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isToday = isSameDay(day, new Date());

              return (
                <div 
                  key={day.toString()} 
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day)}
                  className={cn(
                    "min-h-[80px] p-2 border-r border-b border-gray-100 transition-colors hover:bg-gray-50/50",
                    !isCurrentMonth && "bg-gray-50/30",
                    idx % 7 === 6 && "border-r-0"
                  )}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={cn(
                      "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full",
                      isToday ? "bg-indigo-600 text-white" : isCurrentMonth ? "text-gray-900" : "text-gray-400"
                    )}>
                      {format(day, 'd')}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {dayTasks.map(task => {
                      const client = clients.find(c => c.id === task.clientId);
                      return (
                        <div 
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onClick={() => {
                            setSelectedTask(task);
                            setIsTaskModalOpen(true);
                          }}
                          className="group relative flex flex-col gap-1 px-2 py-1.5 bg-white border border-gray-100 rounded shadow-sm hover:border-indigo-300 transition-all cursor-pointer"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <div 
                                className={cn("w-1.5 h-1.5 rounded-full shrink-0", statusColors[task.status as TaskStatus])}
                              />
                              <span className="text-[9px] font-medium text-gray-700 truncate">
                                <span className="font-bold mr-1" style={{ color: client?.brandColor }}>{client?.name.split(' ')[0]}:</span>
                                {task.title}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateTask(task.id);
                              }}
                              className="hidden group-hover:block p-0.5 text-gray-400 hover:text-indigo-600"
                              title="Kopyala"
                            >
                              <Copy className="w-2.5 h-2.5" />
                            </button>
                          </div>
                          
                          <div className="hidden group-hover:flex items-center justify-between mt-1 pt-1 border-t border-gray-50">
                            <QuickStatusSelector
                              currentStatus={task.status}
                              onStatusChange={(newStatus) => updateTask({ ...task, status: newStatus })}
                              className="scale-75 origin-left"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        task={selectedTask}
      />
    </div>
  );
}

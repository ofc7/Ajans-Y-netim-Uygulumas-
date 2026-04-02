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
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { TaskStatus, Task } from '../types';
import TaskModal from '../components/TaskModal';

const statusColors: Record<TaskStatus, string> = {
  'Planlandı': 'bg-yellow-500',
  'Tasarımda': 'bg-blue-500',
  'Müşteri Onayı Bekliyor': 'bg-orange-500',
  'Yayına Hazır': 'bg-indigo-500',
  'Yayınlandı': 'bg-green-500',
};

export default function CalendarPage() {
  const { tasks, clients } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
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

      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
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
                          onClick={() => {
                            setSelectedTask(task);
                            setIsTaskModalOpen(true);
                          }}
                          className="group relative flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-100 rounded shadow-sm hover:border-indigo-300 transition-all cursor-pointer"
                        >
                          <div 
                            className={cn("w-1.5 h-1.5 rounded-full shrink-0", statusColors[task.status as TaskStatus])}
                          />
                          <span className="text-[9px] font-medium text-gray-700 truncate">
                            <span className="font-bold mr-1" style={{ color: client?.brandColor }}>{client?.name.split(' ')[0]}:</span>
                            {task.title}
                          </span>
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

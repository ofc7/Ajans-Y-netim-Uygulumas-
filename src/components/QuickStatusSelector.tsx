import React from 'react';
import { TaskStatus } from '../types';
import { cn } from '../lib/utils';

interface QuickStatusSelectorProps {
  currentStatus: TaskStatus;
  onStatusChange: (status: TaskStatus) => void;
  className?: string;
}

const statuses: TaskStatus[] = [
  'Planlandı',
  'Tasarımda',
  'Müşteri Onayı Bekliyor',
  'Yayına Hazır',
  'Yayınlandı',
];

const statusColors: Record<TaskStatus, string> = {
  'Planlandı': 'bg-yellow-500',
  'Tasarımda': 'bg-blue-500',
  'Müşteri Onayı Bekliyor': 'bg-orange-500',
  'Yayına Hazır': 'bg-indigo-500',
  'Yayınlandı': 'bg-green-500',
};

export default function QuickStatusSelector({ currentStatus, onStatusChange, className }: QuickStatusSelectorProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {statuses.map((status) => (
        <button
          key={status}
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange(status);
          }}
          title={status}
          className={cn(
            "w-2.5 h-2.5 rounded-full transition-all hover:scale-125",
            statusColors[status],
            currentStatus === status ? "ring-2 ring-offset-1 ring-gray-400 scale-110" : "opacity-40 hover:opacity-100"
          )}
        />
      ))}
    </div>
  );
}

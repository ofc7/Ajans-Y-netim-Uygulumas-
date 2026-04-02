import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, ListTodo } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Panel', path: '/' },
  { icon: Calendar, label: 'Takvim', path: '/calendar' },
  { icon: ListTodo, label: 'Görevler', path: '/tasks' },
  { icon: Users, label: 'Müşteriler', path: '/clients' },
];

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 transition-colors',
                isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

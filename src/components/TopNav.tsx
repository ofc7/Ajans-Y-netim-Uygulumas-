import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, ListTodo, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Panel', path: '/' },
  { icon: Calendar, label: 'Takvim', path: '/calendar' },
  { icon: ListTodo, label: 'Görevler', path: '/tasks' },
  { icon: Users, label: 'Müşteriler', path: '/clients' },
];

export default function TopNav() {
  return (
    <header className="hidden lg:block sticky top-0 z-40 w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ListTodo className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Kıyı Medya</h1>
          </div>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
          Ayarlar
        </button>
      </div>
    </header>
  );
}

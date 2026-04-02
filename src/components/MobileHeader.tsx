import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ListTodo, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export default function MobileHeader() {
  const { agencyName } = useApp();

  return (
    <header className="lg:hidden sticky top-0 z-40 w-full bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center">
          <ListTodo className="text-white w-4 h-4" />
        </div>
        <h1 className="text-lg font-bold text-gray-900 tracking-tight">{agencyName}</h1>
      </Link>
      <NavLink 
        to="/settings"
        className={({ isActive }) => 
          cn(
            "p-2 rounded-lg transition-colors",
            isActive ? "bg-gray-100 text-indigo-600" : "text-gray-500 hover:bg-gray-100"
          )
        }
      >
        <Settings className="w-5 h-5" />
      </NavLink>
    </header>
  );
}

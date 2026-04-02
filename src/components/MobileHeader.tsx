import React from 'react';
import { ListTodo, Settings } from 'lucide-react';

export default function MobileHeader() {
  return (
    <header className="lg:hidden sticky top-0 z-40 w-full bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center">
          <ListTodo className="text-white w-4 h-4" />
        </div>
        <h1 className="text-lg font-bold text-gray-900 tracking-tight">Kıyı Medya</h1>
      </div>
      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
        <Settings className="w-5 h-5" />
      </button>
    </header>
  );
}

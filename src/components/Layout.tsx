import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import BottomNav from './BottomNav';
import MobileHeader from './MobileHeader';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNav />
      <MobileHeader />
      <main className="flex-1 overflow-x-hidden pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

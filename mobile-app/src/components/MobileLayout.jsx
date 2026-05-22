import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const MobileLayout = () => {
  return (
    <div className="flex flex-col min-h-screen w-full max-w-md mx-auto bg-[#faf7f2] relative">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default MobileLayout;

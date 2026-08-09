'use client';

import React, { useState } from 'react';
import Sidebar from './Components/Sidebar';
import Header from './Components/Header';

const AdminLayout = ({ children }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header Component */}
        <Header title={activeTab} />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
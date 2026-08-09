'use client';

import React, { useState } from 'react';
import SettingsHeader from '../Components/Settings/SettingsHeader';
import ProfileTab from '../Components/Settings/ProfileTab';
import CompanyTab from '../Components/Settings/CompanyTab';
import AttendanceTab from '../Components/Settings/AttendanceTab';
import SecurityTab from '../Components/Settings/SecurityTab';
import BranchTab from '../Components/Settings/BranchTab';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header & Tabs */}
      <SettingsHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Dynamic Tab View */}
      <div>
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'company' && <CompanyTab />}
        {activeTab === 'branch' && <BranchTab />}
        {activeTab === 'attendance' && <AttendanceTab />}
        {activeTab === 'security' && <SecurityTab />}
      </div>
    </div>
  );
};

export default Settings;
'use client';

import React, { useState } from 'react';
import NotificationHeader from '../Components/Notification/NotificationHeader';
import NotificationItem from '../Components/Notification/NotificationItem';
import AnnouncementModal from '../Components/Notification/AnnouncementModal';
import DeleteConfirmModal from '../Components/Notification/DeleteConfirmModal';

const initialNotifications = [
  {
    id: '1',
    title: 'Payroll cutoff moved to the 28th',
    message:
      "Finance has shifted this month's payroll cutoff two days earlier to accommodate the bank holiday.",
    branch: 'All branches',
    time: 'Today, 09:12',
    priority: 'High',
    isUnread: true,
    hasImage: false,
  },
  {
    id: '2',
    title: 'Westline Hub — fire drill at 3 PM',
    message:
      'A scheduled fire drill will take place this afternoon. Please follow floor marshal instructions.',
    branch: 'Westline Hub',
    time: 'Today, 08:40',
    priority: 'Medium',
    isUnread: true,
    hasImage: true,
  },
  {
    id: '3',
    title: 'New geofence radius applied',
    message:
      "Harbor Point's check-in radius was widened to 150m to cover the new parking structure.",
    branch: 'Harbor Point',
    time: 'Yesterday',
    priority: 'Low',
    isUnread: false,
    hasImage: false,
  },
  {
    id: '4',
    title: 'Quarterly attendance review published',
    message:
      'Q2 attendance and overtime summaries are now available in Reports.',
    branch: 'All branches',
    time: '2 days ago',
    priority: 'Low',
    isUnread: false,
    hasImage: false,
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  
  // Modal States
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Unread Count
  const unreadCount = notifications.filter((n) => n.isUnread).length;

  // Handlers
  const handleOpenCreate = () => {
    setSelectedItem(null);
    setIsAnnouncementModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setIsAnnouncementModalOpen(true);
  };

  const handleOpenDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitAnnouncement = (data) => {
    if (selectedItem) {
      // Edit mode
      setNotifications((prev) =>
        prev.map((n) => (n.id === selectedItem.id ? { ...n, ...data } : n))
      );
    } else {
      // Create mode
      const newNotification = {
        id: Date.now().toString(),
        ...data,
        time: 'Just now',
        isUnread: true,
        hasImage: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    }
    setIsAnnouncementModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedItem) {
      setNotifications((prev) => prev.filter((n) => n.id !== selectedItem.id));
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header */}
      <NotificationHeader
        unreadCount={unreadCount}
        onOpenCreateModal={handleOpenCreate}
      />

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((item) => (
          <NotificationItem
            key={item.id}
            item={item}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
          />
        ))}
      </div>

      {/* Create / Edit Modal */}
      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        onSubmit={handleSubmitAnnouncement}
        initialData={selectedItem}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

    </div>
  );
};

export default Notifications;
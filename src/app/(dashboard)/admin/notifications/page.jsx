'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Plus, Loader2 } from 'lucide-react';

import NotificationHeader from '../Components/Notification/NotificationHeader';
import NotificationItem from '../Components/Notification/NotificationItem';
import AnnouncementModal from '../Components/Notification/AnnouncementModal';
import DeleteConfirmModal from '../Components/Notification/DeleteConfirmModal';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // লোকাল স্টোরেজ থেকে লগইন করা ইউজারের আইডি বের করার জন্য
  const [currentUserId, setCurrentUserId] = useState('');

  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingNotification, setDeletingNotification] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
  };

  // ১. লোকাল স্টোরেজ থেকে ইউজার বা এডমিন আইডি রিড করা
  useEffect(() => {
    try {
      const keysToCheck = ['admin', 'ADMIN', 'user', 'USER', 'adminInfo', 'userInfo'];
      let foundId = '';

      for (const key of keysToCheck) {
        const storedData = localStorage.getItem(key);
        if (storedData) {
          try {
            const parsed = JSON.parse(storedData);
            if (parsed && (parsed.id || parsed._id)) {
              foundId = parsed.id || parsed._id;
              break;
            }
          } catch {
            if (typeof storedData === 'string' && storedData.trim() !== '') {
              foundId = storedData;
            }
          }
        }
      }

      if (foundId) {
        setCurrentUserId(foundId);
      } else {
        setCurrentUserId('admin-1786269776983');
      }
    } catch (error) {
      console.error('Error reading user from localStorage:', error);
      setCurrentUserId('admin-1786269776983');
    }
  }, []);

  // ২. নোটিফিকেশন ফেচ করা
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/notifications`, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      
      if (res.ok) {
        const items = data.data || data || [];
        const formattedData = items.map((item) => ({
          id: item.id,
          title: item.title,
          message: item.message,
          branchId: item.branchId || '',
          organizationId: item.organizationId || '',
          branch: item.branch ? item.branch.name : 'All branches',
          time: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          priority: item.priority ? item.priority.charAt(0) + item.priority.slice(1).toLowerCase() : 'Medium',
          isUnread: !item.isRead,
          hasImage: !!item.imageUrl,
          imageUrl: item.imageUrl,
          userId: item.userId,
        }));
        setNotifications(formattedData);
      } else {
        console.error("Failed to fetch notifications:", data.message);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // ৩. অর্গানাইজেশন ফেচ করা
  const fetchOrganizations = async () => {
    try {
      const res = await fetch(`${apiUrl}/organizations`, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      
      if (res.ok) {
        setOrganizations(data.data || data || []);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchOrganizations();
  }, []);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  // ৪. নোটিফিকেশন তৈরি অথবা আপডেট হ্যান্ডেল করা (Create / Update)
  const handleSaveNotification = async (newData) => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const payload = {
            userId: newData.userId || currentUserId,
            title: newData.title,
            message: newData.message,
            type: newData.type || 'SYSTEM',
            priority: newData.priority ? newData.priority.toUpperCase() : 'MEDIUM',
            branchId: newData.branchId || null,
            organizationId: newData.organizationId || null,
            actionUrl: newData.actionUrl || null,
            imageUrl: newData.imageUrl || null,
          };

          const isEditing = !!editingNotification?.id;
          const endpoint = isEditing 
            ? `${apiUrl}/notifications/${editingNotification.id}` 
            : `${apiUrl}/notifications`;
          
          const method = isEditing ? "PUT" : "POST";

          const res = await fetch(endpoint, {
            method: method,
            credentials: "include",
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
          });

          const result = await res.json();

          if (res.ok) {
            const item = result.data || result;
            const formattedItem = {
              id: item.id,
              title: item.title,
              message: item.message,
              branchId: item.branchId || '',
              organizationId: item.organizationId || '',
              branch: item.branch ? item.branch.name : 'All branches',
              time: new Date(item.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              priority: item.priority ? item.priority.charAt(0) + item.priority.slice(1).toLowerCase() : 'Medium',
              isUnread: !item.isRead,
              hasImage: !!item.imageUrl,
              imageUrl: item.imageUrl,
              userId: item.userId,
            };

            if (isEditing) {
              setNotifications((prev) => 
                prev.map((n) => (n.id === formattedItem.id ? formattedItem : n))
              );
            } else {
              setNotifications((prev) => [formattedItem, ...prev]);
            }

            setIsAnnouncementModalOpen(false);
            setEditingNotification(null);
            resolve({ success: true });
          } else {
            resolve({ success: false, error: result.message || 'Failed to save notification' });
          }
        } catch (error) {
          console.error("Error saving notification:", error);
          resolve({ success: false, error: 'An unexpected error occurred.' });
        }
      });
    });
  };

  const handleOpenEdit = (item) => {
    setEditingNotification(item);
    setIsAnnouncementModalOpen(true);
  };

  const handleOpenDelete = (item) => {
    setDeletingNotification(item);
    setIsDeleteModalOpen(true);
  };

  // ৫. নোটিফিকেশন ডিলিট করা (Delete)
  const handleConfirmDelete = async (id) => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const res = await fetch(`${apiUrl}/notifications/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: getAuthHeaders(),
          });

          const result = await res.json();

          if (res.ok) {
            setNotifications((prev) => prev.filter((item) => item.id !== id));
            setIsDeleteModalOpen(false);
            setDeletingNotification(null);
            resolve({ success: true });
          } else {
            resolve({ success: false, error: result.message || 'Failed to delete notification' });
          }
        } catch (error) {
          console.error("Error deleting notification:", error);
          resolve({ success: false, error: 'An error occurred while deleting the notification.' });
        }
      });
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs w-full max-w-7xl mx-auto space-y-6 relative">
      
      {(loading || isPending) && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-20 flex items-center justify-center rounded-2xl min-h-[200px]">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-4 py-2 rounded-full shadow-md border border-slate-100">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            Connecting to database...
          </div>
        </div>
      )}

      {/* Header with unread count & New button */}
      <NotificationHeader
        unreadCount={unreadCount}
        onOpenCreateModal={() => {
          setEditingNotification(null);
          setIsAnnouncementModalOpen(true);
        }}
      />

      {/* List */}
      <div className="space-y-4">
        {notifications.map((item) => (
          <NotificationItem
            key={item.id}
            item={item}
            onEdit={() => handleOpenEdit(item)}
            onDelete={() => handleOpenDelete(item)}
          />
        ))}

        {notifications.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-sm">
            No notifications found. Click "New Announcement" to create one.
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => {
          setIsAnnouncementModalOpen(false);
          setEditingNotification(null);
        }}
        onSubmit={handleSaveNotification}
        initialData={editingNotification}
        organizations={organizations}
        currentUserId={currentUserId}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingNotification(null);
        }}
        item={deletingNotification}
        onConfirm={() => handleConfirmDelete(deletingNotification?.id)}
      />

    </div>
  );
};

export default Notifications;
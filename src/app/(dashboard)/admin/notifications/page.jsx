'use client';

import React, { useState, useEffect } from 'react';
import NotificationHeader from '../Components/Notification/NotificationHeader';
import NotificationItem from '../Components/Notification/NotificationItem';
import AnnouncementModal from '../Components/Notification/AnnouncementModal';
import DeleteConfirmModal from '../Components/Notification/DeleteConfirmModal';

const Notifications = () => {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState('');
  
  // লোকাল স্টোরেজ থেকে আসা লগইন করা এডমিন আইডি
  const [currentUserId, setCurrentUserId] = useState('');

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // ১. লোকাল স্টোরেজ থেকে সঠিক লগইন করা এডমিনের আইডি রিড করা
  useEffect(() => {
    try {
      // আপনার প্রজেক্টে লোকাল স্টোরেজে যে নামগুলো ব্যবহার হতে পারে
      const keysToCheck = ['admin', 'ADMIN', 'user', 'USER', 'adminInfo', 'userInfo'];
      let foundId = '';

      for (const key of keysToCheck) {
        const storedData = localStorage.getItem(key);
        if (storedData) {
          try {
            const parsed = JSON.parse(storedData);
            // ডাটাবেজে ইউজার/এডমিন অবজেক্টে আইডি সাধারণত id বা _id নামে থাকে
            if (parsed && (parsed.id || parsed._id)) {
              foundId = parsed.id || parsed._id;
              break;
            }
          } catch {
            // যদি অবজেক্ট না হয়ে সরাসরি স্ট্রিং আইডি বা ইমেইল থাকে
            if (typeof storedData === 'string' && storedData.trim() !== '') {
              foundId = storedData;
            }
          }
        }
      }

      if (foundId) {
        setCurrentUserId(foundId);
      } else {
        // যদি লোকাল স্টোরেজে কোনো আইডি না পাওয়া যায়, তবে ব্যাকআপ আইডি
        setCurrentUserId('admin-1786269776983');
      }
    } catch (error) {
      console.error('Error reading admin from localStorage:', error);
      setCurrentUserId('admin-1786269776983');
    }
  }, []);

  // ২. প্রথমে অর্গানাইজেশন লিস্ট ফেচ করা
  useEffect(() => {
    fetch('/api/organizations')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setOrganizations(data.data);
          setSelectedOrgId(data.data[0].id);
        }
      })
      .catch((err) => console.error('Error fetching organizations:', err));
  }, []);

  // ৩. নোটিফিকেশন ফেচ করা (GET API)
  const fetchNotifications = async () => {
    if (!selectedOrgId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/notifications?organizationId=${selectedOrgId}`);
      const result = await res.json();
      
      if (result.success) {
        const formattedData = result.data.map((item) => ({
          id: item.id,
          title: item.title,
          message: item.body,
          branch: item.branch ? item.branch.name : 'All branches',
          time: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          priority: item.priority ? item.priority.charAt(0) + item.priority.slice(1).toLowerCase() : 'Low',
          isUnread: true,
          hasImage: !!item.imageUrl,
          imageUrl: item.imageUrl,
          branchId: item.branchId,
          organizationId: item.organizationId,
        }));
        setNotifications(formattedData);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedOrgId) {
      fetchNotifications();
    }
  }, [selectedOrgId]);

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

  // ৪. Create / Edit সাবমিট হ্যান্ডলার (POST/PUT API)
  const handleSubmitAnnouncement = async (data) => {
    try {
      const payload = {
        id: selectedItem?.id, 
        organizationId: selectedOrgId,
        branchId: data.branchId || null,
        title: data.title,
        body: data.message,
        priority: data.priority ? data.priority.toUpperCase() : 'MEDIUM',
        createdById: currentUserId,
      };

      const res = await fetch('/api/notifications', {
        method: selectedItem ? 'PUT' : 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      
      if (result.success) {
        // ১. await ব্যবহার করুন যাতে ডাটা ফেচ শেষ হলে তবেই পরবর্তী কাজ হয়
        await fetchNotifications(); 
        
        // ২. মডাল বন্ধ করার আগে ছোট ডিলে দেওয়া যেতে পারে বা নিশ্চিত করা যে স্টেট আপডেট হয়েছে
        setIsAnnouncementModalOpen(false);
      } else {
        alert(result.message || 'Failed to process request');
      }
    } catch (error) {
      console.error('Error submitting announcement:', error);
      setIsAnnouncementModalOpen(false); // এরর হলেও মডাল বন্ধ হবে
    }
  };

  // ৫. Delete হ্যান্ডলার
  const handleDeleteConfirm = async () => {
    if (selectedItem && selectedItem.id) {
      try {
        const res = await fetch(`/api/notifications/${selectedItem.id}`, {
          method: 'DELETE',
        });
        const result = await res.json();
        
        if (result.success) {
          setNotifications((prev) => prev.filter((n) => n.id !== selectedItem.id));
        } else {
          alert(result.message || 'Failed to delete');
        }
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    } else {
      console.error("Selected item ID is missing!");
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Filter Section: Organization Selector */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-100">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Organization</label>
          <select
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value)}
            className="block w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:border-purple-500 bg-slate-50 cursor-pointer"
          >
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Header */}
      <NotificationHeader
        unreadCount={unreadCount}
        onOpenCreateModal={handleOpenCreate}
      />

      {/* Loading & List */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No notifications found for this organization.</div>
      ) : (
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
      )}

      {/* Create / Edit Modal */}
      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        onSubmit={handleSubmitAnnouncement}
        initialData={selectedItem}
        organizationId={selectedOrgId}
        currentUserId={currentUserId}
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
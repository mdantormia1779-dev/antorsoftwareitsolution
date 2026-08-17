const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// টোকেন পাওয়ার হেল্পার ফাংশন
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
};

// ১. ইউজারের সমস্ত নোটিফিকেশন গেট করা
export const getNotifications = async () => {
  try {
    const response = await fetch(`${API_URL}/notifications`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: "include"
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch notifications');
    
    return data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { success: false, data: [], error: error.message };
  }
};

// ২. নতুন নোটিফিকেশন তৈরি করা (Create)
export const createNotification = async (payload) => {
  try {
    const response = await fetch(`${API_URL}/notifications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
      credentials: "include"
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create notification');

    return data;
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: error.message };
  }
};

// ৩. বিদ্যমান নোটিফিকেশন আপডেট করা (Update)
export const updateNotification = async (id, payload) => {
  try {
    const response = await fetch(`${API_URL}/notifications/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
      credentials: "include"
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update notification');

    return data;
  } catch (error) {
    console.error('Error updating notification:', error);
    return { success: false, error: error.message };
  }
};

// ৪. নোটিফিকেশন ডিলিট করা (Delete)
export const deleteNotification = async (id) => {
  try {
    const response = await fetch(`${API_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: "include"
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete notification');

    return data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return { success: false, error: error.message };
  }
};
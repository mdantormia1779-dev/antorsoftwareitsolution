'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Plus, Loader2 } from 'lucide-react';

import CreateBranchModal from '../Components/Branch/CreateBranchModal';
import BranchCard from '../Components/Branch/BranchCard';
import EditBranchModal from '../Components/Branch/EditBranchModal';
import DeleteBranchModal from '../Components/Branch/DeleteBranchModal';

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingBranch, setDeletingBranch] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
  };

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/branches`, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      
      if (res.ok) {
        setBranches(data.data || data || []);
      } else {
        console.error("Failed to fetch branches:", data.message);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoading(false);
    }
  };

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
    fetchBranches();
    fetchOrganizations();
  }, []);

  const handleCreateBranch = async (newBranchData) => {
  return new Promise((resolve) => {
    startTransition(async () => {
      try {
        const payload = {
          name: newBranchData.name,
          address: newBranchData.address,
          latitude: newBranchData.latitude || 23.7937,
          longitude: newBranchData.longitude || 90.4066,
          geofenceRadius: parseInt(newBranchData.geofenceRadius, 10) || 150,
          phone: newBranchData.phone || "+8801800000000",
          organizationId: newBranchData.organizationId,
          managerId: newBranchData.managerId || null,
        };

        const res = await fetch(`${apiUrl}/branches`, {
          method: "POST",
          credentials: "include",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json", // এটি যোগ করা ভালো
          },
          body: JSON.stringify(payload),
        });

        const result = await res.json();

        if (res.ok) {
          setBranches((prev) => [result.data || result, ...prev]);
          setIsCreateModalOpen(false);
          resolve({ success: true });
        } else {
          // এখানে আমাদের ব্যাকএন্ড থেকে আসা কাস্টম এরর মেসেজটি কাজ করবে
          resolve({ success: false, error: result.message || 'Failed to create branch' });
        }
      } catch (error) {
        console.error("Error creating branch:", error);
        resolve({ success: false, error: 'An unexpected error occurred.' });
      }
    });
  });
};

  const handleEditClick = (branch) => {
    setEditingBranch(branch);
    setIsEditModalOpen(true);
  };

  const handleSaveBranch = async (id, updatedBranchData) => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          // আপডেটের সময়ও সঠিক ফরম্যাটে পেলোড তৈরি করা হচ্ছে
          const payload = {
            name: updatedBranchData.name,
            address: updatedBranchData.address,
            latitude: updatedBranchData.latitude || 23.7937,
            longitude: updatedBranchData.longitude || 90.4066,
            geofenceRadius: parseInt(updatedBranchData.geofenceRadius, 10) || 150,
            phone: updatedBranchData.phone || "+8801800000000",
            ...(updatedBranchData.organizationId && { organizationId: updatedBranchData.organizationId }),
            managerId: updatedBranchData.managerId || null,
          };

          const res = await fetch(`${apiUrl}/branches/${id}`, {
            method: "PATCH",
            credentials: "include",
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
          });

          const result = await res.json();

          if (res.ok) {
            const updatedItem = result.data || result;
            setBranches((prev) =>
              prev.map((item) => (item.id === id ? updatedItem : item))
            );
            setIsEditModalOpen(false);
            resolve({ success: true });
          } else {
            resolve({ success: false, error: result.message || 'Failed to update branch' });
          }
        } catch (error) {
          console.error("Error updating branch:", error);
          resolve({ success: false, error: 'An error occurred while updating the branch.' });
        }
      });
    });
  };

  const handleDeleteClick = (branch) => {
    setDeletingBranch(branch);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (id) => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const res = await fetch(`${apiUrl}/branches/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: getAuthHeaders(),
          });

          const result = await res.json();

          if (res.ok) {
            setBranches((prev) => prev.filter((item) => item.id !== id));
            setIsDeleteModalOpen(false);
            resolve({ success: true });
          } else {
            resolve({ success: false, error: result.message || 'Failed to delete branch' });
          }
        } catch (error) {
          console.error("Error deleting branch:", error);
          resolve({ success: false, error: 'An error occurred while deleting the branch.' });
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
            {branches.length} LOCATIONS
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mt-0.5">
            Branches
          </h2>
        </div>

        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Branch</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {branches.map((branch) => (
          <BranchCard
            key={branch.id}
            branch={branch}
            onEdit={handleEditClick}
            onDelete={() => handleDeleteClick(branch)}
          />
        ))}

        {branches.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-sm">
            No branches found. Click "New Branch" to add one.
          </div>
        )}
      </div>

      <CreateBranchModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateBranch}
        organizations={organizations}
      />

      <EditBranchModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        branch={editingBranch}
        onSave={handleSaveBranch}
        organizations={organizations}
      />

      <DeleteBranchModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        branch={deletingBranch}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
};

export default Branches;
'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { 
  updateBranchAction, 
  deleteBranchAction 
} from '@/app/actions/branch';

import CreateBranchModal from '../Components/Branch/CreateBranchModal';
import BranchCard from '../Components/Branch/BranchCard';
import EditBranchModal from '../Components/Branch/EditBranchModal';
import DeleteBranchModal from '../Components/Branch/DeleteBranchModal';

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Edit Modal State
  const [editingBranch, setEditingBranch] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Delete Modal State
  const [deletingBranch, setDeletingBranch] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 1. ডাটাবেজ থেকে ব্রাঞ্চ এবং অর্গানাইজেশন লিস্ট নিয়ে আসা
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // ব্রাঞ্চ ফেচ করা
        const branchRes = await fetch('/api/branches');
        const branchData = await branchRes.json();
        if (branchData?.success) {
          setBranches(branchData.data);
        }

        // অর্গানাইজেশন ফেচ করা
        const orgRes = await fetch('/api/organizations');
        const orgData = await orgRes.json();
        if (orgData?.success || Array.isArray(orgData)) {
          setOrganizations(orgData.data || orgData);
        }
      } catch (err) {
        console.error('Failed to fetch initial data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 2. Create Handler (API দিয়ে ব্রাঞ্চ তৈরি করা)
  const handleCreateBranch = async (newBranchData) => {
    try {
      const res = await fetch('/api/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBranchData),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        return { success: false, error: result.error || 'Failed to create branch' };
      }

      // সফল হলে স্টেট আপডেট করা
      setBranches((prev) => [result.data, ...prev]);
      return { success: true };
    } catch (err) {
      console.error('Error creating branch:', err);
      return { success: false, error: err.message };
    }
  };

  // 3. Edit Handlers
  const handleEditClick = (branch) => {
    setEditingBranch(branch);
    setIsEditModalOpen(true);
  };

  const handleSaveBranch = async (id, updatedBranchData) => {
    startTransition(async () => {
      const res = await updateBranchAction(id, updatedBranchData);
      if (res?.success && res?.data) {
        setBranches((prev) =>
          prev.map((item) => (item.id === res.data.id ? res.data : item))
        );
        setIsEditModalOpen(false);
      } else {
        alert(res?.error || 'Failed to update branch');
      }
    });
  };

  // 4. Delete Handlers
  const handleDeleteClick = (branch) => {
    setDeletingBranch(branch);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (id) => {
    startTransition(async () => {
      const res = await deleteBranchAction(id);
      if (res?.success) {
        setBranches((prev) => prev.filter((item) => item.id !== id));
        setIsDeleteModalOpen(false);
      } else {
        alert(res?.error || 'Failed to delete branch');
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs w-full max-w-7xl mx-auto space-y-6 relative">
      
      {/* Loading Overlay */}
      {(loading || isPending) && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-20 flex items-center justify-center rounded-2xl min-h-[200px]">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-4 py-2 rounded-full shadow-md border border-slate-100">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            Connecting to database...
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
            {branches.length} LOCATIONS
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mt-0.5">
            Branches
          </h2>
        </div>

        {/* New Branch Button */}
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Branch</span>
        </button>
      </div>

      {/* Cards Grid */}
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

      {/* Create Modal */}
      <CreateBranchModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateBranch}
        organizations={organizations}
      />

      {/* Edit Modal */}
      <EditBranchModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        branch={editingBranch}
        onSave={handleSaveBranch}
      />

      {/* Delete Modal */}
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
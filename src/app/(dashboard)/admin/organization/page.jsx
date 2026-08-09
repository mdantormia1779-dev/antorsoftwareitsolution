'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Building2, MapPin, Globe, Clock, Plus, Edit3, Trash2, Loader2, CheckCircle2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const OrganizationsPage = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedOrg, setSelectedOrg] = useState(null);

  // Form Data State
  const initialForm = { name: '', industry: 'Information Technology', timezone: 'Asia/Dhaka', address: '' };
  const [formData, setFormData] = useState(initialForm);

  // 1. Fetch Organizations (GET)
  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/organizations');
      const data = await res.json();
      if (data.success) {
        setOrganizations(data.data || []);
      } else {
        setOrganizations([]);
      }
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  // 2. Create Organization (POST)
  const handleCreate = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    startTransition(async () => {
      try {
        const res = await fetch('/api/organizations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const result = await res.json();

        if (!res.ok || !result.success) throw new Error(result.message || 'Failed to create');

        setSuccessMessage('Organization created successfully!');
        setFormData(initialForm);
        setIsCreateOpen(false);
        fetchOrganizations();
      } catch (err) {
        setErrorMessage(err.message);
      }
    });
  };

  // 3. Edit / Update Organization (PUT / PATCH)
  // 3. Edit / Update Organization (PATCH)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    startTransition(async () => {
      try {
        const res = await fetch(`/api/organizations/${selectedOrg.id}`, {
          method: 'PATCH', // ← এখানে PUT এর বদলে PATCH করা হলো
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const result = await res.json();

        if (!res.ok || !result.success) throw new Error(result.error || result.message || 'Failed to update');

        setSuccessMessage('Organization updated successfully!');
        setIsEditOpen(false);
        fetchOrganizations();
      } catch (err) {
        setErrorMessage(err.message);
      }
    });
  };

  // 4. Delete Organization (DELETE)
  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/organizations/${selectedOrg.id}`, {
          method: 'DELETE',
        });
        const result = await res.json();

        if (!res.ok || !result.success) throw new Error(result.message || 'Failed to delete');

        setSuccessMessage('Organization deleted successfully!');
        setIsDeleteOpen(false);
        fetchOrganizations();
      } catch (err) {
        setErrorMessage(err.message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
          <div>
            <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
              WORKSPACE MANAGEMENT
            </span>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight mt-0.5">
              Organizations
            </h1>
          </div>

          <button
            onClick={() => {
              setFormData(initialForm);
              setIsCreateOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all cursor-pointer w-fit"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Organization</span>
          </button>
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center justify-between">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" />{successMessage}</span>
            <button onClick={() => setSuccessMessage('')}><X className="w-4 h-4" /></button>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center justify-between">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage('')}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Organizations List / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <div className="col-span-full py-20 text-center flex items-center justify-center gap-2 text-slate-500 text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" /> Loading organizations...
            </div>
          ) : organizations.length > 0 ? (
            organizations.map((org) => (
              <div key={org.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedOrg(org);
                          setFormData({ name: org.name, industry: org.industry, timezone: org.timezone, address: org.address });
                          setIsEditOpen(true);
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrg(org);
                          setIsDeleteOpen(true);
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{org.name}</h3>
                    <p className="text-xs text-blue-600 font-semibold mt-0.5">{org.industry}</p>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{org.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{org.timezone}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 text-sm">
              No organizations found. Click "Create Organization" to add one.
            </div>
          )}
        </div>

        {/* CREATE MODAL */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg p-6 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-800">Create Organization</h3>
                <button onClick={() => setIsCreateOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Organization Name *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Antor Software Ltd" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Industry *</label>
                    <input type="text" required value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Timezone *</label>
                    <input type="text" required value={formData.timezone} onChange={(e) => setFormData({ ...formData, timezone: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Address *</label>
                  <input type="text" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="e.g. Dhaka, Bangladesh" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50" />
                </div>

                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <button type="button" onClick={() => setIsCreateOpen(false)} className="w-full py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                  <button type="submit" disabled={isPending} className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md flex items-center justify-center gap-2">
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg p-6 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-800">Edit Organization</h3>
                <button onClick={() => setIsEditOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Organization Name *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Industry *</label>
                    <input type="text" required value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Timezone *</label>
                    <input type="text" required value={formData.timezone} onChange={(e) => setFormData({ ...formData, timezone: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Address *</label>
                  <input type="text" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 bg-slate-50/50" />
                </div>

                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <button type="button" onClick={() => setIsEditOpen(false)} className="w-full py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                  <button type="submit" disabled={isPending} className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md flex items-center justify-center gap-2">
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE MODAL */}
        {isDeleteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-sm p-6 space-y-5 text-center animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-800">Delete Organization</h3>
                <p className="text-xs text-slate-500">Are you sure you want to delete <span className="font-bold text-slate-700">{selectedOrg?.name}</span>? This action cannot be undone.</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsDeleteOpen(false)} className="w-full py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="button" onClick={handleDelete} disabled={isPending} className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-md flex items-center justify-center gap-2">
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrganizationsPage;
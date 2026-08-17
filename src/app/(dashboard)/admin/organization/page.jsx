'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Building2, MapPin, Clock, Mail, Phone, Globe, Plus, Edit3, Trash2, Loader2, CheckCircle2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import EditOrgModal from '../Components/organization/EditOrgModal';
import CreateOrgModal from '../Components/organization/CreateOrgModal';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/organizations`;
const CreateUrl = `${process.env.NEXT_PUBLIC_API_URL}/organizations`;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

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

  // Form Data State with all required fields
  const initialForm = {
    name: '',
    industry: 'Software Development',
    email: '',
    phone: '',
    website: '',
    address: '',
    timezone: 'Asia/Dhaka',
  };
  const [formData, setFormData] = useState(initialForm);

  // 1. Fetch Organizations (GET)
  const fetchOrganizations = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      const data = await res.json();
      console.log('Fetched Organizations Data:', data);

      if (!res.ok) throw new Error(data.message || 'Failed to fetch organizations');
      
      if (data.success) {
        const orgs = Array.isArray(data.data) ? data.data : (data.data ? [data.data] : []);
        setOrganizations(orgs);
      } else {
        setOrganizations([]);
      }
    } catch (err) {
      console.error('Failed to fetch:', err);
      setErrorMessage(err.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  // কম্পোনেন্ট মাউন্ট হওয়ার সাথে সাথে ডেটা ফেচ করার জন্য useEffect যুক্ত করা হলো
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
        const res = await fetch(CreateUrl, {
          method: 'POST',
          headers: getAuthHeaders(),
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

  // 3. Edit / Update Organization (PATCH)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    startTransition(async () => {
      try {
        const orgId = selectedOrg?.id || selectedOrg?._id;
        const updateUrl = `${process.env.NEXT_PUBLIC_API_URL}/organizations/profile/${orgId}`;

        const res = await fetch(updateUrl, {
          method: 'PATCH',
          headers: getAuthHeaders(),
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
        const res = await fetch(`${API_BASE_URL}/${selectedOrg.id || selectedOrg._id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
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
            <button onClick={() => setSuccessMessage('')} className="cursor-pointer"><X className="w-4 h-4" /></button>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center justify-between">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage('')} className="cursor-pointer"><X className="w-4 h-4" /></button>
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
              <div key={org.id || org._id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedOrg(org);
                          setFormData({
                            name: org.name || '',
                            industry: org.industry || '',
                            email: org.email || '',
                            phone: org.phone || '',
                            website: org.website || '',
                            address: org.address || '',
                            timezone: org.timezone || '',
                          });
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
                    {org.email && (
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">{org.email}</span>
                      </div>
                    )}
                    {org.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{org.phone}</span>
                      </div>
                    )}
                    {org.website && (
                      <div className="flex items-center gap-2 truncate">
                        <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                        <a href={org.website} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline truncate">
                          {org.website}
                        </a>
                      </div>
                    )}
                    {org.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{org.address}</span>
                      </div>
                    )}
                    {org.timezone && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{org.timezone}</span>
                      </div>
                    )}
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

        {/* CREATE MODAL COMPONENT */}
        <CreateOrgModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreate}
          formData={formData}
          setFormData={setFormData}
          isPending={isPending}
        />

        {/* EDIT MODAL COMPONENT */}
        <EditOrgModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSubmit={handleUpdate}
          formData={formData}
          setFormData={setFormData}
          isPending={isPending}
        />

        {/* DELETE MODAL */}
        {isDeleteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-sm p-6 space-y-5 text-center animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-800">Delete Organization</h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to delete <span className="font-bold text-slate-700">{selectedOrg?.name}</span>? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteOpen(false)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
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
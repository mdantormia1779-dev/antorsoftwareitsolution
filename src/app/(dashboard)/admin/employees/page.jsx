'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Plus, Loader2 } from 'lucide-react';

import EmployeeHeader from '../Components/Employee/EmployeeHeader';
import EmployeeFilters from '../Components/Employee/EmployeeFilters';
import EmployeeTable from '../Components/Employee/EmployeeTable';
import EmployeePagination from '../Components/Employee/EmployeePagination';
import EmployeeDetailsModal from '../Components/Employee/EmployeeDetailsModal';
import AddEmployeeModal from '../Components/Employee/AddEmployeeModal';
import EditEmployeeModal from '../Components/Employee/EditEmployeeModal';
import DeleteEmployeeModal from '../Components/Employee/DeleteEmployeeModal';

const ITEMS_PER_PAGE = 10;

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Filter & Pagination States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('Name');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDetailsEmployee, setSelectedDetailsEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
  };

  // 🔄 ডাটা ফেচ করা (Employees, Branches, Organizations)
  const fetchEmployeesData = async () => {
    try {
      setLoading(true);
      const [empRes, branchRes, orgRes] = await Promise.all([
        fetch(`${apiUrl}/users`, { method: "GET", credentials: "include", headers: getAuthHeaders() }),
        fetch(`${apiUrl}/branches`, { method: "GET", credentials: "include", headers: getAuthHeaders() }),
        fetch(`${apiUrl}/organizations`, { method: "GET", credentials: "include", headers: getAuthHeaders() })
      ]);

      const empData = await empRes.json();
      const branchData = await branchRes.json();
      const orgData = await orgRes.json();

      if (empRes.ok) setEmployees(empData.data || empData || []);
      if (branchRes.ok) setBranches(branchData.data || branchData || []);
      if (orgRes.ok) setOrganizations(orgData.data || orgData || []);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeesData();
  }, []);

  // ➕ Add Employee Handler
  const handleCreateEmployee = async (organizationId, newEmployeeData) => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const payload = {
            organizationId,
            fullName: newEmployeeData.fullName,
            email: newEmployeeData.email,
            phone: newEmployeeData.phone || null,
            employeeId: newEmployeeData.employeeId,
            password: newEmployeeData.password || undefined,
            role: newEmployeeData.role || 'EMPLOYEE',
            branchId: newEmployeeData.branchId || null,
            departmentId: newEmployeeData.departmentId || null,
            designationId: newEmployeeData.designationId || null,
          };

          const res = await fetch(`${apiUrl}/users`, {
            method: "POST",
            credentials: "include",
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
          });

          const result = await res.json();

          if (res.ok) {
            setEmployees((prev) => [result.data || result, ...prev]);
            setIsAddModalOpen(false);
            resolve({ success: true });
          } else {
            resolve({ success: false, error: result.message || result.error || 'Failed to create employee' });
          }
        } catch (error) {
          console.error("Error creating employee:", error);
          resolve({ success: false, error: 'An unexpected error occurred.' });
        }
      });
    });
  };

  // ✏️ Edit Click Handler
  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  // 💾 Save Edited Employee Handler
  const handleSaveEmployee = async (id, updatedData) => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const res = await fetch(`${apiUrl}/users/${id}`, {
            method: "PATCH",
            credentials: "include",
            headers: getAuthHeaders(),
            body: JSON.stringify(updatedData),
          });

          const result = await res.json();

          if (res.ok) {
            const updatedItem = result.data || result;
            setEmployees((prev) =>
              prev.map((item) => (item.id === id || item._id === id ? updatedItem : item))
            );
            setIsEditModalOpen(false);
            resolve({ success: true });
          } else {
            resolve({ success: false, error: result.message || result.error || 'Failed to update employee' });
          }
        } catch (error) {
          console.error("Error updating employee:", error);
          resolve({ success: false, error: 'An error occurred while updating the employee.' });
        }
      });
    });
  };

  // 🗑️ Delete Click Handler
  const handleDeleteClick = (employee) => {
    setDeletingEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  // ❌ Confirm Delete Handler
  const handleConfirmDelete = async (id) => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const res = await fetch(`${apiUrl}/users/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: getAuthHeaders(),
          });

          const result = await res.json();

          if (res.ok) {
            setEmployees((prev) => prev.filter((item) => item.id !== id && item._id !== id));
            setIsDeleteModalOpen(false);
            resolve({ success: true });
          } else {
            resolve({ success: false, error: result.message || result.error || 'Failed to delete employee' });
          }
        } catch (error) {
          console.error("Error deleting employee:", error);
          resolve({ success: false, error: 'An error occurred while deleting the employee.' });
        }
      });
    });
  };

  // 🔍 Filter & Sort Logic
  const filteredEmployees = employees
    .filter((emp) => {
      const name = emp.fullName || emp.name || '';
      const empCode = emp.employeeId || emp.empCode || '';

      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        empCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBranch =
        selectedBranch === 'All' || emp.branch?.name === selectedBranch || emp.branchId === selectedBranch;

      const matchesStatus =
        selectedStatus === 'All' ||
        emp.status === selectedStatus ||
        emp.faceStatus === selectedStatus;

      return matchesSearch && matchesBranch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'Name') {
        const nameA = a.fullName || a.name || '';
        const nameB = b.fullName || b.name || '';
        return nameA.localeCompare(nameB);
      }
      if (sortBy === 'Department') {
        return (a.department?.name || a.department || '').localeCompare(b.department?.name || b.department || '');
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

      <EmployeeHeader
        totalShown={filteredEmployees.length}
        onAddClick={() => setIsAddModalOpen(true)}
      />

      <EmployeeFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <EmployeeTable
        employees={paginatedEmployees}
        onViewDetails={(emp) => setSelectedDetailsEmployee(emp)}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <EmployeePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Modals */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onEmployeeCreated={handleCreateEmployee}
        branches={branches}
        organizations={organizations}
        defaultOrgId={
          organizations.length > 0 
            ? (organizations[0].id || organizations[0]._id || '') 
            : ''
        }
      />

      <EmployeeDetailsModal
        isOpen={!!selectedDetailsEmployee}
        employee={selectedDetailsEmployee}
        onClose={() => setSelectedDetailsEmployee(null)}
        onEdit={(emp) => handleEditClick(emp)}
        onDelete={(emp) => handleDeleteClick(emp)}
      />

      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        employee={editingEmployee}
        branches={branches}
        organizations={organizations}
        onSave={handleSaveEmployee}
      />

      <DeleteEmployeeModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        employee={deletingEmployee}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
};

export default Employees;
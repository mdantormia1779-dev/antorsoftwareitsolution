'use client';

import React, { useState, useTransition, useEffect } from 'react';
import EmployeeHeader from '../Components/Employee/EmployeeHeader';
import EmployeeFilters from '../Components/Employee/EmployeeFilters';
import EmployeeTable from '../Components/Employee/EmployeeTable';
import EmployeePagination from '../Components/Employee/EmployeePagination';
import EmployeeDetailsModal from '../Components/Employee/EmployeeDetailsModal';
import AddEmployeeModal from '../Components/Employee/AddEmployeeModal';
import EditEmployeeModal from '../Components/Employee/EditEmployeeModal';
import DeleteEmployeeModal from '../Components/Employee/DeleteEmployeeModal';

const ITEMS_PER_PAGE = 10;

const Employees = ({ initialEmployees = [], initialBranches = [], initialOrganizations = [] }) => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [branches, setBranches] = useState(initialBranches);
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('Name');
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  // Modals States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDetailsEmployee, setSelectedDetailsEmployee] = useState(null);
  const [selectedEditEmployee, setSelectedEditEmployee] = useState(null);
  const [selectedDeleteEmployee, setSelectedDeleteEmployee] = useState(null);

  // 🔄 ডাটা ফেচ করা (অর্গানাইজেশন, ব্রাঞ্চ এবং এমপ্লয়ি)
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const [empRes, branchRes, orgRes] = await Promise.all([
        fetch('/api/employees').then(res => res.json()).catch(() => null),
        fetch('/api/branches').then(res => res.json()).catch(() => null),
        fetch('/api/organizations').then(res => res.json()).catch(() => null)
      ]);

      if (empRes?.success && empRes?.data) setEmployees(empRes.data);
      if (branchRes?.success && branchRes?.data) setBranches(branchRes.data);
      if (orgRes?.success && orgRes?.data) setOrganizations(orgRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employees.length === 0 || branches.length === 0 || organizations.length === 0) {
      fetchEmployees();
    }
  }, []);

  // ➕ Add Employee API Call Handler
  const handleAddEmployee = async (newEmployeeData) => {
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployeeData),
      });

      const result = await response.json();

      if (result?.success && result?.data) {
        setEmployees((prev) => [result.data, ...prev]);
        setIsAddModalOpen(false);
      } else {
        alert(result?.error || result?.message || 'Failed to add employee');
      }
    } catch (err) {
      console.error("Add error:", err);
      alert('Something went wrong while adding employee.');
    }
  };

  // 🔍 Filter & Sort Logic
  const filteredEmployees = employees
    .filter((emp) => {
      const name = emp.name || emp.fullName || '';
      const empCode = emp.empCode || '';

      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        empCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBranch =
        selectedBranch === 'All' || emp.branch === selectedBranch || emp.branchId === selectedBranch;

      const matchesStatus =
        selectedStatus === 'All' ||
        emp.status === selectedStatus ||
        emp.faceStatus === selectedStatus;

      return matchesSearch && matchesBranch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'Name') {
        const nameA = a.name || a.fullName || '';
        const nameB = b.name || b.fullName || '';
        return nameA.localeCompare(nameB);
      }
      if (sortBy === 'Department') {
        return (a.department || '').localeCompare(b.department || '');
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <EmployeeHeader
        totalShown={filteredEmployees.length}
        onAddClick={() => setIsAddModalOpen(true)}
      />

      <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-2xs relative">
        {(isPending || loading) && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl pointer-events-none">
            <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
              Loading data...
            </span>
          </div>
        )}

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
          onEdit={(emp) => setSelectedEditEmployee(emp)}
          onDelete={(emp) => setSelectedDeleteEmployee(emp)}
        />

        <EmployeePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Modals */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onEmployeeCreated={handleAddEmployee}
        branches={branches}
        organizations={organizations} 
      />

      <EmployeeDetailsModal
        isOpen={!!selectedDetailsEmployee}
        employee={selectedDetailsEmployee}
        onClose={() => setSelectedDetailsEmployee(null)}
      />

      <EditEmployeeModal
        isOpen={!!selectedEditEmployee}
        onClose={() => setSelectedEditEmployee(null)}
        employee={selectedEditEmployee}
        branches={branches}
        // Employees.jsx এর ভেতর EditEmployeeModal এর onSave:
        onSave={async (updatedEmployeeData) => {
          try {
            const response = await fetch('/api/employees', { // [id] ছাড়া শুধু /api/employees
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedEmployeeData), // এখানে body-তেই id যাচ্ছে
            });
            
            const result = await response.json();
        
            if (response.ok && result?.success) {
              // লোকাল স্টেট আপডেট
              setEmployees((prev) =>
                prev.map((emp) => (emp.id === updatedEmployeeData.id ? result.data : emp))
              );
              setSelectedEditEmployee(null);
              // fetchEmployees(); // প্রয়োজনে আবার ডাটা লোড করা
            } else {
              alert(result?.message || 'Failed to update employee');
            }
          } catch (err) {
            console.error('Update error:', err);
          }
        }}
      />

      <DeleteEmployeeModal
        isOpen={!!selectedDeleteEmployee}
        employee={selectedDeleteEmployee}
        onClose={() => setSelectedDeleteEmployee(null)}
        onDeleteConfirm={async (employeeId) => {
          try {
            const response = await fetch('/api/employees', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: employeeId }),
            });

            const result = await response.json();

            if (response.ok && result?.success) {
              // লোকাল স্টেট থেকে ডিলিট হওয়া এমপ্লয়ি ফিল্টার করে বাদ দেওয়া
              setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId && emp._id !== employeeId));
              setSelectedDeleteEmployee(null);
            } else {
              alert(result?.message || result?.error || 'Failed to delete employee');
            }
          } catch (err) {
            console.error('Delete error:', err);
            alert('Something went wrong while deleting employee.');
          }
        }}
      />
    </div>
  );
};

export default Employees;
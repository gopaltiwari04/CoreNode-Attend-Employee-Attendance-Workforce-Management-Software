import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  MapPin,
  Users,
  Plus,
  Phone,
  CheckCircle2,
  Edit2,
  X,
  AlertTriangle,
  Building,
} from 'lucide-react';
import { Branch, Department } from '../../types';

export const LocationsDepartmentsModule: React.FC = () => {
  const {
    branches,
    departments,
    employees,
    addBranch,
    updateBranch,
    addDepartment,
    updateDepartment,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'branches' | 'departments'>('branches');

  // Branch modal
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [bName, setBName] = useState('');
  const [bCode, setBCode] = useState('');
  const [bAddress, setBAddress] = useState('');
  const [bPhone, setBPhone] = useState('');
  const [bManager, setBManager] = useState('');

  // Dept modal
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [dName, setDName] = useState('');
  const [dCode, setDCode] = useState('');
  const [dManager, setDManager] = useState('');

  const handleOpenAddBranch = () => {
    setEditingBranch(null);
    setBName('');
    setBCode('UB-NEW');
    setBAddress('');
    setBPhone('+91 80 ');
    setBManager('Branch Supervisor');
    setIsBranchModalOpen(true);
  };

  const handleOpenEditBranch = (b: Branch) => {
    setEditingBranch(b);
    setBName(b.name);
    setBCode(b.code);
    setBAddress(b.address);
    setBPhone(b.phone);
    setBManager(b.managerName);
    setIsBranchModalOpen(true);
  };

  const handleSubmitBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBranch) {
      updateBranch({
        ...editingBranch,
        name: bName.trim(),
        code: bCode.trim(),
        address: bAddress.trim(),
        phone: bPhone.trim(),
        managerName: bManager.trim(),
      });
    } else {
      addBranch({
        name: bName.trim(),
        code: bCode.trim(),
        address: bAddress.trim(),
        phone: bPhone.trim(),
        managerName: bManager.trim(),
        status: 'Active',
      });
    }
    setIsBranchModalOpen(false);
  };

  const handleOpenAddDept = () => {
    setEditingDept(null);
    setDName('');
    setDCode('NEW');
    setDManager('Team Lead');
    setIsDeptModalOpen(true);
  };

  const handleOpenEditDept = (d: Department) => {
    setEditingDept(d);
    setDName(d.name);
    setDCode(d.code);
    setDManager(d.managerName);
    setIsDeptModalOpen(true);
  };

  const handleSubmitDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDept) {
      updateDepartment({
        ...editingDept,
        name: dName.trim(),
        code: dCode.trim(),
        managerName: dManager.trim(),
      });
    } else {
      addDepartment({
        name: dName.trim(),
        code: dCode.trim(),
        managerName: dManager.trim(),
        status: 'Active',
      });
    }
    setIsDeptModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Locations & Departments</h1>
            <span className="text-[10px] font-bold bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
              Org Structure
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage multi-store locations, branch codes, and functional departmental reporting hierarchies
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('branches')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'branches' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Store Branches ({branches.length})
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'departments' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Departments ({departments.length})
            </button>
          </div>

          <button
            onClick={activeTab === 'branches' ? handleOpenAddBranch : handleOpenAddDept}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{activeTab === 'branches' ? 'Add Branch' : 'Add Department'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'branches' ? (
        /* Branches Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {branches.map(branch => {
            const count = employees.filter(e => e.branchId === branch.id && e.status === 'Active').length;

            return (
              <div
                key={branch.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{branch.name}</h3>
                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          Code: {branch.code}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenEditBranch(branch)}
                      className="p-1 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{branch.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Branch Head: <strong className="text-slate-800">{branch.managerName}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{count} Active Staff Stationed</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{branch.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Departments Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map(dept => {
            const count = employees.filter(e => e.departmentId === dept.id && e.status === 'Active').length;

            return (
              <div
                key={dept.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{dept.name}</h3>
                      <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded mt-1 inline-block">
                        Code: {dept.code}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenEditDept(dept)}
                      className="p-1 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 text-xs text-slate-600">
                    <span className="text-slate-400 block text-[11px]">Department Lead:</span>
                    <span className="font-semibold text-slate-800">{dept.managerName}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{count} Employees</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Branch Modal */}
      {isBranchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-3">
              {editingBranch ? 'Edit Store Location' : 'Add New Branch Location'}
            </h3>

            <form onSubmit={handleSubmitBranch} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Branch Name *</label>
                <input
                  type="text"
                  required
                  value={bName}
                  onChange={e => setBName(e.target.value)}
                  placeholder="Urban Brew Café — Whitefield"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Branch Code *</label>
                <input
                  type="text"
                  required
                  value={bCode}
                  onChange={e => setBCode(e.target.value)}
                  placeholder="UB-WTF"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address *</label>
                <input
                  type="text"
                  required
                  value={bAddress}
                  onChange={e => setBAddress(e.target.value)}
                  placeholder="ITPL Main Road, Whitefield, Bengaluru"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={bPhone}
                  onChange={e => setBPhone(e.target.value)}
                  placeholder="+91 80 4321 0000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Branch Head / Manager</label>
                <input
                  type="text"
                  value={bManager}
                  onChange={e => setBManager(e.target.value)}
                  placeholder="Manager Name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBranchModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-2xs"
                >
                  Save Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dept Modal */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-3">
              {editingDept ? 'Edit Department' : 'Create Department'}
            </h3>

            <form onSubmit={handleSubmitDept} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  value={dName}
                  onChange={e => setDName(e.target.value)}
                  placeholder="e.g. Quality & Barista Training"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department Code *</label>
                <input
                  type="text"
                  required
                  value={dCode}
                  onChange={e => setDCode(e.target.value)}
                  placeholder="TRN"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lead Manager</label>
                <input
                  type="text"
                  value={dManager}
                  onChange={e => setDManager(e.target.value)}
                  placeholder="Team Lead Name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDeptModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-2xs"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

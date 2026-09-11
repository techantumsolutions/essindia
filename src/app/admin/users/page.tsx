'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Shield,
  UserPlus,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  X,
  Lock,
  Mail,
  User,
  Key,
  Layers,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'admin' | 'agent';
  status: 'active' | 'inactive';
  accessPermissions: {
    cms: boolean;
    charts: boolean;
  };
  plainPassword?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin' as 'super_admin' | 'admin' | 'agent',
    status: 'active' as 'active' | 'inactive',
    cmsAccess: true,
    chartsAccess: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  // Delete Confirm State
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        if (res.status === 403) {
          setError('Access Restricted. Super Admin permissions required.');
          setIsLoading(false);
          return;
        }
        throw new Error('Failed to load users');
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowCurrentPassword(false);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'admin',
      status: 'active',
      cmsAccess: true,
      chartsAccess: true,
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowCurrentPassword(false);
    setFormData({
      fullName: user.fullName || '',
      email: user.email,
      password: '',
      confirmPassword: '',
      role: user.role,
      status: user.status,
      cmsAccess: user.accessPermissions?.cms ?? (user.role !== 'agent'),
      chartsAccess: user.accessPermissions?.charts ?? (user.role === 'super_admin' || user.role === 'agent'),
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleRoleChange = (newRole: 'super_admin' | 'admin' | 'agent') => {
    if (newRole === 'super_admin') {
      setFormData(prev => ({ ...prev, role: newRole, cmsAccess: true, chartsAccess: true }));
    } else if (newRole === 'agent') {
      setFormData(prev => ({ ...prev, role: newRole, cmsAccess: false, chartsAccess: true }));
    } else {
      setFormData(prev => ({ ...prev, role: newRole, cmsAccess: true, chartsAccess: true }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      setModalError('Please enter a valid email address (e.g. name@domain.com)');
      setIsSubmitting(false);
      return;
    }

    if (formData.password || !editingUser) {
      if (formData.password !== formData.confirmPassword) {
        setModalError('Passwords do not match. Please re-enter matching passwords.');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        status: formData.status,
        accessPermissions: {
          cms: formData.cmsAccess,
          charts: formData.chartsAccess
        }
      };

      const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save user');
      }

      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleUserStatus = async (targetUser: AdminUser) => {
    const newStatus = targetUser.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update user status');
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    try {
      const res = await fetch(`/api/admin/users/${deletingUser.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');
      setDeletingUser(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const superAdminCount = users.filter(u => u.role === 'super_admin').length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const agentCount = users.filter(u => u.role === 'agent').length;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#172033] via-[#2A1B3D] to-[#4B2A63] p-6 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-purple-500/20 text-purple-200 border border-purple-400/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Super Admin Privilege
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin & User Role Allocation</h1>
          <p className="text-slate-300 text-sm">Create, manage, and assign dual access roles for CMS Management and Chat Agents.</p>
        </div>

        <Button
          onClick={handleOpenCreateModal}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-6 rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 shrink-0"
        >
          <UserPlus className="w-5 h-5" /> Add New User
        </Button>
      </div>

      {/* Stats Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</p>
            <h3 className="text-2xl font-black text-slate-900">{users.length}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Super Admins</p>
            <h3 className="text-2xl font-black text-slate-900">{superAdminCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">CMS Admins</p>
            <h3 className="text-2xl font-black text-slate-900">{adminCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chat Agents</p>
            <h3 className="text-2xl font-black text-slate-900">{agentCount}</h3>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Controls Header */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search user name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-400">Filter Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl px-4 py-2 text-xs font-semibold focus:outline-none text-slate-700"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="agent">Agent</option>
            </select>

            <button
              onClick={fetchUsers}
              className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* User Table */}
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 font-semibold">Loading user accounts...</div>
        ) : error ? (
          <div className="p-12 text-center text-rose-500 font-bold">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">User Account</th>
                  <th className="py-4 px-6">Assigned Role</th>
                  <th className="py-4 px-6">Dual Access Rights</th>
                  <th className="py-4 px-6">Account Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* User */}
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-bold text-slate-900 leading-none">{user.fullName || 'Admin User'}</p>
                        <p className="text-xs text-slate-400 mt-1">{user.email}</p>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-6">
                      <span className={cn(
                        'px-3 py-1 rounded-full text-xs font-bold capitalize inline-flex items-center gap-1.5',
                        user.role === 'super_admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                        user.role === 'admin' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                        'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      )}>
                        <Shield className="w-3 h-3" />
                        {user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'Chat Agent'}
                      </span>
                    </td>

                    {/* Dual Access Rights */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'text-xs font-semibold px-2.5 py-1 rounded-xl flex items-center gap-1',
                          user.accessPermissions?.cms ? 'bg-slate-100 text-slate-800' : 'bg-slate-50 text-slate-300 line-through'
                        )}>
                          <Layers className="w-3 h-3" /> CMS
                        </span>
                        <span className={cn(
                          'text-xs font-semibold px-2.5 py-1 rounded-xl flex items-center gap-1',
                          user.accessPermissions?.charts ? 'bg-purple-50 text-purple-700 font-bold' : 'bg-slate-50 text-slate-300 line-through'
                        )}>
                          <BarChart3 className="w-3 h-3" /> Charts
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleUserStatus(user)}
                        className={cn(
                          'text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 transition-all hover:scale-105 shadow-sm',
                          user.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                        )}
                        title={user.status === 'active' ? 'Click to Deactivate account' : 'Click to Activate account'}
                      >
                        {user.status === 'active' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {user.status === 'active' ? 'Active' : 'Deactivated'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="p-2 rounded-xl text-slate-500 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                          title="Edit User Role"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Create / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white rounded-[28px] shadow-2xl border border-slate-100 max-w-2xl w-full z-10 overflow-hidden relative"
            >
              {/* Modal Header */}
              <div className="px-6 py-4.5 bg-gradient-to-r from-[#172033] to-[#4B2A63] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                    <UserPlus className="w-4 h-4 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base leading-snug">
                      {editingUser ? 'Edit User & Permissions' : 'Create New Account'}
                    </h3>
                    <p className="text-[11px] text-purple-200/80 font-medium">
                      {editingUser ? 'Update user role allocation and access rights' : 'Add a new administrator or chat agent to the system'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {modalError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{modalError}</span>
                  </motion.div>
                )}

                {/* Account Details Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                      <input
                        type="text"
                        required
                        placeholder="Enter full name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-slate-900 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                      <input
                        type="email"
                        required
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-slate-900 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Existing Password Preview for Edit Mode */}
                {editingUser && (
                  <div className="flex items-center justify-between bg-purple-50/80 border border-purple-200/80 px-4 py-2.5 rounded-xl text-xs font-semibold text-purple-950 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-purple-600 shrink-0" />
                      <span className="text-[11px] font-extrabold uppercase text-purple-900 tracking-wider">Current Account Password:</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="bg-white px-2.5 py-0.5 rounded-md border border-purple-200 text-purple-950 font-bold">
                        {showCurrentPassword ? (formData.password || editingUser.plainPassword || 'Not Set (Set new password below)') : '••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded-lg hover:bg-purple-100/60 transition-colors"
                        title={showCurrentPassword ? 'Hide current password' : 'View current password'}
                      >
                        {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Account Details Row 2: Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 ml-1 flex justify-between">
                      <span>Password</span>
                      {editingUser && <span className="text-slate-400 font-normal lowercase">(optional)</span>}
                    </label>
                    <div className="relative group">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required={!editingUser}
                        placeholder={editingUser ? 'Enter new password (optional)' : 'Enter password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white rounded-xl pl-10 pr-10 py-2.5 text-xs font-semibold text-slate-900 transition-all outline-none [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-purple-600 transition-colors rounded-lg"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 ml-1 flex justify-between">
                      <span>Re-enter Password</span>
                    </label>
                    <div className="relative group">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required={!editingUser || Boolean(formData.password)}
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white rounded-xl pl-10 pr-10 py-2.5 text-xs font-semibold text-slate-900 transition-all outline-none [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-purple-600 transition-colors rounded-lg"
                        title={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Role Selection Cards */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 ml-1">Assign User Role</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'super_admin', label: 'Super Admin', desc: 'Full System Control', icon: Shield },
                      { id: 'admin', label: 'Admin', desc: 'CMS Management', icon: Layers },
                      { id: 'agent', label: 'Chat Agent', desc: 'Charts Only', icon: BarChart3 }
                    ].map((r) => {
                      const IconComp = r.icon;
                      const isSelected = formData.role === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => handleRoleChange(r.id as any)}
                          className={cn(
                            'p-3 rounded-xl border text-left transition-all relative flex items-center gap-3',
                            isSelected
                              ? 'bg-purple-50/80 border-purple-600 text-purple-950 ring-2 ring-purple-500/20 shadow-sm'
                              : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100/80'
                          )}
                        >
                          <div className={cn(
                            'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                            isSelected ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'
                          )}>
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-xs leading-tight truncate">{r.label}</p>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">{r.desc}</p>
                          </div>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dual Access Rights Configuration */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block ml-1">
                    Dual Access Permissions
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setFormData({ ...formData, cmsAccess: !formData.cmsAccess })}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:border-purple-300 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Layers className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">CMS Access</p>
                          <p className="text-[10px] text-slate-400">Pages, Media, Blogs</p>
                        </div>
                      </div>
                      <div className={cn(
                        'w-9 h-5 rounded-full transition-colors relative p-0.5 shrink-0',
                        formData.cmsAccess ? 'bg-purple-600' : 'bg-slate-300'
                      )}>
                        <div className={cn(
                          'w-4 h-4 rounded-full bg-white transition-transform',
                          formData.cmsAccess ? 'translate-x-4' : 'translate-x-0'
                        )} />
                      </div>
                    </div>

                    <div
                      onClick={() => setFormData({ ...formData, chartsAccess: !formData.chartsAccess })}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:border-purple-300 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                          <BarChart3 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Charts Access</p>
                          <p className="text-[10px] text-slate-400">Live Chats & Metrics</p>
                        </div>
                      </div>
                      <div className={cn(
                        'w-9 h-5 rounded-full transition-colors relative p-0.5 shrink-0',
                        formData.chartsAccess ? 'bg-purple-600' : 'bg-slate-300'
                      )}>
                        <div className={cn(
                          'w-4 h-4 rounded-full bg-white transition-transform',
                          formData.chartsAccess ? 'translate-x-4' : 'translate-x-0'
                        )} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl px-4 py-2 text-xs text-slate-500 font-bold">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-xl text-xs font-bold px-6 py-2.5 shadow-md shadow-purple-900/20">
                    {isSubmitting ? 'Saving...' : editingUser ? 'Update Account' : 'Create Account'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeletingUser(null)} />
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full z-10 shadow-2xl text-center space-y-4 border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Delete User Account</h3>
                <p className="text-xs text-slate-500 mt-1">Are you sure you want to delete <strong>{deletingUser.fullName || deletingUser.email}</strong>?</p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setDeletingUser(null)} className="flex-1 rounded-2xl">Cancel</Button>
                <Button onClick={handleDeleteUser} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl">Delete</Button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

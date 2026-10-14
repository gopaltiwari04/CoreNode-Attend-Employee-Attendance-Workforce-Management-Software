import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Branch,
  Department,
  Shift,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  AttendanceCorrectionRequest,
  AppNotification,
  ActivityLog,
  OrganizationSettings,
  UserRole,
  ActiveTab,
  AttendanceStatus,
} from '../types';
import {
  initialBranches,
  initialDepartments,
  initialShifts,
  initialEmployees,
  initialAttendanceRecords,
  initialLeaveRequests,
  initialRegularizationRequests,
  initialNotifications,
  initialActivityLogs,
  initialOrganizationSettings,
} from '../data/seedData';
import {
  getTodayDateString,
  getCurrentTimeString,
  calculateWorkingHours,
  isLateCheckIn,
} from '../utils/formatters';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface AppContextType {
  // Session & navigation state
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  selectedBranchId: string; // 'all' or branch ID
  setSelectedBranchId: (branchId: string) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedEmployeeId: string; // For self-service or details
  setSelectedEmployeeId: (id: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;

  // Guided demo tour
  tourStep: number;
  isTourActive: boolean;
  startTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: () => void;

  // Coming Soon modal for Biometrics / Hardware
  isHardwareModalOpen: boolean;
  hardwareModalTitle: string;
  openHardwareModal: (title?: string) => void;
  closeHardwareModal: () => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Data states
  branches: Branch[];
  departments: Department[];
  shifts: Shift[];
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  regularizationRequests: AttendanceCorrectionRequest[];
  notifications: AppNotification[];
  activityLogs: ActivityLog[];
  settings: OrganizationSettings;

  // Business Logic Operations
  resetDemoData: () => void;

  // Employee CRUD
  addEmployee: (emp: Omit<Employee, 'id'>) => Employee;
  updateEmployee: (emp: Employee) => void;
  toggleEmployeeStatus: (id: string) => void;

  // Attendance operations
  checkInEmployee: (employeeId: string, customTime?: string) => { success: boolean; error?: string };
  checkOutEmployee: (employeeId: string, customTime?: string) => { success: boolean; error?: string };
  markEmployeeAttendance: (
    employeeId: string,
    status: AttendanceStatus,
    date?: string,
    checkIn?: string,
    checkOut?: string,
    note?: string
  ) => void;
  updateAttendanceRecord: (record: AttendanceRecord) => void;

  // Leave operations
  submitLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'submissionDate' | 'status'>) => void;
  approveLeaveRequest: (id: string, reviewerComment?: string) => void;
  rejectLeaveRequest: (id: string, reviewerComment?: string) => void;
  cancelLeaveRequest: (id: string) => void;

  // Regularization operations
  submitRegularizationRequest: (req: Omit<AttendanceCorrectionRequest, 'id' | 'status' | 'createdAt'>) => void;
  approveRegularizationRequest: (id: string, reviewerComment?: string) => void;
  rejectRegularizationRequest: (id: string, reviewerComment?: string) => void;

  // Shifts operations
  createShift: (shift: Omit<Shift, 'id'>) => Shift;
  updateShift: (shift: Shift) => void;
  deleteShift: (id: string) => { success: boolean; message?: string };
  assignShiftToEmployee: (employeeId: string, shiftId: string) => void;

  // Departments & Branches
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  updateDepartment: (dept: Department) => void;
  addBranch: (branch: Omit<Branch, 'id'>) => void;
  updateBranch: (branch: Branch) => void;

  // Settings & Notifications
  updateSettings: (newSettings: OrganizationSettings) => void;
  markNotificationsAsRead: () => void;
  addNotification: (title: string, message: string, type?: AppNotification['type'], targetTab?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'corenode_attend_demo_state_v1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Session states
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('EMP001');

  // Tour
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(0);

  // Hardware integration placeholder modal
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);
  const [hardwareModalTitle, setHardwareModalTitle] = useState('Hardware Device Integration');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Persistent demo data
  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.branches) return parsed.branches;
      } catch (e) {
        console.error(e);
      }
    }
    return initialBranches;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.departments) return parsed.departments;
      } catch (e) {
        console.error(e);
      }
    }
    return initialDepartments;
  });

  const [shifts, setShifts] = useState<Shift[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.shifts) return parsed.shifts;
      } catch (e) {
        console.error(e);
      }
    }
    return initialShifts;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.employees) return parsed.employees;
      } catch (e) {
        console.error(e);
      }
    }
    return initialEmployees;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.attendanceRecords) return parsed.attendanceRecords;
      } catch (e) {
        console.error(e);
      }
    }
    return initialAttendanceRecords;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.leaveRequests) return parsed.leaveRequests;
      } catch (e) {
        console.error(e);
      }
    }
    return initialLeaveRequests;
  });

  const [regularizationRequests, setRegularizationRequests] = useState<AttendanceCorrectionRequest[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.regularizationRequests) return parsed.regularizationRequests;
      } catch (e) {
        console.error(e);
      }
    }
    return initialRegularizationRequests;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.notifications) return parsed.notifications;
      } catch (e) {
        console.error(e);
      }
    }
    return initialNotifications;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.activityLogs) return parsed.activityLogs;
      } catch (e) {
        console.error(e);
      }
    }
    return initialActivityLogs;
  });

  const [settings, setSettings] = useState<OrganizationSettings>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.settings) return parsed.settings;
      } catch (e) {
        console.error(e);
      }
    }
    return initialOrganizationSettings;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      const stateToPersist = {
        branches,
        departments,
        shifts,
        employees,
        attendanceRecords,
        leaveRequests,
        regularizationRequests,
        notifications,
        activityLogs,
        settings,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [
    branches,
    departments,
    shifts,
    employees,
    attendanceRecords,
    leaveRequests,
    regularizationRequests,
    notifications,
    activityLogs,
    settings,
  ]);

  // Reset function
  const resetDemoData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setBranches(initialBranches);
    setDepartments(initialDepartments);
    setShifts(initialShifts);
    setEmployees(initialEmployees);
    setAttendanceRecords(initialAttendanceRecords);
    setLeaveRequests(initialLeaveRequests);
    setRegularizationRequests(initialRegularizationRequests);
    setNotifications(initialNotifications);
    setActivityLogs(initialActivityLogs);
    setSettings(initialOrganizationSettings);
    setSelectedBranchId('all');
    setCurrentRole('admin');
    setActiveTab('overview');
    showToast('Demo data has been restored to factory default state.', 'info');
  };

  // Log activity helper
  const addActivity = (action: string, details: string, type: ActivityLog['type'], actor: string = 'Current User') => {
    const now = new Date();
    const timeFormatted = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + ', ' + getCurrentTimeString();

    const newLog: ActivityLog = {
      id: 'LOG-' + Math.random().toString(36).substring(2, 9),
      action,
      details,
      actor,
      timestamp: timeFormatted,
      type,
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Notification helper
  const addNotification = (
    title: string,
    message: string,
    type: AppNotification['type'] = 'info',
    targetTab?: string
  ) => {
    const now = new Date();
    const timeFormatted = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + ', ' + getCurrentTimeString();

    const newNotif: AppNotification = {
      id: 'NOTIF-' + Math.random().toString(36).substring(2, 9),
      title,
      message,
      type,
      timestamp: timeFormatted,
      read: false,
      targetTab,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Guided demo tour actions
  const startTour = () => {
    setIsTourActive(true);
    setTourStep(0);
    setActiveTab('overview');
  };

  const nextTourStep = () => {
    const next = tourStep + 1;
    setTourStep(next);
    // Align active tab with guided demo step
    if (next === 1) setActiveTab('live-attendance');
    else if (next === 2) setActiveTab('employees');
    else if (next === 3) setActiveTab('leaves');
    else if (next === 4) setActiveTab('reports');
    else if (next === 5) setActiveTab('payroll');
    else if (next >= 6) {
      endTour();
    }
  };

  const prevTourStep = () => {
    const prev = Math.max(0, tourStep - 1);
    setTourStep(prev);
    if (prev === 0) setActiveTab('overview');
    else if (prev === 1) setActiveTab('live-attendance');
    else if (prev === 2) setActiveTab('employees');
    else if (prev === 3) setActiveTab('leaves');
    else if (prev === 4) setActiveTab('reports');
  };

  const endTour = () => {
    setIsTourActive(false);
    setTourStep(0);
  };

  const openHardwareModal = (title?: string) => {
    setHardwareModalTitle(title || 'Hardware Attendance Integration (Coming Soon)');
    setIsHardwareModalOpen(true);
  };

  const closeHardwareModal = () => {
    setIsHardwareModalOpen(false);
  };

  // Employee CRUD operations
  const addEmployee = (empData: Omit<Employee, 'id'>): Employee => {
    // Generate new EMP ID
    const count = employees.length + 1;
    const newId = `EMP${String(count).padStart(3, '0')}`;
    const newEmployee: Employee = {
      ...empData,
      id: newId,
    };

    setEmployees(prev => [newEmployee, ...prev]);
    showToast(`Employee ${newEmployee.name} (${newId}) added successfully.`);
    addActivity('Add Employee', `Created employee profile for ${newEmployee.name} (${newId})`, 'employee');
    addNotification('New Employee Joined', `${newEmployee.name} added to ${newEmployee.designation}`, 'info', 'employees');
    return newEmployee;
  };

  const updateEmployee = (emp: Employee) => {
    setEmployees(prev => prev.map(e => (e.id === emp.id ? emp : e)));
    showToast(`Updated details for ${emp.name}.`);
    addActivity('Update Employee', `Updated information for ${emp.name} (${emp.id})`, 'employee');
  };

  const toggleEmployeeStatus = (id: string) => {
    const target = employees.find(e => e.id === id);
    if (!target) return;
    const newStatus = target.status === 'Active' ? 'Inactive' : 'Active';
    setEmployees(prev => prev.map(e => (e.id === id ? { ...e, status: newStatus } : e)));
    showToast(`Employee ${target.name} marked as ${newStatus}.`, newStatus === 'Active' ? 'success' : 'info');
    addActivity('Employee Status Changed', `${target.name} changed to ${newStatus}`, 'employee');
  };

  // Attendance operations (Check-in, Check-out, Manual Mark)
  const checkInEmployee = (employeeId: string, customTime?: string): { success: boolean; error?: string } => {
    const todayStr = getTodayDateString();
    const time = customTime || getCurrentTimeString();

    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return { success: false, error: 'Employee not found.' };

    const shift = shifts.find(s => s.id === emp.shiftId) || shifts[0];

    // Find if record already exists for today
    const existingIndex = attendanceRecords.findIndex(r => r.employeeId === employeeId && r.date === todayStr);
    const existing = attendanceRecords[existingIndex];

    if (existing && existing.checkIn && existing.status !== 'Not Checked In' && existing.status !== 'Absent') {
      return { success: false, error: `${emp.name} is already checked in at ${existing.checkIn} today.` };
    }

    // Determine if late based on shift and grace period
    const late = isLateCheckIn(time, shift.startTime, shift.graceMinutes);
    const newStatus: AttendanceStatus = late ? 'Late' : 'Present';

    let updatedRecord: AttendanceRecord;
    if (existing) {
      updatedRecord = {
        ...existing,
        checkIn: time,
        checkOut: undefined,
        status: newStatus,
        workingHours: 0,
      };
      setAttendanceRecords(prev => prev.map(r => (r.id === existing.id ? updatedRecord : r)));
    } else {
      updatedRecord = {
        id: `ATT-LIVE-${Date.now()}-${employeeId}`,
        employeeId,
        date: todayStr,
        checkIn: time,
        shiftId: emp.shiftId,
        status: newStatus,
        workingHours: 0,
        breakMinutes: 0,
        branchId: emp.branchId,
      };
      setAttendanceRecords(prev => [updatedRecord, ...prev]);
    }

    const toastMsg = late
      ? `${emp.name} checked in at ${time} (Marked Late - Shift starts at ${shift.startTime})`
      : `${emp.name} checked in successfully at ${time}.`;
    showToast(toastMsg, late ? 'warning' : 'success');

    addActivity(
      late ? 'Late Check-In' : 'Employee Check-In',
      `${emp.name} checked in at ${time} (${late ? 'Late arrival' : 'On-time'})`,
      'attendance',
      emp.name
    );

    if (late) {
      addNotification('Late Arrival', `${emp.name} arrived at ${time} (Grace period: ${shift.graceMinutes}m)`, 'warning', 'live-attendance');
    }

    return { success: true };
  };

  const checkOutEmployee = (employeeId: string, customTime?: string): { success: boolean; error?: string } => {
    const todayStr = getTodayDateString();
    const time = customTime || getCurrentTimeString();

    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return { success: false, error: 'Employee not found.' };

    const record = attendanceRecords.find(r => r.employeeId === employeeId && r.date === todayStr);

    if (!record || !record.checkIn) {
      return { success: false, error: `Cannot check out: ${emp.name} has not checked in today yet.` };
    }

    if (record.checkOut) {
      return { success: false, error: `${emp.name} has already checked out at ${record.checkOut}.` };
    }

    // Check check-out time is not prior to check-in time (unless overnight shift)
    const shift = shifts.find(s => s.id === record.shiftId) || shifts[0];
    if (!shift.isOvernight) {
      const [inH, inM] = record.checkIn.split(':').map(Number);
      const [outH, outM] = time.split(':').map(Number);
      if (outH * 60 + outM < inH * 60 + inM) {
        return { success: false, error: 'Check-out time cannot precede check-in time.' };
      }
    }

    const calculatedHours = calculateWorkingHours(record.checkIn, time, 0); // Active live break or 0
    const updatedRecord: AttendanceRecord = {
      ...record,
      checkOut: time,
      status: 'Checked Out',
      workingHours: calculatedHours,
    };

    setAttendanceRecords(prev => prev.map(r => (r.id === record.id ? updatedRecord : r)));
    showToast(`${emp.name} checked out at ${time}. Total working duration: ${calculatedHours} hrs.`);
    addActivity('Employee Check-Out', `${emp.name} checked out at ${time}. Logged ${calculatedHours}h`, 'attendance', emp.name);

    return { success: true };
  };

  const markEmployeeAttendance = (
    employeeId: string,
    status: AttendanceStatus,
    date?: string,
    checkIn?: string,
    checkOut?: string,
    note?: string
  ) => {
    const targetDate = date || getTodayDateString();
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;

    const shift = shifts.find(s => s.id === emp.shiftId) || shifts[0];
    const workingHours = checkIn && checkOut ? calculateWorkingHours(checkIn, checkOut, shift.breakMinutes) : (status === 'Present' ? 7.5 : status === 'Half Day' ? 4.0 : 0);

    const existingIndex = attendanceRecords.findIndex(r => r.employeeId === employeeId && r.date === targetDate);

    if (existingIndex >= 0) {
      const existing = attendanceRecords[existingIndex];
      const updated: AttendanceRecord = {
        ...existing,
        status,
        checkIn: checkIn || existing.checkIn,
        checkOut: checkOut || existing.checkOut,
        workingHours,
        note: note || existing.note,
      };
      setAttendanceRecords(prev => prev.map(r => (r.id === existing.id ? updated : r)));
    } else {
      const newRec: AttendanceRecord = {
        id: `ATT-MANUAL-${Date.now()}-${employeeId}`,
        employeeId,
        date: targetDate,
        checkIn,
        checkOut,
        shiftId: emp.shiftId,
        status,
        workingHours,
        breakMinutes: shift.breakMinutes,
        note,
        branchId: emp.branchId,
      };
      setAttendanceRecords(prev => [newRec, ...prev]);
    }

    showToast(`Attendance updated for ${emp.name} as "${status}".`);
    addActivity('Manual Attendance Update', `Marked ${emp.name} as ${status} for ${targetDate}`, 'attendance');
  };

  const updateAttendanceRecord = (record: AttendanceRecord) => {
    setAttendanceRecords(prev => prev.map(r => (r.id === record.id ? record : r)));
    showToast('Attendance record updated.');
  };

  // Leave operations
  const submitLeaveRequest = (reqData: Omit<LeaveRequest, 'id' | 'submissionDate' | 'status'>) => {
    const todayStr = getTodayDateString();
    const emp = employees.find(e => e.id === reqData.employeeId);
    const newReq: LeaveRequest = {
      ...reqData,
      id: `LR-${Date.now().toString().slice(-4)}`,
      submissionDate: todayStr,
      status: 'Pending',
    };

    setLeaveRequests(prev => [newReq, ...prev]);
    showToast(`Leave request submitted for ${emp?.name || 'Employee'}.`);
    addActivity('Leave Request Submitted', `${emp?.name} requested ${reqData.daysCount} days of ${reqData.leaveType}`, 'leave', emp?.name);
    addNotification('Leave Request Awaiting Review', `${emp?.name} requested ${reqData.daysCount} day(s) leave`, 'info', 'leaves');
  };

  const approveLeaveRequest = (id: string, reviewerComment?: string) => {
    const req = leaveRequests.find(r => r.id === id);
    if (!req) return;
    const emp = employees.find(e => e.id === req.employeeId);

    // Update leave request
    const updated: LeaveRequest = {
      ...req,
      status: 'Approved',
      reviewer: currentRole === 'admin' ? 'Business Owner (Admin)' : 'HR / Branch Manager',
      reviewerComment: reviewerComment || 'Approved as per business scheduling.',
    };
    setLeaveRequests(prev => prev.map(r => (r.id === id ? updated : r)));

    // Deduct leave balance if casual, sick, or earned
    if (emp) {
      const balance = { ...emp.leaveBalance };
      if (req.leaveType === 'Casual Leave') balance.casual = Math.max(0, balance.casual - req.daysCount);
      if (req.leaveType === 'Sick Leave') balance.sick = Math.max(0, balance.sick - req.daysCount);
      if (req.leaveType === 'Earned Leave') balance.earned = Math.max(0, balance.earned - req.daysCount);

      setEmployees(prev => prev.map(e => (e.id === emp.id ? { ...e, leaveBalance: balance } : e)));

      // If leave overlaps with today, mark today's attendance as 'On Leave'
      const todayStr = getTodayDateString();
      if (todayStr >= req.startDate && todayStr <= req.endDate) {
        markEmployeeAttendance(emp.id, 'On Leave', todayStr, undefined, undefined, `Approved Leave: ${req.leaveType}`);
      }
    }

    showToast(`Approved leave request for ${emp?.name}.`);
    addActivity('Leave Approved', `Approved ${req.daysCount} days ${req.leaveType} for ${emp?.name}`, 'leave');
  };

  const rejectLeaveRequest = (id: string, reviewerComment?: string) => {
    const req = leaveRequests.find(r => r.id === id);
    if (!req) return;
    const emp = employees.find(e => e.id === req.employeeId);

    const updated: LeaveRequest = {
      ...req,
      status: 'Rejected',
      reviewer: currentRole === 'admin' ? 'Business Owner (Admin)' : 'HR / Branch Manager',
      reviewerComment: reviewerComment || 'Rejected due to shift operational requirements.',
    };
    setLeaveRequests(prev => prev.map(r => (r.id === id ? updated : r)));
    showToast(`Rejected leave request for ${emp?.name}.`, 'info');
    addActivity('Leave Rejected', `Rejected leave request for ${emp?.name}`, 'leave');
  };

  const cancelLeaveRequest = (id: string) => {
    const req = leaveRequests.find(r => r.id === id);
    if (!req) return;
    setLeaveRequests(prev => prev.map(r => (r.id === id ? { ...r, status: 'Cancelled' } : r)));
    showToast('Leave request cancelled.');
  };

  // Regularization operations
  const submitRegularizationRequest = (reqData: Omit<AttendanceCorrectionRequest, 'id' | 'status' | 'createdAt'>) => {
    const emp = employees.find(e => e.id === reqData.employeeId);
    const newReq: AttendanceCorrectionRequest = {
      ...reqData,
      id: `REG-${Date.now().toString().slice(-4)}`,
      status: 'Pending',
      createdAt: `${getTodayDateString()} ${getCurrentTimeString()}`,
    };

    setRegularizationRequests(prev => [newReq, ...prev]);
    showToast(`Regularization request submitted for ${emp?.name}.`);
    addActivity('Regularization Submitted', `${emp?.name} requested punch correction for ${reqData.date}`, 'regularization', emp?.name);
    addNotification('Correction Request Pending', `${emp?.name} submitted regularization for ${reqData.date}`, 'info', 'regularization');
  };

  const approveRegularizationRequest = (id: string, reviewerComment?: string) => {
    const req = regularizationRequests.find(r => r.id === id);
    if (!req) return;
    const emp = employees.find(e => e.id === req.employeeId);

    const updated: AttendanceCorrectionRequest = {
      ...req,
      status: 'Approved',
      reviewer: currentRole === 'admin' ? 'Business Owner' : 'HR Manager',
      reviewerComment: reviewerComment || 'Approved based on manager verification.',
    };
    setRegularizationRequests(prev => prev.map(r => (r.id === id ? updated : r)));

    // Update actual attendance record
    const shift = emp ? shifts.find(s => s.id === emp.shiftId) || shifts[0] : shifts[0];
    const workingHours = calculateWorkingHours(req.requestedCheckIn, req.requestedCheckOut, shift.breakMinutes);
    const isLate = isLateCheckIn(req.requestedCheckIn, shift.startTime, shift.graceMinutes);
    const status: AttendanceStatus = isLate ? 'Late' : 'Present';

    const existingRec = attendanceRecords.find(r => r.employeeId === req.employeeId && r.date === req.date);

    if (existingRec) {
      setAttendanceRecords(prev =>
        prev.map(r =>
          r.id === existingRec.id
            ? {
                ...r,
                checkIn: req.requestedCheckIn,
                checkOut: req.requestedCheckOut,
                workingHours,
                status,
                isRegularized: true,
                note: `Regularized on ${getTodayDateString()}`,
              }
            : r
        )
      );
    } else if (emp) {
      const newRec: AttendanceRecord = {
        id: `ATT-REG-FIX-${Date.now()}-${emp.id}`,
        employeeId: emp.id,
        date: req.date,
        checkIn: req.requestedCheckIn,
        checkOut: req.requestedCheckOut,
        shiftId: emp.shiftId,
        status,
        workingHours,
        breakMinutes: shift.breakMinutes,
        isRegularized: true,
        note: 'Approved regularization',
        branchId: emp.branchId,
      };
      setAttendanceRecords(prev => [newRec, ...prev]);
    }

    showToast(`Regularization approved for ${emp?.name}. Attendance recalculated.`);
    addActivity('Regularization Approved', `Corrected punch times for ${emp?.name} on ${req.date}`, 'regularization');
  };

  const rejectRegularizationRequest = (id: string, reviewerComment?: string) => {
    const req = regularizationRequests.find(r => r.id === id);
    if (!req) return;
    const emp = employees.find(e => e.id === req.employeeId);

    const updated: AttendanceCorrectionRequest = {
      ...req,
      status: 'Rejected',
      reviewer: currentRole === 'admin' ? 'Business Owner' : 'HR Manager',
      reviewerComment: reviewerComment || 'Discrepancy cannot be verified with manager logs.',
    };
    setRegularizationRequests(prev => prev.map(r => (r.id === id ? updated : r)));
    showToast(`Regularization rejected for ${emp?.name}.`, 'info');
    addActivity('Regularization Rejected', `Rejected punch correction for ${emp?.name}`, 'regularization');
  };

  // Shifts operations
  const createShift = (shiftData: Omit<Shift, 'id'>): Shift => {
    const newShift: Shift = {
      ...shiftData,
      id: `SH-${Date.now().toString().slice(-4)}`,
    };
    setShifts(prev => [...prev, newShift]);
    showToast(`New shift "${newShift.name}" created.`);
    addActivity('Shift Created', `Created ${newShift.name} (${newShift.startTime} - ${newShift.endTime})`, 'shift');
    return newShift;
  };

  const updateShift = (shift: Shift) => {
    setShifts(prev => prev.map(s => (s.id === shift.id ? shift : s)));
    showToast(`Shift "${shift.name}" updated.`);
    addActivity('Shift Updated', `Updated parameters for shift ${shift.name}`, 'shift');
  };

  const deleteShift = (id: string): { success: boolean; message?: string } => {
    const assignedCount = employees.filter(e => e.shiftId === id).length;
    if (assignedCount > 0) {
      return {
        success: false,
        message: `Cannot delete shift: It is currently assigned to ${assignedCount} employee(s). Please reassign them first.`,
      };
    }
    const target = shifts.find(s => s.id === id);
    setShifts(prev => prev.filter(s => s.id !== id));
    showToast(`Shift "${target?.name}" removed.`);
    addActivity('Shift Deleted', `Deleted unused shift ${target?.name}`, 'shift');
    return { success: true };
  };

  const assignShiftToEmployee = (employeeId: string, shiftId: string) => {
    const emp = employees.find(e => e.id === employeeId);
    const shift = shifts.find(s => s.id === shiftId);
    if (!emp || !shift) return;

    setEmployees(prev => prev.map(e => (e.id === employeeId ? { ...e, shiftId } : e)));
    showToast(`Assigned "${shift.name}" to ${emp.name}.`);
    addActivity('Shift Reassigned', `${emp.name} assigned to ${shift.name}`, 'shift');
  };

  // Department & Branch CRUD
  const addDepartment = (deptData: Omit<Department, 'id'>) => {
    const newDept: Department = {
      ...deptData,
      id: `DEP-${deptData.code.toUpperCase().replace(/\s+/g, '')}`,
    };
    setDepartments(prev => [...prev, newDept]);
    showToast(`Department "${newDept.name}" created.`);
    addActivity('Department Added', `Created department ${newDept.name}`, 'settings');
  };

  const updateDepartment = (dept: Department) => {
    setDepartments(prev => prev.map(d => (d.id === dept.id ? dept : d)));
    showToast(`Department "${dept.name}" updated.`);
  };

  const addBranch = (branchData: Omit<Branch, 'id'>) => {
    const newBranch: Branch = {
      ...branchData,
      id: `BR-${branchData.code.toUpperCase().replace(/\s+/g, '')}`,
    };
    setBranches(prev => [...prev, newBranch]);
    showToast(`Branch location "${newBranch.name}" created.`);
    addActivity('Location Added', `Created branch ${newBranch.name}`, 'settings');
  };

  const updateBranch = (branch: Branch) => {
    setBranches(prev => prev.map(b => (b.id === branch.id ? branch : b)));
    showToast(`Branch "${branch.name}" updated.`);
  };

  // Settings
  const updateSettings = (newSettings: OrganizationSettings) => {
    setSettings(newSettings);
    showToast('Organization settings updated successfully.');
    addActivity('Settings Saved', 'Updated organization configuration & attendance policy', 'settings');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        selectedBranchId,
        setSelectedBranchId,
        activeTab,
        setActiveTab,
        selectedEmployeeId,
        setSelectedEmployeeId,
        isLoggedIn,
        setIsLoggedIn,

        tourStep,
        isTourActive,
        startTour,
        nextTourStep,
        prevTourStep,
        endTour,

        isHardwareModalOpen,
        hardwareModalTitle,
        openHardwareModal,
        closeHardwareModal,

        toasts,
        showToast,
        removeToast,

        branches,
        departments,
        shifts,
        employees,
        attendanceRecords,
        leaveRequests,
        regularizationRequests,
        notifications,
        activityLogs,
        settings,

        resetDemoData,

        addEmployee,
        updateEmployee,
        toggleEmployeeStatus,

        checkInEmployee,
        checkOutEmployee,
        markEmployeeAttendance,
        updateAttendanceRecord,

        submitLeaveRequest,
        approveLeaveRequest,
        rejectLeaveRequest,
        cancelLeaveRequest,

        submitRegularizationRequest,
        approveRegularizationRequest,
        rejectRegularizationRequest,

        createShift,
        updateShift,
        deleteShift,
        assignShiftToEmployee,

        addDepartment,
        updateDepartment,
        addBranch,
        updateBranch,

        updateSettings,
        markNotificationsAsRead,
        addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

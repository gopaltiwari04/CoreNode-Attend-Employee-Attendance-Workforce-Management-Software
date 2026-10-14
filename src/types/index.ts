export type UserRole = 'admin' | 'hr' | 'branch_manager' | 'employee';

export type EmploymentType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern';
export type EmploymentStatus = 'Active' | 'Inactive';

export type AttendanceStatus =
  | 'Present'
  | 'Late'
  | 'Absent'
  | 'Half Day'
  | 'On Leave'
  | 'Not Checked In'
  | 'Checked Out';

export type LeaveType = 'Casual Leave' | 'Sick Leave' | 'Earned Leave' | 'Unpaid Leave' | 'Other';
export type RequestStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  managerName: string;
  status: 'Active' | 'Inactive';
}

export interface Department {
  id: string;
  name: string;
  code: string;
  managerName: string;
  status: 'Active' | 'Inactive';
}

export interface Shift {
  id: string;
  name: string;
  startTime: string; // 24-hr format "09:00"
  endTime: string;   // 24-hr format "17:00"
  breakMinutes: number;
  graceMinutes: number;
  weeklyOffDays: number[]; // 0 = Sunday, 1 = Monday, etc.
  color: string;
  isOvernight?: boolean;
}

export interface LeaveBalance {
  casual: number;
  sick: number;
  earned: number;
}

export interface Employee {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  designation: string;
  departmentId: string;
  branchId: string;
  employmentType: EmploymentType;
  joiningDate: string; // YYYY-MM-DD
  shiftId: string;
  reportingManager: string;
  salary: number; // Monthly INR
  emergencyContact?: string;
  status: EmploymentStatus;
  leaveBalance: LeaveBalance;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  checkIn?: string; // HH:mm:ss or HH:mm
  checkOut?: string; // HH:mm:ss or HH:mm
  shiftId: string;
  status: AttendanceStatus;
  workingHours: number; // in hours, e.g. 7.5
  breakMinutes: number;
  note?: string;
  isRegularized?: boolean;
  branchId: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  daysCount: number;
  reason: string;
  submissionDate: string; // YYYY-MM-DD
  status: RequestStatus;
  reviewer?: string;
  reviewerComment?: string;
  attachmentName?: string;
}

export interface AttendanceCorrectionRequest {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  currentCheckIn?: string;
  currentCheckOut?: string;
  requestedCheckIn: string;
  requestedCheckOut: string;
  reason: string;
  status: RequestStatus;
  reviewer?: string;
  reviewerComment?: string;
  createdAt: string; // YYYY-MM-DD HH:mm
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: string;
  read: boolean;
  targetTab?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  actor: string;
  timestamp: string;
  type: 'attendance' | 'employee' | 'leave' | 'shift' | 'regularization' | 'settings';
}

export interface AttendancePolicy {
  defaultGraceMinutes: number;
  halfDayThresholdHours: number;
  fullDayThresholdHours: number;
  unpaidBreakMinutes: number;
  weeklyOffDays: number[];
  allowSelfCheckIn: boolean;
  strictCheckOut: boolean;
}

export interface OrganizationSettings {
  name: string;
  tagline: string;
  industry: string;
  phone: string;
  email: string;
  address: string;
  timezone: string;
  currency: string;
  policy: AttendancePolicy;
}

export type ActiveTab =
  | 'overview'
  | 'live-attendance'
  | 'employees'
  | 'shifts'
  | 'leaves'
  | 'regularization'
  | 'reports'
  | 'payroll'
  | 'organization'
  | 'settings'
  | 'self-service';

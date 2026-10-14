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
} from '../types';
import { getTodayDateString } from '../utils/formatters';

export const initialBranches: Branch[] = [
  {
    id: 'BR-MAIN',
    name: 'Main Branch — Indiranagar',
    code: 'UB-IND',
    address: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
    phone: '+91 80 4123 4567',
    managerName: 'Aarav Sharma',
    status: 'Active',
  },
  {
    id: 'BR-02',
    name: 'Urban Brew Café — Branch 2 (Koramangala)',
    code: 'UB-KOR',
    address: '80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034',
    phone: '+91 80 4987 6543',
    managerName: 'Ananya Singh',
    status: 'Active',
  },
];

export const initialDepartments: Department[] = [
  { id: 'DEP-OPS', name: 'Operations', code: 'OPS', managerName: 'Rahul Mehta', status: 'Active' },
  { id: 'DEP-KIT', name: 'Kitchen & Bakery', code: 'KIT', managerName: 'Rohan Gupta', status: 'Active' },
  { id: 'DEP-SRV', name: 'Service & Front of House', code: 'SRV', managerName: 'Aarav Sharma', status: 'Active' },
  { id: 'DEP-SLS', name: 'Sales & Events', code: 'SLS', managerName: 'Ananya Singh', status: 'Active' },
  { id: 'DEP-ADM', name: 'Administration', code: 'ADM', managerName: 'Priya Verma', status: 'Active' },
  { id: 'DEP-HR', name: 'Human Resources', code: 'HR', managerName: 'Pooja Iyer', status: 'Active' },
];

export const initialShifts: Shift[] = [
  {
    id: 'SH-MORN',
    name: 'Morning Shift',
    startTime: '09:00',
    endTime: '17:00',
    breakMinutes: 60,
    graceMinutes: 15,
    weeklyOffDays: [0], // Sunday
    color: '#0284c7', // Sky
  },
  {
    id: 'SH-GEN',
    name: 'General Shift',
    startTime: '10:00',
    endTime: '18:00',
    breakMinutes: 60,
    graceMinutes: 15,
    weeklyOffDays: [0], // Sunday
    color: '#0f766e', // Teal
  },
  {
    id: 'SH-EVE',
    name: 'Evening Shift',
    startTime: '14:00',
    endTime: '22:00',
    breakMinutes: 45,
    graceMinutes: 15,
    weeklyOffDays: [1], // Monday
    color: '#d97706', // Amber
  },
  {
    id: 'SH-NGT',
    name: 'Night Shift',
    startTime: '22:00',
    endTime: '06:00',
    breakMinutes: 60,
    graceMinutes: 15,
    weeklyOffDays: [2], // Tuesday
    color: '#4f46e5', // Indigo
    isOvernight: true,
  },
];

export const initialEmployees: Employee[] = [
  {
    id: 'EMP001',
    name: 'Aarav Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'aarav.sharma@urbanbrew.in',
    phone: '+91 98450 11201',
    designation: 'Floor & Service Manager',
    departmentId: 'DEP-SRV',
    branchId: 'BR-MAIN',
    employmentType: 'Full-Time',
    joiningDate: '2023-04-10',
    shiftId: 'SH-MORN',
    reportingManager: 'Store Director',
    salary: 48000,
    emergencyContact: '+91 98450 99881 (Spouse)',
    status: 'Active',
    leaveBalance: { casual: 6, sick: 4, earned: 12 },
  },
  {
    id: 'EMP002',
    name: 'Priya Verma',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    email: 'priya.verma@urbanbrew.in',
    phone: '+91 98450 22302',
    designation: 'Office Administrator',
    departmentId: 'DEP-ADM',
    branchId: 'BR-MAIN',
    employmentType: 'Full-Time',
    joiningDate: '2022-11-15',
    shiftId: 'SH-GEN',
    reportingManager: 'Business Owner',
    salary: 42000,
    emergencyContact: '+91 98450 88772 (Parent)',
    status: 'Active',
    leaveBalance: { casual: 4, sick: 5, earned: 14 },
  },
  {
    id: 'EMP003',
    name: 'Rohan Gupta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'rohan.gupta@urbanbrew.in',
    phone: '+91 98450 33403',
    designation: 'Head Chef & Baker',
    departmentId: 'DEP-KIT',
    branchId: 'BR-MAIN',
    employmentType: 'Full-Time',
    joiningDate: '2022-06-01',
    shiftId: 'SH-MORN',
    reportingManager: 'Store Director',
    salary: 55000,
    emergencyContact: '+91 98450 77663 (Brother)',
    status: 'Active',
    leaveBalance: { casual: 5, sick: 3, earned: 9 },
  },
  {
    id: 'EMP004',
    name: 'Ananya Singh',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    email: 'ananya.singh@urbanbrew.in',
    phone: '+91 98450 44504',
    designation: 'Branch & Events Manager',
    departmentId: 'DEP-SLS',
    branchId: 'BR-02',
    employmentType: 'Full-Time',
    joiningDate: '2023-01-20',
    shiftId: 'SH-GEN',
    reportingManager: 'Business Owner',
    salary: 52000,
    emergencyContact: '+91 98450 66554 (Sister)',
    status: 'Active',
    leaveBalance: { casual: 7, sick: 6, earned: 15 },
  },
  {
    id: 'EMP005',
    name: 'Rahul Mehta',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'rahul.mehta@urbanbrew.in',
    phone: '+91 98450 55605',
    designation: 'Operations Lead',
    departmentId: 'DEP-OPS',
    branchId: 'BR-02',
    employmentType: 'Full-Time',
    joiningDate: '2023-08-01',
    shiftId: 'SH-EVE',
    reportingManager: 'Ananya Singh',
    salary: 40000,
    emergencyContact: '+91 98450 55445 (Father)',
    status: 'Active',
    leaveBalance: { casual: 3, sick: 4, earned: 8 },
  },
  {
    id: 'EMP006',
    name: 'Neha Patel',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    email: 'neha.patel@urbanbrew.in',
    phone: '+91 98450 66706',
    designation: 'Senior Barista & Trainer',
    departmentId: 'DEP-SRV',
    branchId: 'BR-MAIN',
    employmentType: 'Full-Time',
    joiningDate: '2023-05-15',
    shiftId: 'SH-MORN',
    reportingManager: 'Aarav Sharma',
    salary: 28000,
    status: 'Active',
    leaveBalance: { casual: 5, sick: 5, earned: 10 },
  },
  {
    id: 'EMP007',
    name: 'Vikramaditya Rao',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    email: 'vikram.rao@urbanbrew.in',
    phone: '+91 98450 77807',
    designation: 'Inventory & Supply Associate',
    departmentId: 'DEP-OPS',
    branchId: 'BR-MAIN',
    employmentType: 'Full-Time',
    joiningDate: '2023-09-10',
    shiftId: 'SH-MORN',
    reportingManager: 'Rahul Mehta',
    salary: 26000,
    status: 'Active',
    leaveBalance: { casual: 6, sick: 6, earned: 11 },
  },
  {
    id: 'EMP008',
    name: 'Pooja Iyer',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    email: 'pooja.iyer@urbanbrew.in',
    phone: '+91 98450 88908',
    designation: 'HR Executive',
    departmentId: 'DEP-HR',
    branchId: 'BR-MAIN',
    employmentType: 'Full-Time',
    joiningDate: '2023-02-12',
    shiftId: 'SH-GEN',
    reportingManager: 'Priya Verma',
    salary: 38000,
    status: 'Active',
    leaveBalance: { casual: 8, sick: 5, earned: 13 },
  },
  {
    id: 'EMP009',
    name: 'Rajesh Nair',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    email: 'rajesh.nair@urbanbrew.in',
    phone: '+91 98450 99009',
    designation: 'Sous Chef (Bakery)',
    departmentId: 'DEP-KIT',
    branchId: 'BR-MAIN',
    employmentType: 'Full-Time',
    joiningDate: '2023-07-18',
    shiftId: 'SH-MORN',
    reportingManager: 'Rohan Gupta',
    salary: 32000,
    status: 'Active',
    leaveBalance: { casual: 4, sick: 2, earned: 7 },
  },
  {
    id: 'EMP010',
    name: 'Simran Kaur',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    email: 'simran.kaur@urbanbrew.in',
    phone: '+91 98451 10110',
    designation: 'Customer Experience Lead',
    departmentId: 'DEP-SRV',
    branchId: 'BR-02',
    employmentType: 'Full-Time',
    joiningDate: '2024-01-08',
    shiftId: 'SH-EVE',
    reportingManager: 'Ananya Singh',
    salary: 31000,
    status: 'Active',
    leaveBalance: { casual: 7, sick: 6, earned: 8 },
  },
  {
    id: 'EMP011',
    name: 'Amit Joshi',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    email: 'amit.joshi@urbanbrew.in',
    phone: '+91 98451 21211',
    designation: 'Night Security & Prep Lead',
    departmentId: 'DEP-OPS',
    branchId: 'BR-MAIN',
    employmentType: 'Full-Time',
    joiningDate: '2023-10-01',
    shiftId: 'SH-NGT',
    reportingManager: 'Aarav Sharma',
    salary: 24000,
    status: 'Active',
    leaveBalance: { casual: 6, sick: 4, earned: 9 },
  },
  {
    id: 'EMP012',
    name: 'Divya Reddy',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    email: 'divya.reddy@urbanbrew.in',
    phone: '+91 98451 32312',
    designation: 'Pastry Chef',
    departmentId: 'DEP-KIT',
    branchId: 'BR-02',
    employmentType: 'Full-Time',
    joiningDate: '2024-02-15',
    shiftId: 'SH-MORN',
    reportingManager: 'Rohan Gupta',
    salary: 34000,
    status: 'Active',
    leaveBalance: { casual: 5, sick: 5, earned: 6 },
  },
  {
    id: 'EMP013',
    name: 'Karthik Sundaram',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    email: 'karthik.sundaram@urbanbrew.in',
    phone: '+91 98451 43413',
    designation: 'Barista',
    departmentId: 'DEP-SRV',
    branchId: 'BR-02',
    employmentType: 'Part-Time',
    joiningDate: '2024-03-01',
    shiftId: 'SH-EVE',
    reportingManager: 'Simran Kaur',
    salary: 19000,
    status: 'Active',
    leaveBalance: { casual: 3, sick: 3, earned: 4 },
  },
  {
    id: 'EMP014',
    name: 'Meera Nambiar',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    email: 'meera.nambiar@urbanbrew.in',
    phone: '+91 98451 54514',
    designation: 'Accountant & Billing Specialist',
    departmentId: 'DEP-ADM',
    branchId: 'BR-02',
    employmentType: 'Full-Time',
    joiningDate: '2023-06-25',
    shiftId: 'SH-GEN',
    reportingManager: 'Priya Verma',
    salary: 36000,
    status: 'Active',
    leaveBalance: { casual: 7, sick: 4, earned: 12 },
  },
  {
    id: 'EMP015',
    name: 'Suresh Pillai',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    email: 'suresh.pillai@urbanbrew.in',
    phone: '+91 98451 65615',
    designation: 'Kitchen Steward',
    departmentId: 'DEP-KIT',
    branchId: 'BR-MAIN',
    employmentType: 'Full-Time',
    joiningDate: '2023-11-20',
    shiftId: 'SH-EVE',
    reportingManager: 'Rohan Gupta',
    salary: 22000,
    status: 'Active',
    leaveBalance: { casual: 4, sick: 5, earned: 8 },
  },
  {
    id: 'EMP016',
    name: 'Tanvi Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?w=150&auto=format&fit=crop&q=80',
    email: 'tanvi.deshmukh@urbanbrew.in',
    phone: '+91 98451 76716',
    designation: 'Marketing & Social Media Specialist',
    departmentId: 'DEP-SLS',
    branchId: 'BR-MAIN',
    employmentType: 'Full-Time',
    joiningDate: '2024-04-01',
    shiftId: 'SH-GEN',
    reportingManager: 'Ananya Singh',
    salary: 35000,
    status: 'Active',
    leaveBalance: { casual: 6, sick: 4, earned: 5 },
  },
  {
    id: 'EMP017',
    name: 'Kunal Kapoor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    email: 'kunal.kapoor@urbanbrew.in',
    phone: '+91 98451 87817',
    designation: 'Front Desk Host',
    departmentId: 'DEP-SRV',
    branchId: 'BR-MAIN',
    employmentType: 'Contract',
    joiningDate: '2024-05-10',
    shiftId: 'SH-MORN',
    reportingManager: 'Aarav Sharma',
    salary: 22000,
    status: 'Active',
    leaveBalance: { casual: 4, sick: 2, earned: 3 },
  },
  {
    id: 'EMP018',
    name: 'Shalini Bannerjee',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    email: 'shalini.b@urbanbrew.in',
    phone: '+91 98451 98918',
    designation: 'Line Cook & Griller',
    departmentId: 'DEP-KIT',
    branchId: 'BR-02',
    employmentType: 'Full-Time',
    joiningDate: '2024-03-15',
    shiftId: 'SH-EVE',
    reportingManager: 'Rohan Gupta',
    salary: 26000,
    status: 'Active',
    leaveBalance: { casual: 5, sick: 4, earned: 6 },
  },
  {
    id: 'EMP019',
    name: 'Deepa Agarwal',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80',
    email: 'deepa.agarwal@urbanbrew.in',
    phone: '+91 98452 09019',
    designation: 'Operations Assistant',
    departmentId: 'DEP-OPS',
    branchId: 'BR-02',
    employmentType: 'Intern',
    joiningDate: '2024-08-01',
    shiftId: 'SH-GEN',
    reportingManager: 'Rahul Mehta',
    salary: 15000,
    status: 'Active',
    leaveBalance: { casual: 2, sick: 2, earned: 2 },
  },
  {
    id: 'EMP020',
    name: 'Manoj Tiwari',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    email: 'manoj.tiwari@urbanbrew.in',
    phone: '+91 98452 10120',
    designation: 'Night Dispatcher',
    departmentId: 'DEP-OPS',
    branchId: 'BR-02',
    employmentType: 'Full-Time',
    joiningDate: '2023-12-05',
    shiftId: 'SH-NGT',
    reportingManager: 'Rahul Mehta',
    salary: 25000,
    status: 'Active',
    leaveBalance: { casual: 6, sick: 5, earned: 9 },
  },
  {
    id: 'EMP021',
    name: 'Varun Chawla',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    email: 'varun.chawla@urbanbrew.in',
    phone: '+91 98452 21221',
    designation: 'Barista Apprentice',
    departmentId: 'DEP-SRV',
    branchId: 'BR-MAIN',
    employmentType: 'Intern',
    joiningDate: '2024-09-01',
    shiftId: 'SH-MORN',
    reportingManager: 'Neha Patel',
    salary: 16000,
    status: 'Active',
    leaveBalance: { casual: 2, sick: 1, earned: 1 },
  },
  {
    id: 'EMP022',
    name: 'Arjun Das',
    avatar: 'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?w=150&auto=format&fit=crop&q=80',
    email: 'arjun.das@urbanbrew.in',
    phone: '+91 98452 32322',
    designation: 'Floor Captain (Former)',
    departmentId: 'DEP-SRV',
    branchId: 'BR-02',
    employmentType: 'Full-Time',
    joiningDate: '2022-08-10',
    shiftId: 'SH-MORN',
    reportingManager: 'Ananya Singh',
    salary: 29000,
    status: 'Inactive',
    leaveBalance: { casual: 0, sick: 0, earned: 0 },
  },
];

// Helper to generate 30 days of past attendance records
function generateHistoricalAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  const todayStr = getTodayDateString();

  // Active employees only for attendance records
  const activeEmps = initialEmployees.filter(e => e.status === 'Active');

  // Let's generate past 30 days (1 to 30 days ago)
  for (let d = 30; d >= 1; d--) {
    const targetDate = new Date();
    targetDate.setDate(today.getDate() - d);
    const dayOfWeek = targetDate.getDay(); // 0 is Sunday
    const dateStr = targetDate.toISOString().split('T')[0];

    // Seed per employee
    activeEmps.forEach((emp, index) => {
      // Check if weekly off for shift
      const shift = initialShifts.find(s => s.id === emp.shiftId) || initialShifts[0];
      const isOff = shift.weeklyOffDays.includes(dayOfWeek);

      if (isOff) {
        // No record or weekly off day
        return;
      }

      // Simulate realistic attendance profile:
      // Index mod 17 == 0 -> Leave
      // Index mod 11 == 0 -> Absent
      // Index mod 7 == 0 -> Late
      // Index mod 9 == 0 -> Half Day
      // Else -> Present
      const hash = (index * 7 + d * 13) % 100;

      let status: AttendanceRecord['status'] = 'Present';
      let checkIn: string | undefined = undefined;
      let checkOut: string | undefined = undefined;
      let workingHours = 7.5;
      let breakMinutes = shift.breakMinutes;

      if (hash < 6) {
        // On Leave
        status = 'On Leave';
        workingHours = 0;
      } else if (hash < 12) {
        // Absent
        status = 'Absent';
        workingHours = 0;
      } else if (hash < 25) {
        // Late arrival
        status = 'Late';
        const [shH, shM] = shift.startTime.split(':').map(Number);
        const lateMinutes = 20 + ((hash * 3) % 40);
        const lateHour = shH + Math.floor((shM + lateMinutes) / 60);
        const lateMin = (shM + lateMinutes) % 60;
        checkIn = `${String(lateHour).padStart(2, '0')}:${String(lateMin).padStart(2, '0')}`;
        checkOut = shift.endTime;
        workingHours = 6.8;
      } else if (hash < 32) {
        // Half Day
        status = 'Half Day';
        checkIn = shift.startTime;
        const [shH] = shift.startTime.split(':').map(Number);
        checkOut = `${String(shH + 4).padStart(2, '0')}:00`;
        workingHours = 4.0;
        breakMinutes = 15;
      } else {
        // Present on time
        status = 'Present';
        const [shH, shM] = shift.startTime.split(':').map(Number);
        // Arrived 5-10 mins early
        const earlyMin = Math.max(0, shM - 5);
        checkIn = `${String(shH).padStart(2, '0')}:${String(earlyMin).padStart(2, '0')}`;
        checkOut = shift.endTime;
        workingHours = 7.5;
      }

      records.push({
        id: `ATT-HIST-${d}-${emp.id}`,
        employeeId: emp.id,
        date: dateStr,
        checkIn,
        checkOut,
        shiftId: emp.shiftId,
        status,
        workingHours,
        breakMinutes,
        branchId: emp.branchId,
      });
    });
  }

  // Now seed TODAY's attendance records (live state for 14 Oct 2026)
  // Let's create realistic varied states:
  // - Checked In (Present and currently working)
  // - Late Check In (Checked in late, currently working)
  // - Checked Out (Completed morning shift)
  // - Absent
  // - On Leave
  // - Not Checked In (Evening/Night shift employees who haven't started yet)
  const todayProfiles: { empId: string; status: AttendanceRecord['status']; checkIn?: string; checkOut?: string; hours: number }[] = [
    { empId: 'EMP001', status: 'Present', checkIn: '08:52', hours: 3.8 },
    { empId: 'EMP002', status: 'Present', checkIn: '09:55', hours: 2.7 },
    { empId: 'EMP003', status: 'Present', checkIn: '08:45', hours: 3.9 },
    { empId: 'EMP004', status: 'Present', checkIn: '09:50', hours: 2.8 },
    { empId: 'EMP005', status: 'Not Checked In', hours: 0 }, // Evening shift 14:00
    { empId: 'EMP006', status: 'Late', checkIn: '09:35', hours: 3.1 }, // Late! Morning starts 09:00, grace 15m
    { empId: 'EMP007', status: 'Present', checkIn: '08:58', hours: 3.7 },
    { empId: 'EMP008', status: 'Present', checkIn: '09:58', hours: 2.7 },
    { empId: 'EMP009', status: 'Checked Out', checkIn: '06:00', checkOut: '12:30', hours: 6.0 }, // Early baker shift
    { empId: 'EMP010', status: 'Not Checked In', hours: 0 }, // Evening shift
    { empId: 'EMP011', status: 'Not Checked In', hours: 0 }, // Night shift
    { empId: 'EMP012', status: 'On Leave', hours: 0 }, // On approved leave
    { empId: 'EMP013', status: 'Not Checked In', hours: 0 }, // Evening shift
    { empId: 'EMP014', status: 'Present', checkIn: '09:54', hours: 2.8 },
    { empId: 'EMP015', status: 'Not Checked In', hours: 0 }, // Evening shift
    { empId: 'EMP016', status: 'Late', checkIn: '10:32', hours: 2.1 }, // Late General shift
    { empId: 'EMP017', status: 'Present', checkIn: '08:50', hours: 3.8 },
    { empId: 'EMP018', status: 'Absent', hours: 0 }, // Unexcused absence
    { empId: 'EMP019', status: 'Present', checkIn: '09:48', hours: 2.9 },
    { empId: 'EMP020', status: 'Not Checked In', hours: 0 }, // Night shift
    { empId: 'EMP021', status: 'Present', checkIn: '09:02', hours: 3.6 },
  ];

  todayProfiles.forEach(p => {
    const emp = initialEmployees.find(e => e.id === p.empId);
    if (!emp) return;
    records.push({
      id: `ATT-TODAY-${p.empId}`,
      employeeId: p.empId,
      date: todayStr,
      checkIn: p.checkIn,
      checkOut: p.checkOut,
      shiftId: emp.shiftId,
      status: p.status,
      workingHours: p.hours,
      breakMinutes: 0,
      branchId: emp.branchId,
    });
  });

  return records;
}

export const initialAttendanceRecords: AttendanceRecord[] = generateHistoricalAttendance();

export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'LR-001',
    employeeId: 'EMP012',
    leaveType: 'Earned Leave',
    startDate: '2026-10-14',
    endDate: '2026-10-16',
    daysCount: 3,
    reason: 'Family ceremony in Mysore. All pastry baking preparations handed over to Rohan.',
    submissionDate: '2026-10-10',
    status: 'Approved',
    reviewer: 'Priya Verma (HR)',
    reviewerComment: 'Approved. Advance roster adjusted with Chef Rohan.',
  },
  {
    id: 'LR-002',
    employeeId: 'EMP006',
    leaveType: 'Casual Leave',
    startDate: '2026-10-18',
    endDate: '2026-10-19',
    daysCount: 2,
    reason: 'Personal family engagement and bank work.',
    submissionDate: '2026-10-13',
    status: 'Pending',
    attachmentName: 'bank_appointment_slip.pdf',
  },
  {
    id: 'LR-003',
    employeeId: 'EMP015',
    leaveType: 'Sick Leave',
    startDate: '2026-10-15',
    endDate: '2026-10-15',
    daysCount: 1,
    reason: 'Doctor appointment for routine allergy checkup.',
    submissionDate: '2026-10-14',
    status: 'Pending',
  },
  {
    id: 'LR-004',
    employeeId: 'EMP005',
    leaveType: 'Casual Leave',
    startDate: '2026-10-02',
    endDate: '2026-10-03',
    daysCount: 2,
    reason: 'Festival weekend trip to hometown.',
    submissionDate: '2026-09-28',
    status: 'Approved',
    reviewer: 'Ananya Singh',
    reviewerComment: 'Approved as coverage was arranged.',
  },
  {
    id: 'LR-005',
    employeeId: 'EMP013',
    leaveType: 'Earned Leave',
    startDate: '2026-10-05',
    endDate: '2026-10-08',
    daysCount: 4,
    reason: 'College semester exams preparation.',
    submissionDate: '2026-10-01',
    status: 'Rejected',
    reviewer: 'Ananya Singh',
    reviewerComment: 'Insufficient leave balance; kindly apply under unpaid student leave policy.',
  },
];

export const initialRegularizationRequests: AttendanceCorrectionRequest[] = [
  {
    id: 'REG-001',
    employeeId: 'EMP001',
    date: '2026-10-13',
    currentCheckIn: '10:15',
    currentCheckOut: '17:10',
    requestedCheckIn: '08:55',
    requestedCheckOut: '17:10',
    reason: 'Biometric tablet offline during morning rush; manual check-in recorded late.',
    status: 'Pending',
    createdAt: '2026-10-13 18:30',
  },
  {
    id: 'REG-002',
    employeeId: 'EMP007',
    date: '2026-10-12',
    currentCheckIn: '09:00',
    currentCheckOut: undefined,
    requestedCheckIn: '09:00',
    requestedCheckOut: '17:15',
    reason: 'Forgot to tap checkout while attending vendor delivery truck at back gate.',
    status: 'Pending',
    createdAt: '2026-10-13 09:10',
  },
  {
    id: 'REG-003',
    employeeId: 'EMP003',
    date: '2026-10-09',
    currentCheckIn: '09:45',
    currentCheckOut: '17:30',
    requestedCheckIn: '08:50',
    requestedCheckOut: '17:30',
    reason: 'Emergency ingredient purchase at wholesale market prior to opening.',
    status: 'Approved',
    reviewer: 'Priya Verma',
    reviewerComment: 'Verified with wholesale receipt slip.',
    createdAt: '2026-10-09 18:00',
  },
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'NOTIF-001',
    title: 'Late Arrival Alert',
    message: 'Neha Patel checked in at 09:35 AM (Shift began at 09:00 AM).',
    type: 'warning',
    timestamp: '14 Oct 2026, 09:36 AM',
    read: false,
    targetTab: 'live-attendance',
  },
  {
    id: 'NOTIF-002',
    title: 'New Leave Request',
    message: 'Neha Patel submitted a Casual Leave request for 2 days (18-19 Oct).',
    type: 'info',
    timestamp: '14 Oct 2026, 09:40 AM',
    read: false,
    targetTab: 'leaves',
  },
  {
    id: 'NOTIF-003',
    title: 'Regularization Awaiting Review',
    message: 'Aarav Sharma requested check-in correction for 13 Oct (08:55 AM).',
    type: 'info',
    timestamp: '13 Oct 2026, 06:35 PM',
    read: false,
    targetTab: 'regularization',
  },
  {
    id: 'NOTIF-004',
    title: 'Check-In Recorded',
    message: 'Aarav Sharma checked in at 08:52 AM at Main Branch.',
    type: 'success',
    timestamp: '14 Oct 2026, 08:52 AM',
    read: true,
    targetTab: 'live-attendance',
  },
];

export const initialActivityLogs: ActivityLog[] = [
  {
    id: 'LOG-001',
    action: 'Attendance Check-In',
    details: 'Aarav Sharma marked check-in at 08:52 AM',
    actor: 'Aarav Sharma',
    timestamp: '14 Oct 2026, 08:52 AM',
    type: 'attendance',
  },
  {
    id: 'LOG-002',
    action: 'Late Check-In',
    details: 'Neha Patel marked check-in at 09:35 AM (Late by 20 mins after grace)',
    actor: 'System',
    timestamp: '14 Oct 2026, 09:35 AM',
    type: 'attendance',
  },
  {
    id: 'LOG-003',
    action: 'Leave Request Created',
    details: 'Neha Patel applied for 2 days Casual Leave (18-19 Oct)',
    actor: 'Neha Patel',
    timestamp: '14 Oct 2026, 09:40 AM',
    type: 'leave',
  },
  {
    id: 'LOG-004',
    action: 'Shift Roster Updated',
    details: 'Karthik Sundaram assigned to Evening Shift (14:00 - 22:00)',
    actor: 'Ananya Singh',
    timestamp: '13 Oct 2026, 04:15 PM',
    type: 'shift',
  },
  {
    id: 'LOG-005',
    action: 'Regularization Approved',
    details: 'Chef Rohan Gupta check-in corrected for 09 Oct (08:50 AM)',
    actor: 'Priya Verma',
    timestamp: '10 Oct 2026, 11:30 AM',
    type: 'regularization',
  },
];

export const initialOrganizationSettings: OrganizationSettings = {
  name: 'Urban Brew Café',
  tagline: 'Smart Attendance. Simplified Workforce.',
  industry: 'Food & Beverage / Specialty Café',
  phone: '+91 80 4123 4567',
  email: 'admin@urbanbrew.in',
  address: 'Indiranagar & Koramangala, Bengaluru, Karnataka, India',
  timezone: 'Asia/Kolkata (IST)',
  currency: 'INR (₹)',
  policy: {
    defaultGraceMinutes: 15,
    halfDayThresholdHours: 4.0,
    fullDayThresholdHours: 7.5,
    unpaidBreakMinutes: 60,
    weeklyOffDays: [0], // Sunday
    allowSelfCheckIn: true,
    strictCheckOut: true,
  },
};

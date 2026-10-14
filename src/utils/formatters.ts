/**
 * Formatting and business logic utility functions
 * Following India conventions: DD MMM YYYY, 12h AM/PM, INR (₹)
 */

export function formatDateIndian(dateStrOrObj: string | Date | undefined): string {
  if (!dateStrOrObj) return '-';
  const d = typeof dateStrOrObj === 'string' ? new Date(dateStrOrObj + 'T00:00:00') : dateStrOrObj;
  if (isNaN(d.getTime())) return String(dateStrOrObj);
  
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function formatTime12h(timeStr: string | undefined): string {
  if (!timeStr) return '-';
  // Handles "09:30", "09:30:00", or ISO strings
  const parts = timeStr.includes('T') ? timeStr.split('T')[1].split(':') : timeStr.split(':');
  if (parts.length < 2) return timeStr;

  const hours = parseInt(parts[0], 10);
  const minutes = parts[1].padStart(2, '0');
  if (isNaN(hours)) return timeStr;

  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  return `${String(formattedHours).padStart(2, '0')}:${minutes} ${ampm}`;
}

export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentTimeString(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Calculates working hours between check-in and check-out minus break
 */
export function calculateWorkingHours(
  checkIn: string | undefined,
  checkOut: string | undefined,
  breakMinutes: number = 0
): number {
  if (!checkIn || !checkOut) return 0;

  const [inH, inM] = checkIn.split(':').map(Number);
  const [outH, outM] = checkOut.split(':').map(Number);

  if (isNaN(inH) || isNaN(inM) || isNaN(outH) || isNaN(outM)) return 0;

  let inTotalMinutes = inH * 60 + inM;
  let outTotalMinutes = outH * 60 + outM;

  // Handle overnight shift if checkout is earlier in the clock
  if (outTotalMinutes < inTotalMinutes) {
    outTotalMinutes += 24 * 60;
  }

  const grossMinutes = outTotalMinutes - inTotalMinutes;
  const netMinutes = Math.max(0, grossMinutes - breakMinutes);
  return Number((netMinutes / 60).toFixed(2));
}

/**
 * Checks whether an employee is Late based on shift start time + grace period
 */
export function isLateCheckIn(
  checkIn: string,
  shiftStartTime: string,
  graceMinutes: number = 15
): boolean {
  if (!checkIn || !shiftStartTime) return false;

  const [inH, inM] = checkIn.split(':').map(Number);
  const [shiftH, shiftM] = shiftStartTime.split(':').map(Number);

  if (isNaN(inH) || isNaN(inM) || isNaN(shiftH) || isNaN(shiftM)) return false;

  const inTotalMinutes = inH * 60 + inM;
  const shiftThresholdMinutes = shiftH * 60 + shiftM + graceMinutes;

  return inTotalMinutes > shiftThresholdMinutes;
}

/**
 * Generates and triggers download of a CSV file in the browser
 */
export function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const sanitize = (val: string | number) => {
    const str = String(val ?? '').replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = [
    headers.map(sanitize).join(','),
    ...rows.map(row => row.map(sanitize).join(',')),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Native Print view trigger
 */
export function printCurrentView() {
  window.print();
}

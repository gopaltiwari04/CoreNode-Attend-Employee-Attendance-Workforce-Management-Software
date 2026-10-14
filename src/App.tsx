import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { GuidedDemoBanner } from './components/common/GuidedDemoBanner';
import { HardwareIntegrationModal } from './components/common/HardwareIntegrationModal';
import { LoginScreen } from './components/auth/LoginScreen';

// Modules
import { OverviewModule } from './components/overview/OverviewModule';
import { LiveAttendanceModule } from './components/attendance/LiveAttendanceModule';
import { EmployeesModule } from './components/employees/EmployeesModule';
import { ShiftsModule } from './components/shifts/ShiftsModule';
import { LeaveManagementModule } from './components/leaves/LeaveManagementModule';
import { RegularizationModule } from './components/regularization/RegularizationModule';
import { ReportsModule } from './components/reports/ReportsModule';
import { PayrollModule } from './components/payroll/PayrollModule';
import { LocationsDepartmentsModule } from './components/organization/LocationsDepartmentsModule';
import { SettingsModule } from './components/settings/SettingsModule';
import { EmployeeSelfService } from './components/selfservice/EmployeeSelfService';

import { ChevronRight, Home } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isLoggedIn, activeTab, setActiveTab, currentRole } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  const getBreadcrumbLabel = () => {
    switch (activeTab) {
      case 'overview':
        return 'Overview Dashboard';
      case 'live-attendance':
        return 'Live Attendance & Punches';
      case 'employees':
        return 'Employee Directory';
      case 'shifts':
        return 'Shifts & Rosters';
      case 'leaves':
        return 'Leave Management';
      case 'regularization':
        return 'Attendance Regularization';
      case 'reports':
        return 'Reports & Analytics';
      case 'payroll':
        return 'Payroll Preparation';
      case 'organization':
        return 'Locations & Departments';
      case 'settings':
        return 'Settings & Policies';
      case 'self-service':
        return 'Employee Self-Service Portal';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Interactive Guided Tour Bar */}
      <GuidedDemoBanner />

      <div className="flex-1 flex w-full">
        {/* Left Sidebar */}
        <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

        {/* Right Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header onMobileMenuToggle={() => setMobileMenuOpen(true)} />

          {/* Breadcrumbs bar on internal pages */}
          {activeTab !== 'overview' && (
            <div className="px-4 sm:px-6 pt-4 pb-1 text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <button
                onClick={() => setActiveTab('overview')}
                className="hover:text-indigo-600 flex items-center gap-1 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-800 font-semibold">{getBreadcrumbLabel()}</span>
            </div>
          )}

          {/* Main Module View */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {activeTab === 'overview' && <OverviewModule />}
            {activeTab === 'live-attendance' && <LiveAttendanceModule />}
            {activeTab === 'employees' && <EmployeesModule />}
            {activeTab === 'shifts' && <ShiftsModule />}
            {activeTab === 'leaves' && <LeaveManagementModule />}
            {activeTab === 'regularization' && <RegularizationModule />}
            {activeTab === 'reports' && <ReportsModule />}
            {activeTab === 'payroll' && <PayrollModule />}
            {activeTab === 'organization' && <LocationsDepartmentsModule />}
            {activeTab === 'settings' && <SettingsModule />}
            {activeTab === 'self-service' && <EmployeeSelfService />}
          </main>
        </div>
      </div>

      {/* Global Toast Feedback & Hardware Modals */}
      <ToastContainer />
      <HardwareIntegrationModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

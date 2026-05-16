import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

import TeacherHome from './TeacherHome';
import TeacherAttendance from './TeacherAttendance';
import TeacherHonor from './TeacherHonor';
import TeacherLessons from './TeacherLessons';

const navItems = [
  { path: '', icon: 'fas fa-tachometer-alt', label: 'معلومات عامة' },
  { path: 'attendance', icon: 'fas fa-clipboard-check', label: 'الحضور والغياب' },
  { path: 'honor', icon: 'fas fa-award', label: 'الشرف الأسبوعي' },
  { path: 'lessons', icon: 'fas fa-book-open', label: 'خطة الدروس' },
];

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const { dark, toggleDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentPath = location.pathname.replace('/teacher/', '').replace('/teacher', '');
  const handleLogout = () => { logout(); navigate('/'); };
  const closeMobile = () => setMobileOpen(false);

  const SidebarContent = ({ mobile = false }) => (
    <>
      <Link
        to="/"
        onClick={mobile ? closeMobile : undefined}
        className="p-4 flex items-center gap-3 border-b border-primary-700 dark:border-primary-800 hover:bg-primary-700 dark:hover:bg-primary-900/80 transition-colors group"
        title="العودة للموقع"
      >
        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors">
          <i className="fas fa-mosque text-white text-sm"></i>
        </div>
        {(mobile || sidebarOpen) && (
          <div className="overflow-hidden">
            <span className="font-bold text-lg block truncate leading-tight">مسجدي</span>
            <span className="text-primary-300 text-xs flex items-center gap-1">
              <i className="fas fa-arrow-left text-[10px]"></i>
              العودة للموقع
            </span>
          </div>
        )}
      </Link>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(item => {
          const active = item.path === '' ? currentPath === '' : currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={`/teacher/${item.path}`}
              onClick={mobile ? closeMobile : undefined}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg mb-1 transition-colors ${active ? 'bg-primary-600 text-white' : 'text-primary-200 hover:bg-primary-700 hover:text-white'}`}
              title={!mobile && !sidebarOpen ? item.label : ''}
            >
              <i className={`${item.icon} w-5 text-center flex-shrink-0`}></i>
              {(mobile || sidebarOpen) && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-primary-700 dark:border-primary-800">
        {(mobile || sidebarOpen) && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-xs"></i>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{user?.name}</p>
              <p className="text-xs text-primary-300">معلم</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout} className="w-full flex items-center gap-2 text-red-300 hover:text-red-200 text-sm py-1">
          <i className="fas fa-sign-out-alt w-5 text-center"></i>
          {(mobile || sidebarOpen) && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#0d1a10] overflow-hidden transition-colors duration-300" dir="rtl">

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Mobile sidebar (overlay) */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-primary-800 dark:bg-[#0a1a0d] text-white flex flex-col transform transition-transform duration-300 lg:hidden border-l border-primary-700 dark:border-primary-950 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-primary-700 dark:border-primary-800">
          <span className="font-bold text-lg">القائمة</span>
          <button onClick={closeMobile} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary-700 transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <SidebarContent mobile={true} />
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex ${sidebarOpen ? 'w-64' : 'w-16'} bg-primary-800 dark:bg-[#0a1a0d] text-white flex-col transition-all duration-300 flex-shrink-0 border-l border-primary-700 dark:border-primary-950`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-white dark:bg-[#111f14] shadow-sm dark:shadow-black/30 dark:border-b dark:border-primary-900/50 px-3 sm:px-4 py-3 flex items-center justify-between transition-colors duration-300 flex-shrink-0">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 w-9 h-9 flex items-center justify-center"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>

          {/* Desktop toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
          >
            <i className={`fas ${sidebarOpen ? 'fa-indent' : 'fa-outdent'} text-xl`}></i>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <i className="fas fa-chalkboard-teacher text-primary-600 dark:text-primary-400"></i>
              <span className="hidden sm:inline">لوحة تحكم المعلم</span>
            </div>
            <button
              onClick={toggleDark}
              title={dark ? 'الوضع النهاري' : 'الوضع الليلي'}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-primary-900/60 hover:bg-gray-200 dark:hover:bg-primary-800 text-gray-500 dark:text-gold-400 transition-colors"
            >
              <i className={`fas ${dark ? 'fa-sun' : 'fa-moon'} text-sm`}></i>
            </button>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
          >
            <i className={`fas ${sidebarOpen ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
          </button>
          <div className="lg:hidden w-9"></div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 sm:p-6 bg-gray-100 dark:bg-[#0d1a10] transition-colors duration-300">
          <Routes>
            <Route path="/" element={<TeacherHome />} />
            <Route path="/attendance" element={<TeacherAttendance />} />
            <Route path="/honor" element={<TeacherHonor />} />
            <Route path="/lessons" element={<TeacherLessons />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

import AdminHome from './AdminHome';
import AdminStudents from './AdminStudents';
import AdminTeachers from './AdminTeachers';
import AdminClasses from './AdminClasses';
import AdminHonors from './AdminHonors';
import AdminOccasions from './AdminOccasions';
import AdminNews from './AdminNews';
import AdminAttendance from './AdminAttendance';
import AdminContact from './AdminContact';
import AdminCertificates from './AdminCertificates';
import AdminSettings from './AdminSettings';

const navItems = [
  { path: '', icon: 'fas fa-tachometer-alt', label: 'الرئيسية' },
  { path: 'students', icon: 'fas fa-user-graduate', label: 'الطلاب' },
  { path: 'teachers', icon: 'fas fa-chalkboard-teacher', label: 'المعلمون' },
  { path: 'classes', icon: 'fas fa-school', label: 'الصفوف' },
  { path: 'honors', icon: 'fas fa-award', label: 'الشرف' },
  { path: 'occasions', icon: 'fas fa-star-and-crescent', label: 'المناسبات' },
  { path: 'news', icon: 'fas fa-newspaper', label: 'الأخبار' },
  { path: 'attendance', icon: 'fas fa-clipboard-check', label: 'الحضور' },
  { path: 'contact', icon: 'fas fa-address-book', label: 'التواصل' },
  { path: 'certificates', icon: 'fas fa-certificate', label: 'الشهادات' },
  { path: 'settings', icon: 'fas fa-cog', label: 'الإعدادات' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { dark, toggleDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentPath = location.pathname.replace('/admin/', '').replace('/admin', '');
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#0d1a10] overflow-hidden transition-colors duration-300" dir="rtl">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-primary-900 dark:bg-[#0a1a0d] text-white flex flex-col transition-all duration-300 flex-shrink-0 border-l border-primary-800 dark:border-primary-950`}>
        <Link to="/" className="p-4 flex items-center gap-3 border-b border-primary-700 dark:border-primary-800 hover:bg-primary-800 dark:hover:bg-primary-900/80 transition-colors group" title="العودة للموقع">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors">
            <i className="fas fa-mosque text-white"></i>
          </div>
          {sidebarOpen && (
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
                to={`/admin/${item.path}`}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg mb-1 transition-colors ${active ? 'bg-primary-700 text-white' : 'text-primary-200 hover:bg-primary-800 hover:text-white'}`}
                title={!sidebarOpen ? item.label : ''}
              >
                <i className={`${item.icon} w-5 text-center flex-shrink-0`}></i>
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-primary-700 dark:border-primary-800">
          {sidebarOpen && (
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <i className="fas fa-user-shield text-xs"></i>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">{user?.name}</p>
                <p className="text-xs text-primary-300">مدير</p>
              </div>
            </div>
          )}
          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-red-300 hover:text-red-200 text-sm py-1">
            <i className="fas fa-sign-out-alt w-5 text-center"></i>
            {sidebarOpen && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-[#111f14] shadow-sm dark:shadow-black/30 dark:border-b dark:border-primary-900/50 px-4 py-3 flex items-center justify-between transition-colors duration-300">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">
            <i className={`fas ${sidebarOpen ? 'fa-indent' : 'fa-outdent'} text-xl`}></i>
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <i className="fas fa-user-shield text-primary-600 dark:text-primary-400"></i>
              <span>لوحة تحكم المدير</span>
            </div>
            <button
              onClick={toggleDark}
              title={dark ? 'الوضع النهاري' : 'الوضع الليلي'}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-primary-900/60 hover:bg-gray-200 dark:hover:bg-primary-800 text-gray-500 dark:text-gold-400 transition-colors"
            >
              <i className={`fas ${dark ? 'fa-sun' : 'fa-moon'} text-sm`}></i>
            </button>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-sm">
            <i className={`fas ${sidebarOpen ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-[#0d1a10] transition-colors duration-300">
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="/students" element={<AdminStudents />} />
            <Route path="/teachers" element={<AdminTeachers />} />
            <Route path="/classes" element={<AdminClasses />} />
            <Route path="/honors" element={<AdminHonors />} />
            <Route path="/occasions" element={<AdminOccasions />} />
            <Route path="/news" element={<AdminNews />} />
            <Route path="/attendance" element={<AdminAttendance />} />
            <Route path="/contact" element={<AdminContact />} />
            <Route path="/certificates" element={<AdminCertificates />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

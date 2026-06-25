import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import logoLight from '../../assets/logo/MasjidiDLightMode.png';
import logoDark from '../../assets/logo/MasjidiDarkMode.png';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settings, setSettings] = useState({ registrationOpen: true, siteName: 'مسجدي' });
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { dark, toggleDark } = useTheme();
  const dropdownRef = useRef(null);

  useEffect(() => {
    axios.get('/api/settings').then(r => setSettings(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryLinks = [
    { to: '/', label: 'الرئيسية' },
    { to: '/attendance', label: 'الغياب والحضور' },
    { to: '/contact', label: 'تواصل معنا' },
  ];

  const secondaryLinks = [
    { id: 'courses', label: 'الدورات المتاحة', icon: 'fa-graduation-cap' },
    { id: 'news', label: 'الأخبار والإعلانات', icon: 'fa-newspaper' },
    { id: 'occasions', label: 'المناسبات الإسلامية', icon: 'fa-star-and-crescent' },
    { id: 'honor', label: 'لوحة الشرف', icon: 'fa-award' },
    { id: 'lessons', label: 'خطة الدروس الأسبوعية', icon: 'fa-calendar-week' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const scrollToSection = (id) => {
    setMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  };

  return (
    <header className="bg-white dark:bg-[#0d1a10] shadow-md dark:shadow-primary-900/30 dark:border-b dark:border-primary-900/50 sticky top-0 z-50 transition-colors duration-300">

      {/* ── Row 1: primary navigation ── */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">

          <Link to="/" className="flex items-center">
            <img
              src={dark ? logoDark : logoLight}
              alt="مسجدي"
              className="h-12 w-auto object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {primaryLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-semibold transition-colors text-sm ${isActive(link.to)
                  ? 'text-primary-700 dark:text-primary-400 border-b-2 border-primary-700 dark:border-primary-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleDark}
              title={dark ? 'الوضع النهاري' : 'الوضع الليلي'}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors bg-gray-100 dark:bg-primary-900/60 hover:bg-gray-200 dark:hover:bg-primary-800 text-gray-600 dark:text-gold-400"
            >
              <i className={`fas ${dark ? 'fa-sun' : 'fa-moon'} text-sm`}></i>
            </button>

            {settings.registrationOpen && (
              <span className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                <i className="fas fa-circle text-green-500 ml-1 text-[8px]"></i>
                التسجيل مفتوح
              </span>
            )}

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-primary-50 dark:bg-primary-900/40 border border-primary-200 dark:border-primary-700 text-primary-800 dark:text-gray-100 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-100 dark:hover:bg-primary-800/50 transition-colors"
                >
                  <div className="w-7 h-7 bg-primary-700 rounded-full flex items-center justify-center">
                    <i className={`fas ${user.role === 'admin' ? 'fa-user-shield' : 'fa-chalkboard-teacher'} text-white text-xs`}></i>
                  </div>
                  <span>{user.name || user.username}</span>
                  <i className={`fas fa-chevron-down text-xs transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}></i>
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-[#1a2d1e] rounded-xl shadow-lg dark:shadow-black/40 border border-gray-100 dark:border-primary-800 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-primary-800">
                      <p className="text-xs text-gray-500 dark:text-gray-400">مسجّل كـ</p>
                      <p className="font-bold text-primary-800 dark:text-gray-100 text-sm">{user.name}</p>
                      <span className="text-xs bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded-full font-semibold">
                        {user.role === 'admin' ? 'مدير' : 'معلم'}
                      </span>
                    </div>
                    <Link
                      to={user.role === 'admin' ? '/admin' : '/teacher'}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-primary-900/40 transition-colors"
                    >
                      <i className="fas fa-tachometer-alt text-primary-600 w-4"></i>
                      لوحة التحكم
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <i className="fas fa-sign-out-alt w-4"></i>
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-800 transition-colors">
                <i className="fas fa-sign-in-alt ml-1"></i>
                تسجيل الدخول
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleDark}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-primary-900/60 text-gray-600 dark:text-gold-400"
            >
              <i className={`fas ${dark ? 'fa-sun' : 'fa-moon'} text-xs`}></i>
            </button>
            <button className="text-gray-600 dark:text-gray-300" onClick={() => setMenuOpen(!menuOpen)}>
              <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* ── Row 2: secondary scroll links (desktop only) ── */}
      <div className="hidden md:block border-t border-gray-100 dark:border-primary-900/50 bg-gray-50 dark:bg-[#0a1509]">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-center gap-1">
          {secondaryLinks.map(link => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/40 transition-colors"
            >
              <i className={`fas ${link.icon} text-primary-500 dark:text-primary-500 text-[10px]`}></i>
              {link.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 pt-3 border-t dark:border-primary-900 flex flex-col gap-2">
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">التنقل</p>
          {primaryLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-700 dark:text-gray-300 font-semibold hover:text-primary-700 dark:hover:text-primary-400 py-1"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="border-t dark:border-primary-900 mt-2 pt-3">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">أقسام الصفحة الرئيسية</p>
            <div className="grid grid-cols-2 gap-2">
              {secondaryLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-primary-900/30 hover:bg-primary-50 dark:hover:bg-primary-900/50 hover:text-primary-700 dark:hover:text-primary-400 transition-colors text-right"
                >
                  <i className={`fas ${link.icon} text-primary-500 text-xs`}></i>
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t dark:border-primary-900 mt-2 pt-3 flex flex-col gap-2">
            {settings.registrationOpen && (
              <span className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2">
                <i className="fas fa-circle text-green-500 text-[8px] animate-pulse"></i>
                التسجيل مفتوح
              </span>
            )}
            {user ? (
              <>
                <div className="flex items-center gap-2 px-2 py-1 bg-primary-50 dark:bg-primary-900/40 rounded-lg">
                  <div className="w-8 h-8 bg-primary-700 rounded-full flex items-center justify-center">
                    <i className={`fas ${user.role === 'admin' ? 'fa-user-shield' : 'fa-chalkboard-teacher'} text-white text-xs`}></i>
                  </div>
                  <div>
                    <p className="font-bold text-primary-800 dark:text-gray-100 text-sm">{user.name}</p>
                    <p className="text-xs text-primary-600 dark:text-primary-400">{user.role === 'admin' ? 'مدير' : 'معلم'}</p>
                  </div>
                </div>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/teacher'}
                  className="bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  <i className="fas fa-tachometer-alt ml-1"></i>
                  لوحة التحكم
                </Link>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 px-4 py-2 rounded-lg text-sm font-semibold text-center"
                >
                  <i className="fas fa-sign-out-alt ml-1"></i>
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold text-center" onClick={() => setMenuOpen(false)}>
                تسجيل الدخول
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

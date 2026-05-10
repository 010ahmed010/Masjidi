import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settings, setSettings] = useState({ registrationOpen: true, siteName: 'مسجدي' });
  const location = useLocation();

  useEffect(() => {
    axios.get('/api/settings').then(r => setSettings(r.data)).catch(() => {});
  }, []);

  const navLinks = [
    { to: '/', label: 'الرئيسية' },
    { to: '/attendance', label: 'الغياب والحضور' },
    { to: '/contact', label: 'تواصل معنا' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center">
              <i className="fas fa-mosque text-white text-lg"></i>
            </div>
            <span className="text-2xl font-bold text-primary-800">{settings.siteName || 'مسجدي'}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-semibold transition-colors text-sm ${isActive(link.to) ? 'text-primary-700 border-b-2 border-primary-700' : 'text-gray-600 hover:text-primary-700'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {settings.registrationOpen && (
              <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                <i className="fas fa-circle text-green-500 ml-1 text-[8px]"></i>
                التسجيل مفتوح
              </span>
            )}
            <Link to="/login" className="bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-800 transition-colors">
              <i className="fas fa-sign-in-alt ml-1"></i>
              تسجيل الدخول
            </Link>
          </div>

          <button className="md:hidden text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t pt-3 flex flex-col gap-3">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="text-gray-700 font-semibold hover:text-primary-700" onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link to="/login" className="bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold text-center" onClick={() => setMenuOpen(false)}>
              تسجيل الدخول
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

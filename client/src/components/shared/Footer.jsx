import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logoDark from '../../assets/logo/MasjidiDarkMode.png';
import amjButton from '../../assets/DevAssets/AMJ-Button-Icon.png';

export default function Footer() {
  const [contact, setContact] = useState({});
  const [settings, setSettings] = useState({});

  useEffect(() => {
    axios.get('/api/contact').then(r => setContact(r.data)).catch(() => {});
    axios.get('/api/settings').then(r => setSettings(r.data)).catch(() => {});
  }, []);

  return (
    <footer className="bg-primary-900 text-white" dir="rtl">

      {/* ── Main body ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-10 pb-6">

        {/* Brand row — full width on all sizes */}
        <div className="flex flex-col items-center text-center mb-8 pb-7 border-b border-primary-700/60">
          <img src={logoDark} alt="مسجدي" className="h-12 w-auto object-contain mb-3" />
          <p className="text-primary-300 text-sm leading-relaxed max-w-md">
            {settings.siteDescription || 'معهد متخصص في تعليم القرآن الكريم والعلوم الإسلامية للأطفال والطلاب.'}
          </p>
        </div>

        {/* Links + Contact — always 2 columns even on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 sm:gap-10 mb-8">

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-sm sm:text-base mb-4 text-gold-400 border-r-2 border-gold-400 pr-2">روابط سريعة</h3>
            <ul className="space-y-2.5 text-primary-300 text-xs sm:text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <i className="fas fa-chevron-left text-xs text-primary-500"></i>الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/attendance" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <i className="fas fa-chevron-left text-xs text-primary-500"></i>الغياب والحضور
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <i className="fas fa-chevron-left text-xs text-primary-500"></i>تواصل معنا
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <i className="fas fa-chevron-left text-xs text-primary-500"></i>تسجيل الدخول
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-bold text-sm sm:text-base mb-4 text-gold-400 border-r-2 border-gold-400 pr-2">تواصل معنا</h3>
            <ul className="space-y-2.5 text-primary-300 text-xs sm:text-sm">
              {contact.whatsapp && (
                <li className="flex items-center gap-2">
                  <i className="fab fa-whatsapp text-green-400 flex-shrink-0"></i>
                  <a href={`https://wa.me/${contact.whatsapp?.replace(/\D/g,'')}`} className="hover:text-white truncate" dir="ltr">{contact.whatsapp}</a>
                </li>
              )}
              {contact.phone && (
                <li className="flex items-center gap-2">
                  <i className="fas fa-phone text-primary-400 flex-shrink-0"></i>
                  <a href={`tel:${contact.phone}`} className="hover:text-white truncate" dir="ltr">{contact.phone}</a>
                </li>
              )}
              {contact.email && (
                <li className="flex items-center gap-2">
                  <i className="fas fa-envelope text-primary-400 flex-shrink-0"></i>
                  <a href={`mailto:${contact.email}`} className="hover:text-white truncate">{contact.email}</a>
                </li>
              )}
            </ul>

            {/* Social icons */}
            {(contact.facebook || contact.instagram || contact.twitter) && (
              <div className="flex gap-2 mt-4">
                {contact.facebook  && <a href={contact.facebook}  target="_blank" rel="noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"><i className="fab fa-facebook-f text-xs"></i></a>}
                {contact.instagram && <a href={contact.instagram} target="_blank" rel="noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"><i className="fab fa-instagram text-xs"></i></a>}
                {contact.twitter   && <a href={contact.twitter}   target="_blank" rel="noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"><i className="fab fa-twitter text-xs"></i></a>}
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-primary-700/60 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">

          {/* AMJ button */}
          <Link
            to="/developer"
            title="صفحة المطور"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 transition-all group flex-shrink-0"
          >
            <span className="bg-primary-950 rounded-md p-0.5 flex items-center justify-center">
              <img src={amjButton} alt="AMJ" className="h-5 w-auto object-contain" />
            </span>
            <span className="text-primary-200 group-hover:text-white text-xs font-medium whitespace-nowrap">تم التطوير بواسطة</span>
          </Link>

          {/* Copyright */}
          <p className="text-center text-primary-400 text-xs leading-relaxed">
            {settings.footerText || `جميع الحقوق محفوظة © ${new Date().getFullYear()} مسجدي`}
            <span className="mx-1.5 opacity-30">|</span>
            <span>تصميم وبرمجة </span>
            <Link to="/developer" className="text-gold-400 hover:text-gold-300 font-semibold transition-colors">
              أحمد الجاسم — AMJ
            </Link>
          </p>

        </div>
      </div>
    </footer>
  );
}

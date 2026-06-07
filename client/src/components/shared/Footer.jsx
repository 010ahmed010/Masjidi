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
    <footer className="bg-primary-900 text-white pt-10 pb-4" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Main grid — 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center mb-4">
              <img src={logoDark} alt="مسجدي" className="h-10 w-auto object-contain" />
            </div>
            <p className="text-primary-200 text-sm leading-relaxed max-w-xs">
              {settings.siteDescription || 'معهد متخصص في تعليم القرآن الكريم والعلوم الإسلامية للأطفال والطلاب.'}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4 text-gold-400">روابط سريعة</h3>
            <ul className="space-y-2 text-primary-200 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors flex items-center gap-1"><i className="fas fa-chevron-left text-xs"></i>الرئيسية</Link></li>
              <li><Link to="/attendance" className="hover:text-white transition-colors flex items-center gap-1"><i className="fas fa-chevron-left text-xs"></i>الغياب والحضور</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors flex items-center gap-1"><i className="fas fa-chevron-left text-xs"></i>تواصل معنا</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors flex items-center gap-1"><i className="fas fa-chevron-left text-xs"></i>تسجيل الدخول</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4 text-gold-400">تواصل معنا</h3>
            <ul className="space-y-2.5 text-primary-200 text-sm">
              {contact.whatsapp && (
                <li className="flex items-center gap-2">
                  <i className="fab fa-whatsapp text-green-400 text-lg flex-shrink-0"></i>
                  <a href={`https://wa.me/${contact.whatsapp?.replace(/\D/g,'')}`} className="hover:text-white truncate" dir="ltr">{contact.whatsapp}</a>
                </li>
              )}
              {contact.phone && (
                <li className="flex items-center gap-2">
                  <i className="fas fa-phone text-primary-300 text-lg flex-shrink-0"></i>
                  <a href={`tel:${contact.phone}`} className="hover:text-white truncate" dir="ltr">{contact.phone}</a>
                </li>
              )}
              {contact.email && (
                <li className="flex items-center gap-2">
                  <i className="fas fa-envelope text-primary-300 text-lg flex-shrink-0"></i>
                  <a href={`mailto:${contact.email}`} className="hover:text-white truncate">{contact.email}</a>
                </li>
              )}
            </ul>
            {(contact.facebook || contact.instagram || contact.twitter) && (
              <div className="flex gap-3 mt-4">
                {contact.facebook  && <a href={contact.facebook}  target="_blank" rel="noreferrer" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"><i className="fab fa-facebook-f text-sm"></i></a>}
                {contact.instagram && <a href={contact.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"><i className="fab fa-instagram text-sm"></i></a>}
                {contact.twitter   && <a href={contact.twitter}   target="_blank" rel="noreferrer" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"><i className="fab fa-twitter text-sm"></i></a>}
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-700 pt-4 flex flex-col sm:flex-row items-center gap-3 text-primary-300 text-xs sm:text-sm">

          {/* AMJ developer button */}
          <Link
            to="/developer"
            title="صفحة المطور"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 transition-all group flex-shrink-0"
          >
            <span className="flex-shrink-0 bg-primary-950 rounded-md p-0.5 flex items-center justify-center">
              <img src={amjButton} alt="AMJ" className="h-5 w-auto object-contain" />
            </span>
            <span className="text-primary-200 group-hover:text-white text-xs font-medium whitespace-nowrap">تم التطوير بواسطة</span>
          </Link>

          {/* Copyright */}
          <p className="text-center flex-1 text-primary-300 text-xs sm:text-sm leading-relaxed">
            {settings.footerText || `جميع الحقوق محفوظة © ${new Date().getFullYear()} مسجدي`}
            <span className="mx-2 opacity-40">|</span>
            <span className="text-primary-400">
              تصميم وبرمجة{' '}
              <Link to="/developer" className="text-gold-400 hover:text-gold-300 font-semibold transition-colors">
                أحمد الجاسم — AMJ
              </Link>
            </span>
          </p>

        </div>
      </div>
    </footer>
  );
}

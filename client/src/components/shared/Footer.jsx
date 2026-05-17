import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logoDark from '../../assets/logo/MasjidiDarkMode.png';

export default function Footer() {
  const [contact, setContact] = useState({});
  const [settings, setSettings] = useState({});

  useEffect(() => {
    axios.get('/api/contact').then(r => setContact(r.data)).catch(() => {});
    axios.get('/api/settings').then(r => setSettings(r.data)).catch(() => {});
  }, []);

  return (
    <footer className="bg-primary-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <img src={logoDark} alt="مسجدي" className="h-10 w-auto object-contain" />
            </div>
            <p className="text-primary-200 text-sm leading-relaxed">
              {settings.siteDescription || 'معهد متخصص في تعليم القرآن الكريم والعلوم الإسلامية للأطفال والطلاب.'}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-gold-400">روابط سريعة</h3>
            <ul className="space-y-2 text-primary-200 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors"><i className="fas fa-chevron-left ml-1 text-xs"></i>الرئيسية</Link></li>
              <li><Link to="/attendance" className="hover:text-white transition-colors"><i className="fas fa-chevron-left ml-1 text-xs"></i>الغياب والحضور</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors"><i className="fas fa-chevron-left ml-1 text-xs"></i>تواصل معنا</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors"><i className="fas fa-chevron-left ml-1 text-xs"></i>تسجيل الدخول</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-gold-400">تواصل معنا</h3>
            <ul className="space-y-3 text-primary-200 text-sm">
              {contact.whatsapp && (
                <li className="flex items-center gap-2">
                  <i className="fab fa-whatsapp text-green-400 text-lg"></i>
                  <a href={`https://wa.me/${contact.whatsapp?.replace(/\D/g,'')}`} className="hover:text-white" dir="ltr">{contact.whatsapp}</a>
                </li>
              )}
              {contact.phone && (
                <li className="flex items-center gap-2">
                  <i className="fas fa-phone text-primary-300 text-lg"></i>
                  <a href={`tel:${contact.phone}`} className="hover:text-white" dir="ltr">{contact.phone}</a>
                </li>
              )}
              {contact.email && (
                <li className="flex items-center gap-2">
                  <i className="fas fa-envelope text-primary-300 text-lg"></i>
                  <a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a>
                </li>
              )}
            </ul>
            <div className="flex gap-3 mt-4">
              {contact.facebook && <a href={contact.facebook} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"><i className="fab fa-facebook-f text-sm"></i></a>}
              {contact.instagram && <a href={contact.instagram} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"><i className="fab fa-instagram text-sm"></i></a>}
              {contact.twitter && <a href={contact.twitter} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"><i className="fab fa-twitter text-sm"></i></a>}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-700 pt-4 text-center text-primary-300 text-sm">
          <p>{settings.footerText || `جميع الحقوق محفوظة © ${new Date().getFullYear()} مسجدي`}</p>
        </div>
      </div>
    </footer>
  );
}

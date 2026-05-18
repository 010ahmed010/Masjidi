import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/shared/Header';
import Footer from '../../components/shared/Footer';
import amjLogo from '../../assets/DevAssets/AMJ-Logo.png';

export default function DeveloperPage() {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://010ahmed010.github.io/api/Amj-contact.json')
      .then(r => setContact(r.data.contactDetails))
      .catch(() => setContact(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0d1a10] transition-colors duration-300">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-5xl w-full">

          {/* Top label */}
          <div className="text-center mb-12" dir="rtl">
            <span className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/40 border border-primary-200 dark:border-primary-700/50 text-primary-700 dark:text-primary-300 text-sm font-semibold px-5 py-2 rounded-full">
              <i className="fas fa-code text-xs"></i>
              صُنع بواسطة
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-14">

            {/* Floating Logo Box */}
            <div className="flex-shrink-0 flex justify-center">
              <div className="relative">
                {/* Outer glow */}
                <div className="absolute -inset-4 bg-gradient-to-br from-primary-500/20 via-gold-500/10 to-primary-700/20 rounded-[2.5rem] blur-2xl"></div>
                {/* Gold ring */}
                <div className="absolute -inset-1 bg-gradient-to-br from-gold-400/40 via-primary-600/20 to-gold-500/40 rounded-[2rem] blur-sm"></div>
                {/* Logo card */}
                <div
                  className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-[1.75rem] overflow-hidden border-2 border-primary-600/30 dark:border-primary-500/40 shadow-2xl shadow-primary-900/40"
                  style={{ animation: 'amjFloat 4s ease-in-out infinite' }}
                >
                  <img
                    src={amjLogo}
                    alt="AMJ"
                    className="w-full h-full object-cover"
                  />
                  {/* subtle inner overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 to-transparent"></div>
                </div>
                {/* Bottom reflection */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-primary-600/20 blur-xl rounded-full"></div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-right w-full" dir="rtl">
              <p className="text-primary-600 dark:text-primary-400 font-semibold text-sm mb-1 tracking-wide uppercase">المطور</p>
              <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                أحمد{' '}
                <span className="text-primary-600 dark:text-primary-400">الجاسم</span>
              </h1>
              <p className="text-gray-400 dark:text-gray-400 font-medium mb-5 text-sm" dir="ltr">
                Ahmed Al-Jassem | MERN Stack Developer
              </p>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 max-w-lg text-sm sm:text-base">
                مطور متكامل متخصص في{' '}
                <span className="text-primary-600 dark:text-primary-400 font-bold">MERN Stack</span>.
                أوظف خبرتي في اختبار اختراق الويب لتعزيز أمان تطبيقاتي البرمجية، مما يضمن بناء أنظمة محمية من الثغرات.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {['Web Pentesting', 'MERN Stack', 'Hostinger & VPS', 'Linux Daily Driver'].map(tag => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 rounded-full text-xs font-bold bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Contact */}
              {loading ? (
                <div className="flex items-center gap-2 text-primary-500 text-sm">
                  <i className="fas fa-circle-notch fa-spin"></i>
                  <span>جاري تحميل بيانات التواصل...</span>
                </div>
              ) : contact ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/40 border border-primary-100 dark:border-primary-800/50 hover:border-primary-500 dark:hover:border-primary-500 transition-all group shadow-sm hover:shadow-md"
                    >
                      <div className="w-9 h-9 bg-primary-100 dark:bg-primary-800/80 rounded-full flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-700 transition-colors flex-shrink-0">
                        <i className="fas fa-phone text-primary-600 dark:text-primary-400 text-sm"></i>
                      </div>
                      <span className="text-gray-700 dark:text-gray-200 font-medium text-sm" dir="ltr">{contact.phone}</span>
                    </a>
                  )}

                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/40 border border-primary-100 dark:border-primary-800/50 hover:border-primary-500 dark:hover:border-primary-500 transition-all group shadow-sm hover:shadow-md"
                    >
                      <div className="w-9 h-9 bg-primary-100 dark:bg-primary-800/80 rounded-full flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-700 transition-colors flex-shrink-0">
                        <i className="fas fa-envelope text-primary-600 dark:text-primary-400 text-sm"></i>
                      </div>
                      <span className="text-gray-700 dark:text-gray-200 font-medium text-sm truncate">{contact.email}</span>
                    </a>
                  )}

                  {contact.whatsapp && (
                    <a
                      href={`https://wa.me/${contact.whatsapp.replace(/\D/g,'')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/40 hover:border-green-400 dark:hover:border-green-600 transition-all group shadow-sm hover:shadow-md"
                    >
                      <div className="w-9 h-9 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800/60 transition-colors flex-shrink-0">
                        <i className="fab fa-whatsapp text-green-600 dark:text-green-400 text-sm"></i>
                      </div>
                      <span className="text-gray-700 dark:text-gray-200 font-medium text-sm" dir="ltr">{contact.whatsapp}</span>
                    </a>
                  )}

                  {contact.linkedin && (
                    <a
                      href={contact.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 hover:border-blue-400 dark:hover:border-blue-600 transition-all group shadow-sm hover:shadow-md"
                    >
                      <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/60 transition-colors flex-shrink-0">
                        <i className="fab fa-linkedin-in text-blue-600 dark:text-blue-400 text-sm"></i>
                      </div>
                      <span className="text-gray-700 dark:text-gray-200 font-medium text-sm">LinkedIn Profile</span>
                    </a>
                  )}

                  {contact.workPlatform && (
                    <a
                      href={contact.workPlatform}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-l from-primary-50 to-white dark:from-primary-900/40 dark:to-primary-950/60 border border-primary-200 dark:border-primary-700/50 hover:border-gold-500 dark:hover:border-gold-500 transition-all group shadow-sm hover:shadow-md sm:col-span-2"
                    >
                      <div className="w-9 h-9 bg-primary-100 dark:bg-primary-800/80 rounded-full flex items-center justify-center group-hover:bg-gold-100 dark:group-hover:bg-gold-900/40 transition-colors flex-shrink-0">
                        <i className="fas fa-external-link-alt text-gold-500 text-sm"></i>
                      </div>
                      <span className="text-gold-600 dark:text-gold-400 font-bold text-sm">منصة العمل الخاصة بي</span>
                    </a>
                  )}

                </div>
              ) : (
                <p className="text-gray-400 text-sm">تعذّر تحميل بيانات التواصل</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes amjFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}

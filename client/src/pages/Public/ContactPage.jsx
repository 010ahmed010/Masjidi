import React, { useEffect, useState } from 'react';
import Header from '../../components/shared/Header';
import Footer from '../../components/shared/Footer';
import axios from 'axios';

export default function ContactPage() {
  const [contact, setContact] = useState({});

  useEffect(() => {
    axios.get('/api/contact').then(r => setContact(r.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0d1a10] transition-colors duration-300">
      <Header />
      <main className="flex-1">
        <div className="gradient-islamic islamic-pattern py-16 text-center text-white">
          <h1 className="text-4xl font-bold mb-3">تواصل معنا</h1>
          <p className="text-primary-200">نسعد بتواصلكم معنا في أي وقت</p>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 p-6 dark:border dark:border-primary-900/50">
                <h2 className="text-2xl font-bold text-primary-800 dark:text-gray-100 mb-4">
                  <i className="fas fa-address-card text-gold-500 ml-2"></i>
                  معلومات التواصل
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {contact.description || 'مسجدي - معهد متخصص في تعليم القرآن الكريم والعلوم الإسلامية. نرحب بتواصلكم معنا لأي استفسار.'}
                </p>

                <div className="space-y-4">
                  {contact.whatsapp && (
                    <a href={`https://wa.me/${contact.whatsapp?.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                      className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fab fa-whatsapp text-white text-xl"></i>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">واتساب</p>
                        <p className="font-bold text-gray-800 dark:text-gray-100" dir="ltr">{contact.whatsapp}</p>
                      </div>
                    </a>
                  )}
                  {contact.phone && (
                    <a href={`tel:${contact.phone}`}
                      className="flex items-center gap-4 p-4 bg-primary-50 dark:bg-primary-900/30 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors">
                      <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-phone text-white text-xl"></i>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">هاتف</p>
                        <p className="font-bold text-gray-800 dark:text-gray-100" dir="ltr">{contact.phone}</p>
                      </div>
                    </a>
                  )}
                  {contact.email && (
                    <a href={`mailto:${contact.email}`}
                      className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-envelope text-white text-xl"></i>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">البريد الإلكتروني</p>
                        <p className="font-bold text-gray-800 dark:text-gray-100">{contact.email}</p>
                      </div>
                    </a>
                  )}
                  {contact.address && (
                    <div className="flex items-center gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-map-marker-alt text-white text-xl"></i>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">العنوان</p>
                        <p className="font-bold text-gray-800 dark:text-gray-100">{contact.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {contact.masjidImage && (
                <div className="rounded-2xl overflow-hidden shadow-md h-64">
                  <img src={contact.masjidImage} alt="صورة المسجد" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 overflow-hidden dark:border dark:border-primary-900/50">
                <h3 className="font-bold text-primary-800 dark:text-gray-100 p-4 border-b dark:border-primary-900/50">
                  <i className="fas fa-map-marker-alt text-red-500 ml-2"></i>
                  الموقع على الخريطة
                </h3>
                {contact.mapsIframe ? (
                  <div className="h-64" dangerouslySetInnerHTML={{ __html: contact.mapsIframe }} />
                ) : (
                  <div className="h-64 bg-gray-100 dark:bg-[#111f14] flex items-center justify-center">
                    <div className="text-center text-gray-400 dark:text-gray-500">
                      <i className="fas fa-map text-4xl mb-2"></i>
                      <p>لم يتم إضافة الخريطة بعد</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

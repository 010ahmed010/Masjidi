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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="gradient-islamic islamic-pattern py-16 text-center text-white">
          <h1 className="text-4xl font-bold mb-3">تواصل معنا</h1>
          <p className="text-primary-200">نسعد بتواصلكم معنا في أي وقت</p>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-primary-800 mb-4">
                  <i className="fas fa-address-card text-gold-500 ml-2"></i>
                  معلومات التواصل
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {contact.description || 'مسجدي - معهد متخصص في تعليم القرآن الكريم والعلوم الإسلامية. نرحب بتواصلكم معنا لأي استفسار.'}
                </p>

                <div className="space-y-4">
                  {contact.whatsapp && (
                    <a href={`https://wa.me/${contact.whatsapp?.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                      className="flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fab fa-whatsapp text-white text-xl"></i>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">واتساب</p>
                        <p className="font-bold text-gray-800" dir="ltr">{contact.whatsapp}</p>
                      </div>
                    </a>
                  )}
                  {contact.phone && (
                    <a href={`tel:${contact.phone}`}
                      className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
                      <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-phone text-white text-xl"></i>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">هاتف</p>
                        <p className="font-bold text-gray-800" dir="ltr">{contact.phone}</p>
                      </div>
                    </a>
                  )}
                  {contact.email && (
                    <a href={`mailto:${contact.email}`}
                      className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-envelope text-white text-xl"></i>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">البريد الإلكتروني</p>
                        <p className="font-bold text-gray-800">{contact.email}</p>
                      </div>
                    </a>
                  )}
                  {contact.address && (
                    <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-map-marker-alt text-white text-xl"></i>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">العنوان</p>
                        <p className="font-bold text-gray-800">{contact.address}</p>
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

              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <h3 className="font-bold text-primary-800 p-4 border-b">
                  <i className="fas fa-map-marker-alt text-red-500 ml-2"></i>
                  الموقع على الخريطة
                </h3>
                {contact.mapsIframe ? (
                  <div className="h-64" dangerouslySetInnerHTML={{ __html: contact.mapsIframe }} />
                ) : (
                  <div className="h-64 bg-gray-100 flex items-center justify-center">
                    <div className="text-center text-gray-400">
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

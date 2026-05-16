import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/shared/Header';
import Footer from '../../components/shared/Footer';
import axios from 'axios';

export default function HomePage() {
  const [news, setNews] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [honors, setHonors] = useState([]);
  const [classes, setClasses] = useState([]);
  const [contact, setContact] = useState({});
  const [latestAttendance, setLatestAttendance] = useState(null);

  useEffect(() => {
    axios.get('/api/news').then(r => setNews(r.data)).catch(() => {});
    axios.get('/api/occasions').then(r => setOccasions(r.data.filter(o => o.active))).catch(() => {});
    axios.get('/api/honors?status=approved').then(r => setHonors(r.data.slice(0, 6))).catch(() => {});
    axios.get('/api/classes').then(r => setClasses(r.data.filter(c => c.showOnHomePage))).catch(() => {});
    axios.get('/api/contact').then(r => setContact(r.data)).catch(() => {});
    axios.get('/api/attendance/latest').then(r => setLatestAttendance(r.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="gradient-islamic islamic-pattern min-h-[85vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 text-white text-9xl opacity-20">
            <i className="fas fa-mosque"></i>
          </div>
          <div className="absolute bottom-10 left-10 text-white text-7xl opacity-20">
            <i className="fas fa-book-quran"></i>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center text-white relative z-10 py-20">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6 text-sm">
            <i className="fas fa-star text-gold-400"></i>
            <span>معهد متخصص في تعليم القرآن الكريم</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            مرحباً بكم في
            <span className="text-gold-400 block mt-2">مسجدي</span>
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            معهد متخصص في تعليم الأطفال والطلاب القرآن الكريم وعلوم السنة النبوية والعلوم الإسلامية
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#courses" className="bg-gold-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gold-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <i className="fas fa-graduation-cap ml-2"></i>
              استعرض الدورات
            </a>
            <Link to="/contact" className="bg-white/20 backdrop-blur text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-all border border-white/30">
              <i className="fas fa-phone ml-2"></i>
              تواصل معنا
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* About */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">من نحن</span>
              <h2 className="text-4xl font-bold text-primary-900 mt-2 mb-5">معهد مسجدي للعلوم الإسلامية</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-5">
                مسجدي معهد تعليمي متخصص في تعليم الأطفال والطلاب القرآن الكريم بأحكام التجويد، والحديث النبوي الشريف، والفقه الإسلامي، والسيرة النبوية، وسائر العلوم الإسلامية.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                نحرص على بناء جيل متمسك بكتاب الله وسنة نبيه ﷺ، في بيئة تعليمية مشجعة ومنظمة تحت إشراف نخبة من المعلمين المتخصصين.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[['fas fa-quran','القرآن الكريم'],['fas fa-book','الحديث',''],['fas fa-mosque','الفقه']].map(([icon, label]) => (
                  <div key={label} className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <i className={`${icon} text-primary-600 text-2xl mb-2`}></i>
                    <p className="text-sm font-semibold text-gray-700">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-primary-700 rounded-3xl p-8 text-white text-center shadow-2xl">
                <i className="fas fa-mosque text-8xl text-white/30 mb-4"></i>
                <p className="text-2xl font-bold text-gold-300 mb-2">﴿ خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ ﴾</p>
                <p className="text-primary-200 text-sm">صحيح البخاري</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-primary-600 font-semibold text-sm">ما نقدمه</span>
            <h2 className="text-4xl font-bold text-primary-900 mt-2">الدورات المتاحة</h2>
            <div className="w-16 h-1 bg-gold-500 mx-auto mt-3"></div>
          </div>
          {classes.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <i className="fas fa-book-open text-5xl mb-3"></i>
              <p>لم تتم إضافة دورات بعد</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map(cls => (
                <div key={cls._id} className="bg-white rounded-2xl shadow-md overflow-hidden card-hover">
                  <div className="h-44 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                    {cls.courseImage ? (
                      <img src={cls.courseImage} alt={cls.name} className="w-full h-full object-cover" />
                    ) : (
                      <i className="fas fa-book-quran text-white text-6xl opacity-60"></i>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-xl text-primary-800 mb-1">{cls.name}</h3>
                    {cls.courseName && <p className="text-gold-600 text-sm font-semibold mb-2">{cls.courseName}</p>}
                    {cls.description && <p className="text-gray-600 text-sm">{cls.description}</p>}
                    {cls.teacher && <p className="text-xs text-gray-400 mt-3"><i className="fas fa-user ml-1"></i>المعلم: {cls.teacher.name}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* News */}
      {news.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <span className="text-primary-600 font-semibold text-sm">آخر الأخبار</span>
              <h2 className="text-4xl font-bold text-primary-900 mt-2">الأخبار والإعلانات</h2>
              <div className="w-16 h-1 bg-gold-500 mx-auto mt-3"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.slice(0,6).map(item => (
                <div key={item._id} className="bg-white rounded-2xl shadow-md p-6 card-hover">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${item.type === 'offer' ? 'bg-orange-100 text-orange-700' : item.type === 'announcement' ? 'bg-blue-100 text-blue-700' : 'bg-primary-100 text-primary-700'}`}>
                      {item.type === 'offer' ? 'عرض' : item.type === 'announcement' ? 'إعلان' : 'خبر'}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString('ar-SA')}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">{item.title}</h3>
                  {item.content && <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{item.content}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Occasions */}
      {occasions.length > 0 && (
        <section dir="rtl">
          {/* Section header — light background matching other sections */}
          <div className="py-16 px-4 text-center">
            <span className="text-primary-600 font-semibold text-sm">المناسبات</span>
            <h2 className="text-4xl font-bold text-primary-900 mt-2">المناسبات الإسلامية</h2>
            <div className="w-16 h-1 bg-gold-500 mx-auto mt-3"></div>
          </div>

          {/* Occasions banners — full width, stacked with gap */}
          <div className="flex flex-col gap-4 pb-16 px-4 md:px-10 max-w-7xl mx-auto">
            {occasions.map((occ) => (
              <div
                key={occ._id}
                className="relative w-full rounded-2xl overflow-hidden group"
                style={{ minHeight: '320px' }}
              >
                {/* Background */}
                {occ.image ? (
                  <>
                    <img
                      src={occ.image}
                      alt={occ.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Strong right-side gradient overlay so text is always readable */}
                    <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/60 to-black/20"></div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900">
                    <div className="absolute inset-0"
                      style={{backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.04) 0%, transparent 60%)'}}
                    ></div>
                  </div>
                )}

                {/* Decorative crescent — left side */}
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 text-[160px] leading-none pointer-events-none select-none">
                  <i className="fas fa-star-and-crescent"></i>
                </div>

                {/* Gold left border accent */}
                <div className="absolute top-6 bottom-6 right-0 w-1 bg-gradient-to-b from-transparent via-gold-500 to-transparent rounded-full"></div>

                {/* Content — always on the right side (RTL) */}
                <div className="relative z-10 flex items-center min-h-[320px] pr-10 pl-6 md:pr-16">
                  <div className="max-w-lg w-full">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-500/50 text-gold-300 text-xs font-bold px-4 py-1.5 rounded-full mb-5">
                      <i className="fas fa-star-and-crescent text-gold-400 text-xs"></i>
                      <span>مناسبة إسلامية</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight" style={{textShadow: '0 2px 20px rgba(0,0,0,0.8)'}}>
                      {occ.title}
                    </h3>

                    {/* Description */}
                    {occ.description && (
                      <p className="text-white/80 text-base md:text-lg leading-relaxed border-r-4 border-gold-500 pr-4 max-w-md" style={{textShadow: '0 1px 8px rgba(0,0,0,0.9)'}}>
                        {occ.description}
                      </p>
                    )}

                    {/* Bottom gold line */}
                    <div className="flex items-center gap-2 mt-6">
                      <div className="w-8 h-0.5 bg-gold-500"></div>
                      <div className="w-2 h-2 rounded-full bg-gold-400"></div>
                      <div className="w-16 h-0.5 bg-gold-500/50"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Honor */}
      {honors.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-gold-50 to-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <span className="text-gold-600 font-semibold text-sm">المتميزون</span>
              <h2 className="text-4xl font-bold text-primary-900 mt-2">لوحة الشرف</h2>
              <div className="w-16 h-1 bg-gold-500 mx-auto mt-3"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {honors.map(h => (
                <div key={h._id} className="bg-white border-2 border-gold-200 rounded-2xl p-6 text-center card-hover shadow-md">
                  <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-award text-gold-500 text-3xl"></i>
                  </div>
                  <h3 className="font-bold text-xl text-primary-800 mb-1">{h.student?.name}</h3>
                  {h.class?.name && <p className="text-sm text-gray-500 mb-2">{h.class.name}</p>}
                  {h.reason && <p className="text-gray-600 text-sm italic">"{h.reason}"</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Attendance Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <span className="text-primary-600 font-semibold text-sm">الحضور</span>
              <h2 className="text-3xl font-bold text-primary-900 mt-1">آخر سجل حضور</h2>
            </div>
            <Link to="/attendance" className="bg-primary-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-800 transition-colors text-sm">
              <i className="fas fa-list ml-2"></i>
              عرض الكل
            </Link>
          </div>
          {latestAttendance ? (
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-4 bg-primary-50 border-b flex items-center justify-between">
                <span className="font-bold text-primary-800">{latestAttendance.class?.name}</span>
                <span className="text-sm text-gray-500">{new Date(latestAttendance.date).toLocaleDateString('ar-SA')}</span>
              </div>
              <div className="p-4 grid grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-3xl font-bold text-green-600">{latestAttendance.records?.filter(r => r.status === 'present').length || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">حاضر</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4">
                  <p className="text-3xl font-bold text-red-600">{latestAttendance.records?.filter(r => r.status === 'absent').length || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">غائب</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <p className="text-3xl font-bold text-yellow-600">{latestAttendance.records?.filter(r => r.status === 'excused').length || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">معذور</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center text-gray-400">
              <i className="fas fa-calendar-check text-5xl mb-3"></i>
              <p>لا توجد سجلات حضور بعد</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-primary-800 rounded-3xl p-10 text-white text-center">
            <h2 className="text-4xl font-bold mb-3">تواصل معنا</h2>
            <p className="text-primary-200 mb-8">نسعد بالرد على استفساراتكم وتسجيل أبنائكم</p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {contact.whatsapp && (
                <a href={`https://wa.me/${contact.whatsapp?.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl transition-colors">
                  <i className="fab fa-whatsapp text-xl"></i>
                  <span className="font-semibold" dir="ltr">{contact.whatsapp}</span>
                </a>
              )}
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="flex items-center gap-3 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl transition-colors">
                  <i className="fas fa-phone text-xl"></i>
                  <span className="font-semibold" dir="ltr">{contact.phone}</span>
                </a>
              )}
            </div>
            <Link to="/contact" className="inline-block bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-xl font-bold transition-colors">
              <i className="fas fa-map-marker-alt ml-2"></i>
              صفحة التواصل الكاملة
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

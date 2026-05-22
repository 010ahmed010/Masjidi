import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/shared/Header";
import Footer from "../../components/shared/Footer";
import axios from "axios";
import logoDark from "../../assets/logo/MasjidiDarkMode.png";
import logoLight from "../../assets/logo/MasjidiDLightMode.png";
import { useTheme } from "../../context/ThemeContext";
import bgLight from "../../assets/background/HeorLightMode.png";
import bgDark from "../../assets/background/HeroDarkMode.png";

export default function HomePage() {
  const { dark } = useTheme();
  const [news, setNews] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [honors, setHonors] = useState([]);
  const [classes, setClasses] = useState([]);
  const [contact, setContact] = useState({});
  const [todaySummary, setTodaySummary] = useState(null);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    axios
      .get("/api/news")
      .then((r) => setNews(r.data))
      .catch(() => {});
    axios
      .get("/api/occasions")
      .then((r) => setOccasions(r.data.filter((o) => o.active)))
      .catch(() => {});
    axios
      .get("/api/honors?status=approved")
      .then((r) => setHonors(r.data.slice(0, 6)))
      .catch(() => {});
    axios
      .get("/api/classes")
      .then((r) => setClasses(r.data.filter((c) => c.showOnHomePage)))
      .catch(() => {});
    axios
      .get("/api/contact")
      .then((r) => setContact(r.data))
      .catch(() => {});
    axios
      .get("/api/attendance/today-summary")
      .then((r) => setTodaySummary(r.data))
      .catch(() => {});
    axios
      .get("/api/lessons/public")
      .then((r) => setLessons(r.data.slice(0, 4)))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
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
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
            مرحباً بكم في
            <span className="block mt-4 flex justify-center">
              <img
                src={logoDark}
                alt="مسجدي"
                className="h-16 sm:h-20 md:h-24 w-auto object-contain mx-auto"
              />
            </span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-primary-100 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            معهد متخصص في تعليم الأطفال والطلاب القرآن الكريم وعلوم السنة
            النبوية والعلوم الإسلامية
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
            <a
              href="#courses"
              className="bg-gold-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-gold-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <i className="fas fa-graduation-cap ml-2"></i>
              استعرض الدورات
            </a>
            <Link
              to="/contact"
              className="bg-white/20 backdrop-blur text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white/30 transition-all border border-white/30"
            >
              <i className="fas fa-phone ml-2"></i>
              تواصل معنا
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-[#0d1a10] to-transparent"></div>
      </section>

      {/* About */}
      <section className="py-16 bg-gray-50 dark:bg-[#111f14]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
                من نحن
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-primary-900 dark:text-gray-100 mt-2 mb-5">
                معهد مسجدي للعلوم الإسلامية
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-5">
                مسجدي معهد تعليمي متخصص في تعليم الأطفال والطلاب القرآن الكريم
                بأحكام التجويد، والحديث النبوي الشريف، والفقه الإسلامي، والسيرة
                النبوية، وسائر العلوم الإسلامية.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                نحرص على بناء جيل متمسك بكتاب الله وسنة نبيه ﷺ، في بيئة تعليمية
                مشجعة ومنظمة تحت إشراف نخبة من المعلمين المتخصصين.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  ["fas fa-quran", "القرآن الكريم"],
                  ["fas fa-book", "الحديث"],
                  ["fas fa-mosque", "الفقه"],
                ].map(([icon, label]) => (
                  <div
                    key={label}
                    className="text-center p-4 bg-white dark:bg-[#1a2d1e] rounded-xl shadow-sm dark:shadow-black/20 dark:border dark:border-primary-900/40"
                  >
                    <i className={`${icon} text-primary-600 text-2xl mb-2`}></i>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={dark ? bgDark : bgLight}
                alt="مسجدي"
                className="w-full h-auto block"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-6">
                <p
                  className={`text-lg sm:text-2xl font-bold text-center text-primary-800`}
                >
                  ﴿ خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ ﴾
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="py-20 bg-[#0f1f12] dark:bg-[#0a1509]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-gold-400 font-semibold text-sm tracking-widest uppercase">
              ما نقدمه
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3">
              الدورات المتاحة
            </h2>
            <div className="w-16 h-1 bg-gold-500 mx-auto mt-4"></div>
          </div>
          {(() => {
            const courseCards = [];
            classes.forEach((cls) => {
              const courses =
                cls.courses && cls.courses.length > 0
                  ? cls.courses
                  : cls.courseName
                    ? [{ name: cls.courseName, image: cls.courseImage || "" }]
                    : [];
              if (courses.length === 0) {
                courseCards.push({
                  key: cls._id,
                  courseName: cls.name,
                  courseImage: "",
                  className: cls.name,
                  teacherName: cls.teacher?.name,
                  description: cls.description,
                });
              } else {
                courses.forEach((course, i) => {
                  courseCards.push({
                    key: `${cls._id}-${i}`,
                    courseName: course.name,
                    courseImage: course.image || "",
                    className: cls.name,
                    teacherName: cls.teacher?.name,
                    description: cls.description,
                  });
                });
              }
            });
            if (courseCards.length === 0)
              return (
                <div className="text-center py-16 text-gray-500">
                  <i className="fas fa-book-open text-5xl mb-4 opacity-40"></i>
                  <p className="text-lg">لم تتم إضافة دورات بعد</p>
                </div>
              );
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {courseCards.map((card) => (
                  <div
                    key={card.key}
                    className="group bg-[#1a2d1e] rounded-2xl overflow-hidden shadow-xl shadow-black/40 border border-primary-800/40 hover:border-gold-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60"
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      {card.courseImage ? (
                        <img
                          src={card.courseImage}
                          alt={card.courseName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 flex items-center justify-center">
                          <i className="fas fa-book-quran text-white text-7xl opacity-30"></i>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a2d1e] via-transparent to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="px-5 pb-5 pt-3 text-center">
                      <h3 className="font-bold text-2xl text-white mb-1 leading-tight">
                        {card.courseName}
                      </h3>
                      {card.description && (
                        <p className="text-gray-400 text-sm mb-4 line-clamp-1">
                          {card.description}
                        </p>
                      )}
                      <div className="mt-4 pt-4 border-t border-primary-800/50 space-y-2">
                        <p className="text-sm font-bold text-primary-300">
                          <i className="fas fa-school ml-2 text-primary-400"></i>
                          الصف: <span className="text-primary-200">{card.className}</span>
                        </p>
                        {card.teacherName && (
                          <p className="text-xs text-gray-500">
                            <i className="fas fa-user ml-2"></i>
                            المعلم: {card.teacherName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* News */}
      {news.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-[#111f14]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <span className="text-primary-600 font-semibold text-sm">
                آخر الأخبار
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-primary-900 dark:text-gray-100 mt-2">
                الأخبار والإعلانات
              </h2>
              <div className="w-16 h-1 bg-gold-500 mx-auto mt-3"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.slice(0, 6).map((item) => (
                <div
                  key={item._id}
                  className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 p-6 card-hover dark:border dark:border-primary-900/40"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold ${item.type === "offer" ? "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400" : item.type === "announcement" ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400" : "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400"}`}
                    >
                      {item.type === "offer"
                        ? "عرض"
                        : item.type === "announcement"
                          ? "إعلان"
                          : "خبر"}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString("ar-SA")}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-2">
                    {item.title}
                  </h3>
                  {item.content && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                      {item.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Occasions */}
      {occasions.length > 0 && (
        <section dir="rtl" className="dark:bg-[#0d1a10]">
          {/* Section header */}
          <div className="py-16 px-4 text-center">
            <span className="text-primary-600 font-semibold text-sm">
              المناسبات
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-primary-900 dark:text-gray-100 mt-2">
              المناسبات الإسلامية
            </h2>
            <div className="w-16 h-1 bg-gold-500 mx-auto mt-3"></div>
          </div>

          {/* Full-width occasion banners */}
          <div className="flex flex-col gap-4 pb-16 px-4 md:px-10 max-w-7xl mx-auto">
            {occasions.map((occ) => (
              <div
                key={occ._id}
                className="relative w-full rounded-2xl overflow-hidden group bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800/60 shadow-lg dark:shadow-primary-900/40"
                style={{ minHeight: "320px" }}
              >
                {/* Left gold accent */}
                <div className="absolute top-6 bottom-6 left-0 w-1 bg-gradient-to-b from-transparent via-gold-500 to-transparent rounded-full z-20"></div>
                {occ.image ? (
                  <>
                    <img
                      src={occ.image}
                      alt={occ.title}
                      className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-primary-950/90 dark:from-black/90 via-primary-900/50 dark:via-black/50 to-transparent"></div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.04) 0%, transparent 60%)",
                      }}
                    ></div>
                  </div>
                )}

                <div
                  className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none select-none"
                  style={{ opacity: 0.15 }}
                >
                  <img
                    src={dark ? logoDark : logoLight}
                    alt=""
                    className="h-24 w-auto object-contain"
                  />
                </div>

                <div className="absolute top-6 bottom-6 right-0 w-1 bg-gradient-to-b from-transparent via-gold-500 to-transparent rounded-full"></div>

                <div className="relative z-10 flex items-center min-h-[280px] sm:min-h-[320px] pr-5 pl-4 sm:pr-10 md:pr-16">
                  <div className="max-w-lg w-full">
                    <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-500/50 text-gold-300 text-xs font-bold px-4 py-1.5 rounded-full mb-5">
                      <i className="fas fa-star-and-crescent text-gold-400 text-xs"></i>
                      <span>مناسبة إسلامية</span>
                    </div>
                    <h3
                      className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
                      style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
                    >
                      {occ.title}
                    </h3>
                    {occ.description && (
                      <p
                        className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed border-r-4 border-gold-500 pr-4 max-w-md"
                        style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}
                      >
                        {occ.description}
                      </p>
                    )}
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
        <section className="py-20 bg-[#0a1205] dark:bg-[#070e08] relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-500/5 blur-3xl"></div>
          </div>

          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <span className="text-gold-400 font-semibold text-sm tracking-widest uppercase">
                المتميزون
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3">
                لوحة الشرف
              </h2>
              <div className="w-16 h-1 bg-gold-500 mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {honors.map((h) => (
                <div
                  key={h._id}
                  className="group relative bg-[#111e13] border border-gold-800/40 hover:border-gold-500/70 rounded-2xl p-7 text-center transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-black/50 hover:shadow-gold-900/20 overflow-hidden"
                >
                  {/* Corner glow */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-gold-500/10 transition-colors duration-300"></div>

                  {/* Medal */}
                  <div className="relative w-20 h-20 mx-auto mb-5">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-600/30 to-gold-900/20 border border-gold-700/50 flex items-center justify-center group-hover:border-gold-500/80 transition-colors duration-300">
                      <i className="fas fa-award text-gold-400 text-4xl group-hover:text-gold-300 transition-colors duration-300"></i>
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gold-500/10 blur-md group-hover:bg-gold-500/20 transition-all duration-300"></div>
                  </div>

                  {/* Student name */}
                  {h.student?.name && (
                    <h3 className="font-bold text-xl text-white mb-1 leading-tight">
                      {h.student.name}
                    </h3>
                  )}

                  {/* Class badge */}
                  {h.class?.name && (
                    <span className="inline-flex items-center gap-1 text-xs text-primary-300 bg-primary-900/40 border border-primary-800/50 px-3 py-1 rounded-full mb-4">
                      <i className="fas fa-school text-primary-400 text-xs"></i>
                      {h.class.name}
                    </span>
                  )}

                  {/* Reason */}
                  {h.reason && (
                    <p className="text-gray-400 text-sm italic leading-relaxed border-t border-gold-900/40 pt-4 mt-2">
                      <i className="fas fa-quote-right text-gold-700 text-xs ml-1"></i>
                      {h.reason}
                      <i className="fas fa-quote-left text-gold-700 text-xs mr-1"></i>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Attendance Preview */}
      <section className="py-16 bg-gray-50 dark:bg-[#111f14]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <span className="text-primary-600 font-semibold text-sm">
                الحضور
              </span>
              <h2 className="text-3xl font-bold text-primary-900 dark:text-gray-100 mt-1">
                سجل حضور اليوم
              </h2>
            </div>
            <Link
              to="/attendance"
              className="bg-primary-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-800 transition-colors text-sm"
            >
              <i className="fas fa-list ml-2"></i>
              عرض الكل
            </Link>
          </div>
          {todaySummary && todaySummary.hasData ? (
            <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 overflow-hidden dark:border dark:border-primary-900/40">
              <div className="p-4 bg-primary-50 dark:bg-primary-900/40 border-b dark:border-primary-900/50 flex items-center justify-between">
                <span className="font-bold text-primary-800 dark:text-gray-100">
                  ملخص جميع الصفوف
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(todaySummary.date).toLocaleDateString("ar-SA")}
                </span>
              </div>
              <div className="p-4 grid grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {todaySummary.present}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    حاضر
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {todaySummary.absent}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    غائب
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {todaySummary.excused}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    معذور
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 p-12 text-center text-gray-400 dark:text-gray-500 dark:border dark:border-primary-900/40">
              <i className="fas fa-calendar-check text-5xl mb-3"></i>
              <p>لم يتم تسجيل حضور لهذا اليوم بعد</p>
            </div>
          )}
        </div>
      </section>

      {/* Lessons Section */}
      {lessons.length > 0 && (
        <section className="py-16 bg-white dark:bg-[#0d1a10]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10" dir="rtl">
              <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">المناهج الدراسية</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-primary-900 dark:text-gray-100 mt-2">خطة الدروس الأسبوعية</h2>
              <div className="w-16 h-1 bg-primary-600 mx-auto mt-3"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8" dir="rtl">
              {lessons.map(lesson => (
                <div key={lesson._id} className="bg-white dark:bg-[#1a2d1e] rounded-2xl overflow-hidden shadow-md dark:shadow-black/20 border border-gray-100 dark:border-primary-900/40">
                  {/* Card header */}
                  <div className="px-5 py-3 bg-gradient-to-l from-primary-700 to-primary-900 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-chalkboard-teacher text-white text-xs"></i>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white text-sm truncate">{lesson.teacher?.name}</p>
                        <p className="text-primary-200 text-xs truncate">{lesson.class?.name}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-left">
                      <p className="text-xs text-primary-300 leading-tight">آخر تحديث</p>
                      <p className="text-xs text-white/80">
                        {lesson.updatedAt ? new Date(lesson.updatedAt).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }) : ''}
                      </p>
                    </div>
                  </div>
                  {/* Days preview */}
                  <div className="p-4 space-y-2">
                    {lesson.days?.filter(d => d.topic || d.course).slice(0, 3).map((d, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded font-bold w-14 text-center flex-shrink-0">{d.day}</span>
                        <span className="text-xs text-gray-600 dark:text-gray-300 truncate">
                          {d.course && <span className="text-gold-600 dark:text-gold-400 font-semibold">{d.course} — </span>}
                          {d.topic}
                        </span>
                      </div>
                    ))}
                    {(lesson.days?.filter(d => d.topic || d.course).length || 0) === 0 && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-1">لا توجد تفاصيل مدخلة بعد</p>
                    )}
                    {(lesson.days?.filter(d => d.topic || d.course).length || 0) > 3 && (
                      <p className="text-xs text-primary-500 dark:text-primary-400 font-semibold">+{lesson.days.filter(d => d.topic || d.course).length - 3} أيام أخرى...</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link to="/lessons" className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-7 py-3 rounded-xl font-bold transition-colors text-sm">
                <i className="fas fa-calendar-week"></i>
                عرض جميع الخطط الأسبوعية
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-16 dark:bg-[#0d1a10]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-primary-800 dark:bg-primary-950 dark:border dark:border-primary-800/60 rounded-3xl p-6 sm:p-10 text-white text-center">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">تواصل معنا</h2>
            <p className="text-primary-200 mb-8">
              نسعد بالرد على استفساراتكم وتسجيل أبنائكم
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {contact.whatsapp && (
                <a
                  href={`https://wa.me/${contact.whatsapp?.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl transition-colors"
                >
                  <i className="fab fa-whatsapp text-xl"></i>
                  <span className="font-semibold" dir="ltr">
                    {contact.whatsapp}
                  </span>
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-3 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl transition-colors"
                >
                  <i className="fas fa-phone text-xl"></i>
                  <span className="font-semibold" dir="ltr">
                    {contact.phone}
                  </span>
                </a>
              )}
            </div>
            <Link
              to="/contact"
              className="inline-block bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-xl font-bold transition-colors"
            >
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

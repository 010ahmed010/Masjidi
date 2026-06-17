import React, { useEffect, useState } from "react";
import Header from "../../components/shared/Header";
import Footer from "../../components/shared/Footer";
import amjLogo from "../../assets/DevAssets/AMJ-Logo.webp";

export default function DeveloperPage() {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    fetch("/api/developer-contact")
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => setContact(data.contactDetails))
      .catch(() => setContact(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0d1a10] transition-colors duration-300">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-5xl w-full">
          {/* Top badge */}
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/40 border border-primary-200 dark:border-primary-700/50 text-primary-700 dark:text-primary-300 text-xs sm:text-sm font-semibold px-5 py-2 rounded-full">
              <i className="fas fa-code text-xs"></i>
              صُنع بواسطة
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* ── Logo with advanced lighting ── */}
            <div
              className="flex-shrink-0 flex justify-center w-full md:w-auto"
              style={{ animation: "amjFloat 4s ease-in-out infinite" }}
            >
              <div className="relative">
                {/* Layer 1 — large pulsing ambient halo */}
                <div
                  className="absolute -inset-8 rounded-[3.5rem] pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(34,197,94,0.18) 0%, rgba(21,128,61,0.08) 55%, transparent 75%)",
                    animation: "amjPulse 3s ease-in-out infinite",
                  }}
                />

                {/* Layer 2 — rotating conic gradient ring */}
                <div
                  className="absolute -inset-1 rounded-[2rem] pointer-events-none overflow-hidden"
                  style={{
                    padding: "2px",
                    animation: "amjSpin 6s linear infinite",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "1.875rem",
                      background:
                        "conic-gradient(from 0deg, transparent 0%, rgba(34,197,94,0.7) 20%, rgba(250,204,21,0.5) 35%, transparent 50%, rgba(34,197,94,0.4) 70%, transparent 100%)",
                    }}
                  />
                </div>

                {/* Layer 3 — static soft green border glow */}
                <div
                  className="absolute -inset-0.5 rounded-[1.85rem] pointer-events-none"
                  style={{
                    background: "rgba(34,197,94,0.25)",
                    filter: "blur(6px)",
                  }}
                />

                {/* Logo card */}
                <div
                  className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-[1.75rem] overflow-hidden shadow-2xl shadow-primary-900/60"
                  style={{ border: "1.5px solid rgba(34,197,94,0.3)" }}
                >
                  <img
                    src={amjLogo}
                    alt="AMJ"
                    className="w-full h-full object-cover"
                  />

                  {/* Sweep shimmer */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      animation: "amjSweep 4s ease-in-out infinite",
                      background:
                        "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.07) 50%, transparent 65%)",
                    }}
                  />

                  {/* Bottom vignette */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(10,40,18,0.35) 0%, transparent 50%)",
                    }}
                  />
                </div>

                {/* Bottom ground reflection */}
                <div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 rounded-full pointer-events-none"
                  style={{
                    background: "rgba(34,197,94,0.2)",
                    filter: "blur(14px)",
                    animation: "amjPulse 3s ease-in-out infinite",
                  }}
                />
              </div>
            </div>

            {/* ── Content ── */}
            <div className="flex-1 w-full text-center md:text-right" dir="rtl">
              <p className="text-primary-600 dark:text-primary-400 font-semibold text-xs sm:text-sm mb-1 tracking-widest uppercase">
                المطور
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                أحمد{" "}
                <span className="text-primary-600 dark:text-primary-400">
                  الجاسم
                </span>
              </h1>
              <p
                className="text-gray-400 font-medium mb-5 text-xs sm:text-sm"
                dir="ltr"
              >
                Ahmed Al-Jassem | MERN Stack Developer
              </p>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-sm sm:text-base max-w-lg mx-auto md:mx-0">
                مطور متكامل متخصص في{" "}
                <span className="text-primary-600 dark:text-primary-400 font-bold">
                  MERN Stack
                </span>
                . أوظف خبرتي في اختبار اختراق الويب لتعزيز أمان تطبيقاتي
                البرمجية، مما يضمن بناء أنظمة محمية من الثغرات.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-7">
                {[
                  "Web Pentesting",
                  "MERN Stack",
                  "Hostinger & VPS",
                  "Linux Daily Driver",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-bold bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Contact links */}
              {loading ? (
                <div className="flex items-center justify-center md:justify-start gap-2 text-primary-500 text-sm">
                  <i className="fas fa-circle-notch fa-spin"></i>
                  <span>جاري تحميل بيانات التواصل...</span>
                </div>
              ) : contact ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/40 border border-primary-100 dark:border-primary-800/50 hover:border-primary-500 dark:hover:border-primary-500 transition-all group shadow-sm hover:shadow-md"
                    >
                      <div className="w-9 h-9 bg-primary-100 dark:bg-primary-800/80 rounded-full flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-700 transition-colors flex-shrink-0">
                        <i className="fas fa-phone text-primary-600 dark:text-primary-400 text-sm"></i>
                      </div>
                      <span
                        className="text-gray-700 dark:text-gray-200 font-medium text-sm truncate"
                        dir="ltr"
                      >
                        {contact.phone}
                      </span>
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
                      <span className="text-gray-700 dark:text-gray-200 font-medium text-sm truncate">
                        {contact.email}
                      </span>
                    </a>
                  )}

                  {contact.whatsapp && (
                    <a
                      href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/40 hover:border-green-400 dark:hover:border-green-600 transition-all group shadow-sm hover:shadow-md"
                    >
                      <div className="w-9 h-9 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800/60 transition-colors flex-shrink-0">
                        <i className="fab fa-whatsapp text-green-600 dark:text-green-400 text-sm"></i>
                      </div>
                      <span
                        className="text-gray-700 dark:text-gray-200 font-medium text-sm"
                        dir="ltr"
                      >
                        {contact.whatsapp}
                      </span>
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
                      <span className="text-gray-700 dark:text-gray-200 font-medium text-sm">
                        LinkedIn Profile
                      </span>
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
                      <span className="text-gold-600 dark:text-gold-400 font-bold text-sm">
                        منصة العمل الخاصة بي
                      </span>
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center md:text-right">
                  تعذّر تحميل بيانات التواصل
                </p>
              )}
            </div>
          </div>

          {/* ── AMJ Copyright ── */}
          <div className="mt-14 sm:mt-20 pt-6 border-t border-gray-100 dark:border-primary-900/40 text-center">
            <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm flex items-center justify-center gap-2 flex-wrap">
              <span>جميع الحقوق محفوظة</span>
              <span className="text-primary-600 dark:text-primary-400 font-bold">
                ©
              </span>
              <span>{new Date().getFullYear()}</span>
              <span className="inline-flex items-center gap-1.5 font-bold text-primary-700 dark:text-primary-300">
                <img
                  src={amjLogo}
                  alt="AMJ"
                  className="w-5 h-5 rounded-md object-cover inline-block"
                />
                أحمد الجاسم — AMJ
              </span>
            </p>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes amjFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-14px); }
        }
        @keyframes amjPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.06); }
        }
        @keyframes amjSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes amjSweep {
          0%   { transform: translateX(-100%); }
          60%, 100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}

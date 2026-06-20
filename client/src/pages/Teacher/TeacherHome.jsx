import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function TeacherHome() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get('/api/students').then(r => setStudents(r.data)).catch(() => {});
    axios.get('/api/classes').then(r => {
      const myClasses = r.data.filter(c => c.teacher?._id === user?.id || c.teacher === user?.id);
      setClasses(myClasses);
    }).catch(() => {});
  }, []);

  const filtered = students.filter(s => !search || s.name.includes(search));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">أهلاً، {user?.name}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">لوحة المعلومات العامة</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 p-5 text-center card-hover dark:border dark:border-primary-900/40">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-school text-primary-700 dark:text-primary-400 text-xl"></i>
          </div>
          <p className="text-3xl font-bold text-primary-700 dark:text-primary-400">{classes.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">فصولي</p>
        </div>
        <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 p-5 text-center card-hover dark:border dark:border-primary-900/40">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-user-graduate text-blue-700 dark:text-blue-400 text-xl"></i>
          </div>
          <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{students.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">طلابي</p>
        </div>
        <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 p-5 text-center card-hover col-span-2 md:col-span-1 dark:border dark:border-primary-900/40">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-check-circle text-green-700 dark:text-green-400 text-xl"></i>
          </div>
          <p className="text-3xl font-bold text-green-700 dark:text-green-400">{students.filter(s => s.status === 'active').length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">طلاب نشطون</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 p-5 dark:border dark:border-primary-900/40">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 dark:text-gray-100 text-lg"><i className="fas fa-users text-primary-600 dark:text-primary-400 ml-2"></i>قائمة الطلاب</h2>
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="البحث بالاسم..."
          className="w-full border border-gray-300 dark:border-primary-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm mb-4 bg-white dark:bg-[#0d1a10] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600"
        />
        <div className="space-y-2">
          {filtered.map(s => (
            <div key={s._id} className="border border-gray-100 dark:border-primary-900/40 rounded-xl p-4 cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              onClick={() => setSelected(selected?._id === s._id ? null : s)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-primary-700 dark:text-primary-400 text-sm"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{s.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{s.assignedClass?.name || 'بدون فصل'}</p>
                  </div>
                </div>
                <i className={`fas fa-chevron-${selected?._id === s._id ? 'up' : 'down'} text-gray-400 dark:text-gray-500 text-xs`}></i>
              </div>
              {selected?._id === s._id && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-primary-900/40" dir="rtl">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                    {s.age && (
                      <div className="bg-gray-50 dark:bg-[#0d1a10] rounded-xl p-3 flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-birthday-cake text-blue-600 dark:text-blue-400 text-xs"></i>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-400 dark:text-gray-500">العمر</p>
                          <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">{s.age} سنة</p>
                        </div>
                      </div>
                    )}
                    {s.guardianName && (
                      <div className="bg-gray-50 dark:bg-[#0d1a10] rounded-xl p-3 flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-user-shield text-purple-600 dark:text-purple-400 text-xs"></i>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-400 dark:text-gray-500">ولي الأمر</p>
                          <p className="font-bold text-gray-800 dark:text-gray-100 text-sm truncate">{s.guardianName}</p>
                        </div>
                      </div>
                    )}
                    {s.assignedClass?.name && (
                      <div className="bg-gray-50 dark:bg-[#0d1a10] rounded-xl p-3 flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-chalkboard text-primary-600 dark:text-primary-400 text-xs"></i>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-400 dark:text-gray-500">الصف</p>
                          <p className="font-bold text-gray-800 dark:text-gray-100 text-sm truncate">{s.assignedClass.name}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contact buttons row */}
                  {(s.phone || s.whatsapp || s.guardianPhone) && (
                    <div className="flex flex-wrap gap-2">
                      {s.phone && (
                        <a href={`tel:${s.phone}`}
                          className="flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                          dir="ltr">
                          <i className="fas fa-phone"></i>
                          <span>{s.phone}</span>
                        </a>
                      )}
                      {s.guardianPhone && (
                        <a href={`tel:${s.guardianPhone}`}
                          className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                          dir="ltr">
                          <i className="fas fa-phone-alt"></i>
                          <span>{s.guardianPhone}</span>
                          <span className="text-blue-400 dark:text-blue-500 font-normal" dir="rtl">(ولي الأمر)</span>
                        </a>
                      )}
                      {s.whatsapp && (
                        <a href={`https://wa.me/${s.whatsapp.replace(/\D/g,'')}`}
                          target="_blank" rel="noreferrer"
                          className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                          dir="ltr">
                          <i className="fab fa-whatsapp text-base"></i>
                          <span>{s.whatsapp}</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-8 text-gray-400 dark:text-gray-500"><i className="fas fa-user-graduate text-4xl mb-2"></i><p>لا توجد نتائج</p></div>}
        </div>
      </div>
    </div>
  );
}

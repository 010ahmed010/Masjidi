import React, { useEffect, useState } from 'react';
import Header from '../../components/shared/Header';
import Footer from '../../components/shared/Footer';
import axios from 'axios';

export default function AttendancePage() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isRequestedDate, setIsRequestedDate] = useState(true);

  useEffect(() => {
    axios.get('/api/classes').then(r => setClasses(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedClass || !selectedDate) return;
    setLoading(true);
    setIsRequestedDate(true);
    axios.get(`/api/attendance?classId=${selectedClass}&date=${selectedDate}`)
      .then(async res => {
        const found = res.data[0] || null;
        if (found) {
          setAttendance(found);
          setRecords(found.records || []);
          setIsRequestedDate(true);
        } else {
          const latest = await axios.get(`/api/attendance?classId=${selectedClass}`)
            .catch(() => ({ data: [] }));
          const lastRecord = latest.data[0] || null;
          setAttendance(lastRecord);
          setRecords(lastRecord?.records || []);
          setIsRequestedDate(false);
        }
      })
      .catch(() => { setAttendance(null); setRecords([]); })
      .finally(() => setLoading(false));
  }, [selectedClass, selectedDate]);

  const filtered = records.filter(r => {
    const nameMatch = !search || r.student?.name?.includes(search);
    const statusMatch = !statusFilter || r.status === statusFilter;
    return nameMatch && statusMatch;
  });

  const today = new Date().toISOString().split('T')[0];
  const isToday = attendance ? new Date(attendance.date).toISOString().split('T')[0] === today : false;

  const statusLabel = (s) => s === 'present' ? 'حاضر' : s === 'absent' ? 'غائب' : 'معذور';
  const statusColor = (s) => s === 'present'
    ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
    : s === 'absent'
    ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
    : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400';

  const inputCls = "w-full border border-gray-300 dark:border-primary-800 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-[#0d1a10] text-gray-800 dark:text-gray-100";

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Header />
      <main className="flex-1">
        <div className="gradient-islamic islamic-pattern py-12 sm:py-16 text-center text-white px-4">
          <h1 className="text-2xl sm:text-4xl font-bold mb-3">سجل الحضور والغياب</h1>
          <p className="text-primary-200">تتبع حضور الطلاب بسهولة</p>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 p-6 mb-6 dark:border dark:border-primary-900/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  <i className="fas fa-chalkboard ml-1 text-primary-600"></i>اختر الصف
                </label>
                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className={inputCls}>
                  <option value="">-- اختر الصف --</option>
                  {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  <i className="fas fa-calendar ml-1 text-primary-600"></i>التاريخ
                </label>
                <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  <i className="fas fa-search ml-1 text-primary-600"></i>بحث عن طالب
                </label>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="اسم الطالب..."
                  className={`${inputCls} placeholder-gray-400 dark:placeholder-gray-600`} />
              </div>
            </div>
            <div className="mt-4 flex gap-2 flex-wrap">
              {['', 'present', 'absent', 'excused'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${statusFilter === s
                    ? 'bg-primary-700 text-white'
                    : 'bg-gray-100 dark:bg-primary-900/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-primary-800/50'}`}>
                  {s === '' ? 'الكل' : statusLabel(s)}
                </button>
              ))}
            </div>
          </div>

          {!selectedClass ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500">
              <i className="fas fa-chalkboard-teacher text-5xl mb-4"></i>
              <p className="text-lg">الرجاء اختيار الصف الدراسي</p>
            </div>
          ) : loading ? (
            <div className="text-center py-16 text-primary-600">
              <i className="fas fa-spinner fa-spin text-4xl mb-3"></i>
              <p>جاري التحميل...</p>
            </div>
          ) : !attendance ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500 bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:border dark:border-primary-900/50">
              <i className="fas fa-calendar-times text-5xl mb-4"></i>
              <p className="text-lg">لا توجد سجلات حضور لهذا الصف بعد</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 overflow-hidden dark:border dark:border-primary-900/50">
              {/* Date label banner — shown when displaying a fallback day */}
              {!isRequestedDate && (
                <div className="px-5 py-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 flex items-center gap-2" dir="rtl">
                  <i className="fas fa-clock text-amber-500"></i>
                  <p className="text-sm text-amber-700 dark:text-amber-400 font-semibold">
                    لا توجد سجلات للتاريخ المحدد — يُعرض آخر يوم مسجَّل
                  </p>
                </div>
              )}

              <div className="p-4 border-b dark:border-primary-900/50 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="font-bold text-primary-800 dark:text-gray-100 text-lg">{attendance.class?.name}</h2>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Date badge */}
                  {isToday ? (
                    <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 px-3 py-1 rounded-full font-bold">
                      <i className="fas fa-circle ml-1" style={{fontSize:'6px', verticalAlign:'middle'}}></i>اليوم
                    </span>
                  ) : (
                    <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-3 py-1 rounded-full font-bold">
                      <i className="fas fa-calendar-day ml-1"></i>
                      {new Date(attendance.date).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  )}
                  <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                    حاضر: {records.filter(r => r.status === 'present').length}
                  </span>
                  <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-xs font-semibold">
                    غائب: {records.filter(r => r.status === 'absent').length}
                  </span>
                  <span className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-semibold">
                    معذور: {records.filter(r => r.status === 'excused').length}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-[#111f14]">
                    <tr>
                      <th className="text-center p-3 font-semibold text-gray-700 dark:text-gray-300">#</th>
                      <th className="text-center p-3 font-semibold text-gray-700 dark:text-gray-300">اسم الطالب</th>
                      <th className="text-center p-3 font-semibold text-gray-700 dark:text-gray-300">الحالة</th>
                      <th className="text-center p-3 font-semibold text-gray-700 dark:text-gray-300">ملاحظة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, i) => (
                      <tr key={i} className="border-t dark:border-primary-900/50 hover:bg-gray-50 dark:hover:bg-primary-900/20 transition-colors">
                        <td className="p-3 text-center text-gray-500 dark:text-gray-400">{i + 1}</td>
                        <td className="p-3 text-center font-semibold text-gray-800 dark:text-gray-100">{r.student?.name || 'طالب محذوف'}</td>
                        <td className="p-3 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(r.status)}`}>
                            {statusLabel(r.status)}
                          </span>
                        </td>
                        <td className="p-3 text-center text-gray-500 dark:text-gray-400">{r.note || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="text-center py-8 text-gray-400 dark:text-gray-500">لا توجد نتائج</div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

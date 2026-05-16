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

  useEffect(() => {
    axios.get('/api/classes').then(r => setClasses(r.data)).catch(() => {});
  }, []);

  const fetchAttendance = async () => {
    if (!selectedClass || !selectedDate) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/attendance?classId=${selectedClass}&date=${selectedDate}`);
      const found = res.data[0] || null;
      setAttendance(found);
      setRecords(found?.records || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (selectedClass && selectedDate) fetchAttendance();
  }, [selectedClass, selectedDate]);

  const filtered = records.filter(r => {
    const nameMatch = !search || r.student?.name?.includes(search);
    const statusMatch = !statusFilter || r.status === statusFilter;
    return nameMatch && statusMatch;
  });

  const statusLabel = (s) => s === 'present' ? 'حاضر' : s === 'absent' ? 'غائب' : 'معذور';
  const statusColor = (s) => s === 'present'
    ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
    : s === 'absent'
    ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
    : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400';

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Header />
      <main className="flex-1">
        <div className="gradient-islamic islamic-pattern py-16 text-center text-white">
          <h1 className="text-4xl font-bold mb-3">سجل الحضور والغياب</h1>
          <p className="text-primary-200">تتبع حضور الطلاب بسهولة</p>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 p-6 mb-6 dark:border dark:border-primary-900/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  <i className="fas fa-chalkboard ml-1 text-primary-600"></i>اختر الفصل
                </label>
                <select
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                  className="w-full border border-gray-300 dark:border-primary-800 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-[#0d1a10] text-gray-800 dark:text-gray-100"
                >
                  <option value="">-- اختر الفصل --</option>
                  {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  <i className="fas fa-calendar ml-1 text-primary-600"></i>التاريخ
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full border border-gray-300 dark:border-primary-800 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-[#0d1a10] text-gray-800 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  <i className="fas fa-search ml-1 text-primary-600"></i>بحث عن طالب
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="اسم الطالب..."
                  className="w-full border border-gray-300 dark:border-primary-800 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-[#0d1a10] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600"
                />
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
              <p className="text-lg">الرجاء اختيار الفصل الدراسي</p>
            </div>
          ) : loading ? (
            <div className="text-center py-16 text-primary-600">
              <i className="fas fa-spinner fa-spin text-4xl mb-3"></i>
              <p>جاري التحميل...</p>
            </div>
          ) : !attendance ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500">
              <i className="fas fa-calendar-times text-5xl mb-4"></i>
              <p className="text-lg">لا توجد سجلات حضور لهذا اليوم</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 overflow-hidden dark:border dark:border-primary-900/50">
              <div className="p-4 border-b dark:border-primary-900/50 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="font-bold text-primary-800 dark:text-gray-100 text-lg">{attendance.class?.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(attendance.date).toLocaleDateString('ar-SA')}</p>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-3 py-1 rounded-full font-semibold">
                    حاضر: {records.filter(r => r.status === 'present').length}
                  </span>
                  <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 px-3 py-1 rounded-full font-semibold">
                    غائب: {records.filter(r => r.status === 'absent').length}
                  </span>
                  <span className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full font-semibold">
                    معذور: {records.filter(r => r.status === 'excused').length}
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-[#111f14]">
                    <tr>
                      <th className="text-right p-3 font-semibold text-gray-700 dark:text-gray-300">#</th>
                      <th className="text-right p-3 font-semibold text-gray-700 dark:text-gray-300">اسم الطالب</th>
                      <th className="text-right p-3 font-semibold text-gray-700 dark:text-gray-300">الحالة</th>
                      <th className="text-right p-3 font-semibold text-gray-700 dark:text-gray-300">ملاحظة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, i) => (
                      <tr key={i} className="border-t dark:border-primary-900/50 hover:bg-gray-50 dark:hover:bg-primary-900/20 transition-colors">
                        <td className="p-3 text-gray-500 dark:text-gray-400">{i + 1}</td>
                        <td className="p-3 font-semibold text-gray-800 dark:text-gray-100">{r.student?.name || 'طالب محذوف'}</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(r.status)}`}>
                            {statusLabel(r.status)}
                          </span>
                        </td>
                        <td className="p-3 text-gray-500 dark:text-gray-400">{r.note || '-'}</td>
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

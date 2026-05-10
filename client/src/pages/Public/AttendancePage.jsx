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
  const statusColor = (s) => s === 'present' ? 'bg-green-100 text-green-700' : s === 'absent' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="gradient-islamic islamic-pattern py-16 text-center text-white">
          <h1 className="text-4xl font-bold mb-3">سجل الحضور والغياب</h1>
          <p className="text-primary-200">تتبع حضور الطلاب بسهولة</p>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  <i className="fas fa-chalkboard ml-1 text-primary-600"></i>اختر الفصل
                </label>
                <select
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">-- اختر الفصل --</option>
                  {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  <i className="fas fa-calendar ml-1 text-primary-600"></i>التاريخ
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  <i className="fas fa-search ml-1 text-primary-600"></i>بحث عن طالب
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="اسم الطالب..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2 flex-wrap">
              {['', 'present', 'absent', 'excused'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${statusFilter === s ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {s === '' ? 'الكل' : statusLabel(s)}
                </button>
              ))}
            </div>
          </div>

          {!selectedClass ? (
            <div className="text-center py-16 text-gray-400">
              <i className="fas fa-chalkboard-teacher text-5xl mb-4"></i>
              <p className="text-lg">الرجاء اختيار الفصل الدراسي</p>
            </div>
          ) : loading ? (
            <div className="text-center py-16 text-primary-600">
              <i className="fas fa-spinner fa-spin text-4xl mb-3"></i>
              <p>جاري التحميل...</p>
            </div>
          ) : !attendance ? (
            <div className="text-center py-16 text-gray-400">
              <i className="fas fa-calendar-times text-5xl mb-4"></i>
              <p className="text-lg">لا توجد سجلات حضور لهذا اليوم</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="font-bold text-primary-800 text-lg">{attendance.class?.name}</h2>
                  <p className="text-sm text-gray-500">{new Date(attendance.date).toLocaleDateString('ar-SA')}</p>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                    حاضر: {records.filter(r => r.status === 'present').length}
                  </span>
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">
                    غائب: {records.filter(r => r.status === 'absent').length}
                  </span>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">
                    معذور: {records.filter(r => r.status === 'excused').length}
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-right p-3 font-semibold text-gray-700">#</th>
                      <th className="text-right p-3 font-semibold text-gray-700">اسم الطالب</th>
                      <th className="text-right p-3 font-semibold text-gray-700">الحالة</th>
                      <th className="text-right p-3 font-semibold text-gray-700">ملاحظة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, i) => (
                      <tr key={i} className="border-t hover:bg-gray-50 transition-colors">
                        <td className="p-3 text-gray-500">{i + 1}</td>
                        <td className="p-3 font-semibold text-gray-800">{r.student?.name || 'طالب محذوف'}</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(r.status)}`}>
                            {statusLabel(r.status)}
                          </span>
                        </td>
                        <td className="p-3 text-gray-500">{r.note || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="text-center py-8 text-gray-400">لا توجد نتائج</div>
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

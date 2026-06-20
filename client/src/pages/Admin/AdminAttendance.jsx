import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminAttendance() {
  const [records, setRecords] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [fallbackDate, setFallbackDate] = useState(null);

  useEffect(() => {
    axios.get('/api/classes').then(r => setClasses(r.data)).catch(() => {});
    fetchAttendance();
  }, []);

  const fetchAttendance = async (classId = selectedClass, date = selectedDate) => {
    setLoading(true);
    setFallbackDate(null);

    const params = [];
    if (classId) params.push(`classId=${classId}`);
    if (date) params.push(`date=${date}`);
    const url = '/api/attendance' + (params.length ? '?' + params.join('&') : '');
    const res = await axios.get(url).catch(() => ({ data: [] }));
    let data = res.data || [];

    if (data.length === 0 && date) {
      const fallback = await axios.get('/api/attendance' + (classId ? `?classId=${classId}` : '')).catch(() => ({ data: [] }));
      if (fallback.data?.length) {
        const lastDate = new Date(fallback.data[0].date);
        const lastDateStr = lastDate.toISOString().split('T')[0];
        const fallbackParams = classId ? `classId=${classId}&date=${lastDateStr}` : `date=${lastDateStr}`;
        const fallbackRes = await axios.get(`/api/attendance?${fallbackParams}`).catch(() => ({ data: [] }));
        data = fallbackRes.data || [];
        if (data.length) setFallbackDate(lastDate);
      }
    }

    setRecords(data);
    setLoading(false);
  };

  useEffect(() => { fetchAttendance(selectedClass, selectedDate); }, [selectedClass, selectedDate]);

  const today = new Date().toISOString().split('T')[0];
  const isToday = (dateStr) => new Date(dateStr).toISOString().split('T')[0] === today;

  const statusLabel = s => s === 'present' ? 'حاضر' : s === 'absent' ? 'غائب' : 'معذور';
  const statusColor = s => s === 'present'
    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    : s === 'absent'
    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';

  const inputCls = "w-full border border-gray-300 dark:border-primary-800 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-[#0d1a10] text-gray-800 dark:text-gray-100";

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6">
        <i className="fas fa-clipboard-check text-primary-600 dark:text-primary-400 ml-2"></i>مراقبة الحضور والغياب
      </h1>

      <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 dark:border dark:border-primary-900/40">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">الصف</label>
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className={inputCls}>
            <option value="">-- كل الصفوف --</option>
            {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">التاريخ</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className={inputCls} />
        </div>
      </div>

      {/* Fallback notice */}
      {fallbackDate && (
        <div className="mb-4 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-2" dir="rtl">
          <i className="fas fa-clock text-amber-500"></i>
          <span className="text-sm text-amber-700 dark:text-amber-400 font-semibold">
            لا توجد سجلات للتاريخ المحدد — يُعرض آخر يوم مسجَّل:&nbsp;
            {fallbackDate.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-primary-600">
          <i className="fas fa-spinner fa-spin text-4xl"></i>
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500 bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:border dark:border-primary-900/40">
          <i className="fas fa-clipboard text-5xl mb-3"></i>
          <p>لا توجد سجلات حضور</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map(r => {
            const recIsToday = isToday(r.date);
            return (
              <div key={r._id} className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 overflow-hidden dark:border dark:border-primary-900/40">
                <div className="p-4 bg-primary-50 dark:bg-primary-900/30 border-b dark:border-primary-900/40 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="font-bold text-primary-800 dark:text-gray-100">{r.class?.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">{r.teacher?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Date badge */}
                    {recIsToday ? (
                      <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 px-2.5 py-0.5 rounded-full font-bold">
                        <i className="fas fa-circle ml-1" style={{fontSize:'6px', verticalAlign:'middle'}}></i>اليوم
                      </span>
                    ) : (
                      <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 rounded-full font-bold">
                        <i className="fas fa-calendar-day ml-1"></i>
                        {new Date(r.date).toLocaleDateString('ar-SA', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    )}
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full text-xs">
                      حاضر: {r.records?.filter(s => s.status === 'present').length}
                    </span>
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full text-xs">
                      غائب: {r.records?.filter(s => s.status === 'absent').length}
                    </span>
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full text-xs">
                      معذور: {r.records?.filter(s => s.status === 'excused').length}
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-[#111f14]">
                      <tr>
                        <th className="text-right p-3 font-semibold text-gray-700 dark:text-gray-300">الطالب</th>
                        <th className="text-right p-3 font-semibold text-gray-700 dark:text-gray-300">الحالة</th>
                        <th className="text-right p-3 font-semibold text-gray-700 dark:text-gray-300">ملاحظة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {r.records?.map((rec, i) => (
                        <tr key={i} className="border-t dark:border-primary-900/40">
                          <td className="p-3 font-semibold text-gray-800 dark:text-gray-100">{rec.student?.name || '-'}</td>
                          <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full font-bold ${statusColor(rec.status)}`}>{statusLabel(rec.status)}</span></td>
                          <td className="p-3 text-gray-500 dark:text-gray-400 text-xs">{rec.note || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

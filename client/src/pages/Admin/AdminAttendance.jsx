import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminAttendance() {
  const [records, setRecords] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/classes').then(r => setClasses(r.data)).catch(() => {});
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    let url = '/api/attendance';
    const params = [];
    if (selectedClass) params.push(`classId=${selectedClass}`);
    if (selectedDate) params.push(`date=${selectedDate}`);
    if (params.length) url += '?' + params.join('&');
    const res = await axios.get(url).catch(() => ({ data: [] }));
    setRecords(res.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAttendance(); }, [selectedClass, selectedDate]);

  const statusLabel = s => s === 'present' ? 'حاضر' : s === 'absent' ? 'غائب' : 'معذور';
  const statusColor = s => s === 'present' ? 'bg-green-100 text-green-700' : s === 'absent' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700';

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6"><i className="fas fa-clipboard-check text-primary-600 ml-2"></i>مراقبة الحضور والغياب</h1>

      <div className="bg-white rounded-2xl shadow-md p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">الفصل</label>
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
            <option value="">-- كل الفصول --</option>
            {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">التاريخ</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-primary-600"><i className="fas fa-spinner fa-spin text-4xl"></i></div>
      ) : records.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-2xl shadow-md"><i className="fas fa-clipboard text-5xl mb-3"></i><p>لا توجد سجلات</p></div>
      ) : (
        <div className="space-y-4">
          {records.map(r => (
            <div key={r._id} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-4 bg-primary-50 border-b flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="font-bold text-primary-800">{r.class?.name}</span>
                  <span className="text-sm text-gray-500 mr-3">{r.teacher?.name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500">{new Date(r.date).toLocaleDateString('ar-SA')}</span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">حاضر: {r.records?.filter(s => s.status === 'present').length}</span>
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">غائب: {r.records?.filter(s => s.status === 'absent').length}</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr><th className="text-right p-3 font-semibold text-gray-700">الطالب</th><th className="text-right p-3 font-semibold text-gray-700">الحالة</th><th className="text-right p-3 font-semibold text-gray-700">ملاحظة</th></tr></thead>
                  <tbody>
                    {r.records?.map((rec, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-3 font-semibold text-gray-800">{rec.student?.name || '-'}</td>
                        <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full font-bold ${statusColor(rec.status)}`}>{statusLabel(rec.status)}</span></td>
                        <td className="p-3 text-gray-500 text-xs">{rec.note || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

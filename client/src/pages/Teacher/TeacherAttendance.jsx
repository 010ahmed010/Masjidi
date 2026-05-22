import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function TeacherAttendance() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [notes, setNotes] = useState({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    const teacherId = user._id || user.id;
    axios.get(`/api/classes?teacherId=${teacherId}`).then(r => setClasses(r.data)).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!selectedClass) { setStudents([]); setAttendance({}); setNotes({}); return; }
    const load = async () => {
      setFetching(true);
      try {
        const res = await axios.get(`/api/students?classId=${selectedClass}`);
        const stds = res.data;
        setStudents(stds);

        const attRes = await axios.get(`/api/attendance?classId=${selectedClass}&date=${selectedDate}`).catch(() => ({ data: [] }));
        const found = attRes.data[0];
        if (found && found.records?.length > 0) {
          const att = {}; const nts = {};
          found.records.forEach(r => {
            att[r.student?._id || r.student] = r.status;
            nts[r.student?._id || r.student] = r.note || '';
          });
          setAttendance(att); setNotes(nts);
        } else {
          const init = {};
          stds.forEach(s => { init[s._id] = 'present'; });
          setAttendance(init); setNotes({});
        }
      } catch {
        setStudents([]);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [selectedClass, selectedDate]);

  const handleSubmit = async () => {
    setLoading(true);
    const records = students.map(s => ({ student: s._id, status: attendance[s._id] || 'present', note: notes[s._id] || '' }));
    await axios.post('/api/attendance', { classId: selectedClass, date: selectedDate, records }).catch(() => {});
    setSaved(true); setTimeout(() => setSaved(false), 3000); setLoading(false);
  };

  const filtered = students.filter(s => !search || s.name.includes(search));
  const statusOptions = [
    ['present', 'حاضر', 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'],
    ['absent', 'غائب', 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'],
    ['excused', 'معذور', 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400']
  ];

  const inputCls = "w-full border border-gray-300 dark:border-primary-800 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-[#0d1a10] text-gray-800 dark:text-gray-100";

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6">
        <i className="fas fa-clipboard-check text-primary-600 dark:text-primary-400 ml-2"></i>تسجيل الحضور والغياب
      </h1>

      <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 p-5 mb-6 dark:border dark:border-primary-900/40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">الصف</label>
            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className={inputCls}>
              <option value="">-- اختر الصف --</option>
              {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">التاريخ</label>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">بحث</label>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="اسم الطالب..." className={inputCls} />
          </div>
        </div>

        {selectedClass && students.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => { const a = {}; students.forEach(s => a[s._id] = 'present'); setAttendance(a); }}
              className="text-xs px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-semibold hover:bg-green-200 dark:hover:bg-green-900/50">
              تحديد الكل حاضر
            </button>
            <button onClick={() => { const a = {}; students.forEach(s => a[s._id] = 'absent'); setAttendance(a); }}
              className="text-xs px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg font-semibold hover:bg-red-200 dark:hover:bg-red-900/50">
              تحديد الكل غائب
            </button>
          </div>
        )}
      </div>

      {!selectedClass ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500 bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:border dark:border-primary-900/40">
          <i className="fas fa-chalkboard-teacher text-5xl mb-3"></i>
          <p>اختر صفاً للبدء</p>
        </div>
      ) : fetching ? (
        <div className="text-center py-16 text-primary-500 bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:border dark:border-primary-900/40">
          <i className="fas fa-circle-notch fa-spin text-4xl mb-3"></i>
          <p>جاري تحميل الطلاب...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500 bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:border dark:border-primary-900/40">
          <i className="fas fa-user-graduate text-5xl mb-3"></i>
          <p>لا يوجد طلاب في هذا الصف</p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 overflow-hidden mb-4 dark:border dark:border-primary-900/40">
            <div className="p-4 bg-primary-50 dark:bg-primary-900/30 border-b dark:border-primary-900/40 flex items-center justify-between">
              <span className="font-bold text-primary-800 dark:text-gray-100">{filtered.length} طالب</span>
              <div className="flex gap-3 text-xs flex-wrap">
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                  حاضر: {Object.values(attendance).filter(v => v === 'present').length}
                </span>
                <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-full">
                  غائب: {Object.values(attendance).filter(v => v === 'absent').length}
                </span>
                <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full">
                  معذور: {Object.values(attendance).filter(v => v === 'excused').length}
                </span>
              </div>
            </div>
            <div className="divide-y dark:divide-primary-900/40">
              {filtered.map((s, i) => (
                <div key={s._id} className="p-4 flex items-center gap-4 flex-wrap hover:bg-gray-50 dark:hover:bg-primary-900/20 transition-colors">
                  <span className="text-gray-400 dark:text-gray-500 text-sm w-6">{i + 1}</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-100 flex-1 min-w-[120px]">{s.name}</span>
                  <div className="flex gap-2">
                    {statusOptions.map(([val, label, cls]) => (
                      <button key={val} onClick={() => setAttendance(prev => ({ ...prev, [s._id]: val }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${attendance[s._id] === val ? cls + ' ring-2 ring-offset-1 ring-current' : 'bg-gray-100 dark:bg-primary-900/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-primary-800/50'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                  {attendance[s._id] !== 'present' && (
                    <input type="text" placeholder="ملاحظة..." value={notes[s._id] || ''}
                      onChange={e => setNotes(prev => ({ ...prev, [s._id]: e.target.value }))}
                      className="border border-gray-300 dark:border-primary-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 min-w-[120px] bg-white dark:bg-[#0d1a10] text-gray-800 dark:text-gray-100" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {saved && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl p-3 text-sm font-semibold mb-4">
              <i className="fas fa-check-circle ml-2"></i>تم حفظ الحضور بنجاح!
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full sm:w-auto bg-primary-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-800 disabled:opacity-60">
            {loading ? <><i className="fas fa-spinner fa-spin ml-2"></i>جاري الحفظ...</> : <><i className="fas fa-save ml-2"></i>حفظ الحضور</>}
          </button>
        </>
      )}
    </div>
  );
}

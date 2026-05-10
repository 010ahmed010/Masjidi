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
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    axios.get('/api/classes').then(r => setClasses(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    const cls = classes.find(c => c._id === selectedClass);
    const clsStudents = cls?.students || [];
    setStudents(clsStudents);
    const init = {};
    clsStudents.forEach(s => { init[s._id || s] = 'present'; });
    setAttendance(init);
    setNotes({});
    loadExisting();
  }, [selectedClass, selectedDate]);

  const loadExisting = async () => {
    if (!selectedClass || !selectedDate) return;
    try {
      const res = await axios.get(`/api/attendance?classId=${selectedClass}&date=${selectedDate}`);
      const found = res.data[0];
      if (found) {
        const att = {}; const nts = {};
        found.records.forEach(r => { att[r.student?._id || r.student] = r.status; nts[r.student?._id || r.student] = r.note || ''; });
        setAttendance(att); setNotes(nts);
      }
    } catch {}
  };

  const fetchStudentsForClass = async (classId) => {
    const cls = classes.find(c => c._id === classId);
    if (cls?.students?.length > 0) {
      const res = await axios.get(`/api/students?classId=${classId}`).catch(() => ({ data: [] }));
      return res.data;
    }
    return [];
  };

  useEffect(() => {
    if (!selectedClass) return;
    const load = async () => {
      const stds = await fetchStudentsForClass(selectedClass);
      setStudents(stds);
      const init = {};
      stds.forEach(s => { if (!attendance[s._id]) init[s._id] = 'present'; });
      setAttendance(prev => ({ ...init, ...prev }));
    };
    load();
  }, [selectedClass]);

  const handleSubmit = async () => {
    setLoading(true);
    const records = students.map(s => ({ student: s._id, status: attendance[s._id] || 'present', note: notes[s._id] || '' }));
    await axios.post('/api/attendance', { classId: selectedClass, date: selectedDate, records }).catch(() => {});
    setSaved(true); setTimeout(() => setSaved(false), 3000); setLoading(false);
  };

  const filtered = students.filter(s => !search || s.name.includes(search));

  const statusOptions = [['present','حاضر','bg-green-100 text-green-700'],['absent','غائب','bg-red-100 text-red-700'],['excused','معذور','bg-yellow-100 text-yellow-700']];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6"><i className="fas fa-clipboard-check text-primary-600 ml-2"></i>تسجيل الحضور والغياب</h1>

      <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">الفصل</label>
            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
              <option value="">-- اختر الفصل --</option>
              {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">التاريخ</label>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">بحث</label>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="اسم الطالب..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
          </div>
        </div>

        {selectedClass && (
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => { const a = {}; students.forEach(s => a[s._id]='present'); setAttendance(a); }} className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200">تحديد الكل حاضر</button>
            <button onClick={() => { const a = {}; students.forEach(s => a[s._id]='absent'); setAttendance(a); }} className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200">تحديد الكل غائب</button>
          </div>
        )}
      </div>

      {!selectedClass ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl shadow-md"><i className="fas fa-chalkboard-teacher text-5xl mb-3"></i><p>اختر فصلاً للبدء</p></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl shadow-md"><i className="fas fa-user-graduate text-5xl mb-3"></i><p>لا يوجد طلاب في هذا الفصل</p></div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-4">
            <div className="p-4 bg-primary-50 border-b flex items-center justify-between">
              <span className="font-bold text-primary-800">{filtered.length} طالب</span>
              <div className="flex gap-3 text-xs">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">حاضر: {Object.values(attendance).filter(v => v === 'present').length}</span>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">غائب: {Object.values(attendance).filter(v => v === 'absent').length}</span>
              </div>
            </div>
            <div className="divide-y">
              {filtered.map((s, i) => (
                <div key={s._id} className="p-4 flex items-center gap-4 flex-wrap">
                  <span className="text-gray-400 text-sm w-6">{i + 1}</span>
                  <span className="font-semibold text-gray-800 flex-1 min-w-[120px]">{s.name}</span>
                  <div className="flex gap-2">
                    {statusOptions.map(([val, label, cls]) => (
                      <button key={val} onClick={() => setAttendance(prev => ({...prev, [s._id]: val}))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${attendance[s._id] === val ? cls + ' ring-2 ring-offset-1 ring-current' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                  {attendance[s._id] !== 'present' && (
                    <input type="text" placeholder="ملاحظة..." value={notes[s._id] || ''} onChange={e => setNotes(prev => ({...prev, [s._id]: e.target.value}))}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 min-w-[120px]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {saved && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-sm font-semibold mb-4"><i className="fas fa-check-circle ml-2"></i>تم حفظ الحضور بنجاح!</div>}

          <button onClick={handleSubmit} disabled={loading} className="bg-primary-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-800 disabled:opacity-60">
            {loading ? <><i className="fas fa-spinner fa-spin ml-2"></i>جاري الحفظ...</> : <><i className="fas fa-save ml-2"></i>حفظ الحضور</>}
          </button>
        </>
      )}
    </div>
  );
}

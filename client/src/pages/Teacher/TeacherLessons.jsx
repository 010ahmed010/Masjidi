import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const DAYS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

export default function TeacherLessons() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff)).toISOString().split('T')[0];
  });
  const [days, setDays] = useState(DAYS.map(d => ({ day: d, time: '', topic: '', description: '', course: '' })));
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { axios.get('/api/classes').then(r => setClasses(r.data)).catch(() => {}); }, []);

  useEffect(() => {
    if (!selectedClass || !weekStart) return;
    axios.get(`/api/lessons?classId=${selectedClass}&weekStart=${weekStart}`)
      .then(r => {
        if (r.data[0]) {
          const existing = r.data[0].days;
          setDays(DAYS.map(d => existing.find(e => e.day === d) || { day: d, time: '', topic: '', description: '', course: '' }));
        } else {
          setDays(DAYS.map(d => ({ day: d, time: '', topic: '', description: '', course: '' })));
        }
      }).catch(() => {});
  }, [selectedClass, weekStart]);

  const updateDay = (index, field, value) => {
    setDays(prev => prev.map((d, i) => i === index ? { ...d, [field]: value } : d));
  };

  const handleSubmit = async () => {
    if (!selectedClass) return alert('اختر فصلاً أولاً');
    setLoading(true);
    await axios.post('/api/lessons', { classId: selectedClass, weekStart, days }).catch(() => {});
    setSaved(true); setTimeout(() => setSaved(false), 3000); setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6"><i className="fas fa-book-open text-primary-600 ml-2"></i>خطة الدروس الأسبوعية</h1>

      <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">الفصل</label>
            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
              <option value="">-- اختر الفصل --</option>
              {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">بداية الأسبوع</label>
            <input type="date" value={weekStart} onChange={e => setWeekStart(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {days.map((d, i) => (
          <div key={d.day} className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="px-5 py-3 bg-primary-50 border-b flex items-center gap-2">
              <i className="fas fa-calendar-day text-primary-600"></i>
              <span className="font-bold text-primary-800">{d.day}</span>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">الوقت</label>
                <input type="time" value={d.time} onChange={e => updateDay(i, 'time', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" dir="ltr" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">الدورة / المادة</label>
                <input type="text" value={d.course} onChange={e => updateDay(i, 'course', e.target.value)} placeholder="مثال: القرآن الكريم" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">موضوع الدرس</label>
                <input type="text" value={d.topic} onChange={e => updateDay(i, 'topic', e.target.value)} placeholder="موضوع الدرس لهذا اليوم..." className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">تفاصيل إضافية</label>
                <input type="text" value={d.description} onChange={e => updateDay(i, 'description', e.target.value)} placeholder="ملاحظات أو تفاصيل..." className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {saved && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-sm font-semibold mb-4"><i className="fas fa-check-circle ml-2"></i>تم حفظ خطة الدروس بنجاح!</div>}

      <button onClick={handleSubmit} disabled={loading || !selectedClass} className="bg-primary-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-800 disabled:opacity-60">
        {loading ? <><i className="fas fa-spinner fa-spin ml-2"></i>جاري الحفظ...</> : <><i className="fas fa-save ml-2"></i>حفظ خطة الدروس</>}
      </button>
    </div>
  );
}

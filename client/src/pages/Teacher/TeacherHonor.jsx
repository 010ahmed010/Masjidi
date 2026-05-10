import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function TeacherHonor() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [myNominations, setMyNominations] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    axios.get('/api/classes').then(r => setClasses(r.data)).catch(() => {});
    axios.get('/api/honors').then(r => setMyNominations(r.data.filter(h => h.teacher?._id === user?.id || h.teacher === user?.id))).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedClass) { setStudents([]); return; }
    axios.get(`/api/students?classId=${selectedClass}`).then(r => setStudents(r.data)).catch(() => {});
  }, [selectedClass]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await axios.post('/api/honors', { student: selectedStudent, class: selectedClass, reason });
      setSaved(true); setTimeout(() => setSaved(false), 3000);
      setSelectedStudent(''); setReason('');
      const res = await axios.get('/api/honors');
      setMyNominations(res.data.filter(h => h.teacher?._id === user?.id || h.teacher === user?.id));
    } catch (err) { alert(err.response?.data?.message || 'حدث خطأ'); }
    setLoading(false);
  };

  const statusColor = s => s === 'approved' ? 'bg-green-100 text-green-700' : s === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700';
  const statusLabel = s => s === 'approved' ? 'موافق عليه' : s === 'rejected' ? 'مرفوض' : 'في الانتظار';

  const getWeekStart = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6"><i className="fas fa-award text-gold-500 ml-2"></i>ترشيح الطلاب المتميزين</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="font-bold text-gray-800 text-lg mb-4"><i className="fas fa-star text-gold-500 ml-2"></i>ترشيح طالب متميز للأسبوع</h2>
            <p className="text-sm text-gray-500 mb-4">أسبوع: {getWeekStart().toLocaleDateString('ar-SA')} وما بعده</p>

            {saved && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-sm font-semibold mb-4"><i className="fas fa-check-circle ml-2"></i>تم الترشيح بنجاح! ينتظر موافقة المدير.</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">الفصل</label>
                <select required value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
                  <option value="">-- اختر الفصل --</option>
                  {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">الطالب المتميز</label>
                <select required value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" disabled={!selectedClass}>
                  <option value="">-- اختر الطالب --</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">سبب الترشيح</label>
                <textarea rows={3} required value={reason} onChange={e => setReason(e.target.value)} placeholder="اذكر سبب تميز هذا الطالب..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"></textarea>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gold-500 text-white py-3 rounded-xl font-bold hover:bg-gold-600 disabled:opacity-60">
                {loading ? <><i className="fas fa-spinner fa-spin ml-2"></i>جاري الإرسال...</> : <><i className="fas fa-award ml-2"></i>إرسال الترشيح</>}
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="font-bold text-gray-800 text-lg mb-4"><i className="fas fa-list text-primary-600 ml-2"></i>ترشيحاتي السابقة</h2>
            <div className="space-y-3">
              {myNominations.map(h => (
                <div key={h._id} className={`border rounded-xl p-4 ${h.status === 'approved' ? 'border-green-200 bg-green-50' : h.status === 'rejected' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-800">{h.student?.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${statusColor(h.status)}`}>{statusLabel(h.status)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{h.class?.name}</p>
                  {h.reason && <p className="text-sm text-gray-600 italic">"{h.reason}"</p>}
                  <p className="text-xs text-gray-400 mt-2">{new Date(h.createdAt).toLocaleDateString('ar-SA')}</p>
                </div>
              ))}
              {myNominations.length === 0 && <div className="text-center py-8 text-gray-400"><i className="fas fa-award text-4xl mb-2"></i><p>لا توجد ترشيحات بعد</p></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminCertificates() {
  const [certs, setCerts] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ student: '', title: '', description: '', status: 'pending', notes: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAll();
    axios.get('/api/students').then(r => setStudents(r.data)).catch(() => {});
  }, []);

  const fetchAll = () => axios.get('/api/certificates').then(r => setCerts(r.data)).catch(() => {});
  const openAdd = () => { setEditing(null); setForm({ student: '', title: '', description: '', status: 'pending', notes: '' }); setShowModal(true); };
  const openEdit = (c) => { setEditing(c); setForm({ student: c.student?._id || '', title: c.title, description: c.description || '', status: c.status, notes: c.notes || '' }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editing) await axios.put(`/api/certificates/${editing._id}`, form);
      else await axios.post('/api/certificates', form);
      setShowModal(false); fetchAll();
    } catch (err) { alert(err.response?.data?.message || 'حدث خطأ'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد؟')) return;
    await axios.delete(`/api/certificates/${id}`); fetchAll();
  };

  const statusColor = s => s === 'issued' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : s === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
  const statusLabel = s => s === 'issued' ? 'صادرة' : s === 'delivered' ? 'مسلّمة' : 'قيد الإعداد';

  const inputCls = "w-full border border-gray-300 dark:border-primary-800 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-[#0d1a10] text-gray-800 dark:text-gray-100";
  const labelCls = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100"><i className="fas fa-certificate text-gold-500 ml-2"></i>إدارة الشهادات</h1>
        <button onClick={openAdd} className="bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-800 text-sm"><i className="fas fa-plus ml-1"></i>إصدار شهادة</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certs.map(c => (
          <div key={c._id} className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 p-5 card-hover dark:border dark:border-primary-900/40">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gold-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <i className="fas fa-certificate text-gold-500 text-xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100">{c.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{c.student?.name}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${statusColor(c.status)}`}>{statusLabel(c.status)}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(c.issuedAt).toLocaleDateString('ar-SA')}</span>
            </div>
            {c.notes && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{c.notes}</p>}
            <div className="flex gap-2">
              <button onClick={() => openEdit(c)} className="flex-1 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg py-1.5 text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20"><i className="fas fa-edit ml-1"></i>تعديل</button>
              <button onClick={() => handleDelete(c._id)} className="flex-1 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg py-1.5 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-900/20"><i className="fas fa-trash ml-1"></i>حذف</button>
            </div>
          </div>
        ))}
        {certs.length === 0 && <div className="col-span-3 text-center py-12 text-gray-400 dark:text-gray-500 bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:border dark:border-primary-900/40"><i className="fas fa-certificate text-5xl mb-3"></i><p>لا توجد شهادات</p></div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-2xl dark:shadow-black/60 w-full max-w-md dark:border dark:border-primary-800/50">
            <div className="p-6 border-b dark:border-primary-900/40 flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">{editing ? 'تعديل شهادة' : 'إصدار شهادة جديدة'}</h2>
              <button onClick={() => setShowModal(false)}><i className="fas fa-times text-gray-400 dark:text-gray-500"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className={labelCls}>الطالب</label>
                <select required value={form.student} onChange={e => setForm({...form, student: e.target.value})} className={inputCls}>
                  <option value="">-- اختر طالب --</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>عنوان الشهادة</label>
                <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>الوصف</label>
                <textarea rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={inputCls + " resize-none"}></textarea>
              </div>
              <div>
                <label className={labelCls}>الحالة</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className={inputCls}>
                  <option value="pending">قيد الإعداد</option>
                  <option value="issued">صادرة</option>
                  <option value="delivered">مسلّمة</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>ملاحظات</label>
                <input type="text" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className={inputCls} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="flex-1 bg-primary-700 text-white py-2.5 rounded-xl font-bold hover:bg-primary-800 disabled:opacity-60">{loading ? 'جاري الحفظ...' : 'حفظ'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 dark:bg-primary-900/40 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-primary-800/50">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

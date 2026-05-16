import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminClasses() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', courseName: '', courseImage: '', description: '', teacher: '', showOnHomePage: true });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchAll(); }, []);
  const fetchAll = async () => {
    const [c, t] = await Promise.allSettled([axios.get('/api/classes'), axios.get('/api/teachers')]);
    setClasses(c.value?.data || []); setTeachers(t.value?.data || []);
  };

  const openAdd = () => { setEditing(null); setForm({ name: '', courseName: '', courseImage: '', description: '', teacher: '', showOnHomePage: true }); setShowModal(true); };
  const openEdit = (c) => { setEditing(c); setForm({ name: c.name, courseName: c.courseName || '', courseImage: c.courseImage || '', description: c.description || '', teacher: c.teacher?._id || '', showOnHomePage: c.showOnHomePage !== false }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editing) await axios.put(`/api/classes/${editing._id}`, form);
      else await axios.post('/api/classes', form);
      setShowModal(false); fetchAll();
    } catch (err) { alert(err.response?.data?.message || 'حدث خطأ'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد؟')) return;
    await axios.delete(`/api/classes/${id}`); fetchAll();
  };

  const inputCls = "w-full border border-gray-300 dark:border-primary-800 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-[#0d1a10] text-gray-800 dark:text-gray-100";
  const labelCls = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100"><i className="fas fa-school text-primary-600 dark:text-primary-400 ml-2"></i>إدارة الفصول والدورات</h1>
        <button onClick={openAdd} className="bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-800 text-sm"><i className="fas fa-plus ml-1"></i>إضافة فصل</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map(c => (
          <div key={c._id} className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 overflow-hidden card-hover dark:border dark:border-primary-900/40">
            <div className="h-32 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
              {c.courseImage ? <img src={c.courseImage} alt={c.name} className="w-full h-full object-cover" /> : <i className="fas fa-book-quran text-white text-5xl opacity-50"></i>}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">{c.name}</h3>
              {c.courseName && <p className="text-sm text-gold-600 dark:text-gold-400 font-semibold mb-1">{c.courseName}</p>}
              {c.teacher && <p className="text-xs text-gray-500 dark:text-gray-400 mb-1"><i className="fas fa-user ml-1"></i>{c.teacher.name}</p>}
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3"><i className="fas fa-users ml-1"></i>{c.students?.length || 0} طالب</p>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs px-2 py-1 rounded-full ${c.showOnHomePage ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                  {c.showOnHomePage ? 'يظهر في الموقع' : 'مخفي'}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(c)} className="flex-1 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg py-1.5 text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20"><i className="fas fa-edit ml-1"></i>تعديل</button>
                <button onClick={() => handleDelete(c._id)} className="flex-1 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg py-1.5 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-900/20"><i className="fas fa-trash ml-1"></i>حذف</button>
              </div>
            </div>
          </div>
        ))}
        {classes.length === 0 && <div className="col-span-3 text-center py-12 text-gray-400 dark:text-gray-500 bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:border dark:border-primary-900/40"><i className="fas fa-school text-5xl mb-3"></i><p>لا توجد فصول بعد</p></div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-2xl dark:shadow-black/60 w-full max-w-md max-h-[90vh] overflow-y-auto dark:border dark:border-primary-800/50">
            <div className="p-6 border-b dark:border-primary-900/40 flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">{editing ? 'تعديل فصل' : 'إضافة فصل جديد'}</h2>
              <button onClick={() => setShowModal(false)}><i className="fas fa-times text-gray-400 dark:text-gray-500"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[['name','اسم الفصل',true],['courseName','اسم الدورة',false],['courseImage','رابط صورة الدورة',false],['description','الوصف',false]].map(([k,l,req]) => (
                <div key={k}>
                  <label className={labelCls}>{l}</label>
                  <input type="text" required={req} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} className={inputCls} />
                </div>
              ))}
              <div>
                <label className={labelCls}>المعلم</label>
                <select value={form.teacher} onChange={e => setForm({...form, teacher: e.target.value})} className={inputCls}>
                  <option value="">-- اختر المعلم --</option>
                  {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="showHP" checked={form.showOnHomePage} onChange={e => setForm({...form, showOnHomePage: e.target.checked})} className="w-4 h-4 accent-primary-600" />
                <label htmlFor="showHP" className={labelCls + " mb-0"}>إظهار في الصفحة الرئيسية</label>
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

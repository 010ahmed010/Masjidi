import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', age: '', phone: '', whatsapp: '', guardianName: '', guardianPhone: '', assignedClass: '', assignedTeacher: '', status: 'active' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const [s, c, t] = await Promise.allSettled([
      axios.get('/api/students'),
      axios.get('/api/classes'),
      axios.get('/api/teachers'),
    ]);
    setStudents(s.value?.data || []);
    setClasses(c.value?.data || []);
    setTeachers(t.value?.data || []);
  };

  const openAdd = () => { setEditing(null); setForm({ name: '', age: '', phone: '', whatsapp: '', guardianName: '', guardianPhone: '', assignedClass: '', assignedTeacher: '', status: 'active' }); setShowModal(true); };
  const openEdit = (s) => { setEditing(s); setForm({ name: s.name, age: s.age || '', phone: s.phone || '', whatsapp: s.whatsapp || '', guardianName: s.guardianName || '', guardianPhone: s.guardianPhone || '', assignedClass: s.assignedClass?._id || '', assignedTeacher: s.assignedTeacher?._id || '', status: s.status }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editing) await axios.put(`/api/students/${editing._id}`, form);
      else await axios.post('/api/students', form);
      setShowModal(false); fetchAll();
    } catch (err) { alert(err.response?.data?.message || 'حدث خطأ'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    await axios.delete(`/api/students/${id}`); fetchAll();
  };

  const filtered = students.filter(s => !search || s.name.includes(search));

  const inputCls = "w-full border border-gray-300 dark:border-primary-800 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-[#0d1a10] text-gray-800 dark:text-gray-100";
  const labelCls = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100"><i className="fas fa-user-graduate text-primary-600 dark:text-primary-400 ml-2"></i>إدارة الطلاب</h1>
        <button onClick={openAdd} className="bg-primary-700 text-white px-4 sm:px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-800 text-sm">
          <i className="fas fa-plus ml-1"></i>إضافة طالب
        </button>
      </div>

      <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 mb-4 p-4 dark:border dark:border-primary-900/40">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="البحث بالاسم..." className={inputCls} />
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {filtered.map(s => (
          <div key={s._id} className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 p-4 dark:border dark:border-primary-900/40">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-primary-700 dark:text-primary-400 text-sm"></i>
                </div>
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">{s.name}</p>
                  {s.age && <p className="text-xs text-gray-500 dark:text-gray-400">العمر: {s.age}</p>}
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${s.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                {s.status === 'active' ? 'نشط' : 'غير نشط'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300 mb-3">
              {s.assignedClass?.name && <div><span className="text-gray-400">الفصل:</span> {s.assignedClass.name}</div>}
              {s.assignedTeacher?.name && <div><span className="text-gray-400">المعلم:</span> {s.assignedTeacher.name}</div>}
              {s.phone && <div dir="ltr"><span className="text-gray-400">📞</span> {s.phone}</div>}
              {s.guardianName && <div><span className="text-gray-400">ولي الأمر:</span> {s.guardianName}</div>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(s)} className="flex-1 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg py-1.5 text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20"><i className="fas fa-edit ml-1"></i>تعديل</button>
              <button onClick={() => handleDelete(s._id)} className="flex-1 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg py-1.5 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-900/20"><i className="fas fa-trash ml-1"></i>حذف</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-8 text-gray-400 dark:text-gray-500 bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:border dark:border-primary-900/40">لا توجد نتائج</div>}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 overflow-hidden dark:border dark:border-primary-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-[#111f14] border-b dark:border-primary-900/40">
              <tr>{['الاسم', 'العمر', 'الفصل', 'المعلم', 'الهاتف', 'الحالة', 'إجراءات'].map(h => <th key={h} className="text-right p-3 font-semibold text-gray-700 dark:text-gray-300">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s._id} className="border-t dark:border-primary-900/40 hover:bg-gray-50 dark:hover:bg-primary-900/20">
                  <td className="p-3 font-semibold text-gray-800 dark:text-gray-100">{s.name}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{s.age || '-'}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{s.assignedClass?.name || '-'}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{s.assignedTeacher?.name || '-'}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-300" dir="ltr">{s.phone || '-'}</td>
                  <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full font-bold ${s.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>{s.status === 'active' ? 'نشط' : 'غير نشط'}</span></td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(s)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 text-xs px-3 py-1 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"><i className="fas fa-edit ml-1"></i>تعديل</button>
                      <button onClick={() => handleDelete(s._id)} className="text-red-600 dark:text-red-400 hover:text-red-800 text-xs px-3 py-1 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"><i className="fas fa-trash ml-1"></i>حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-8 text-gray-400 dark:text-gray-500">لا توجد نتائج</div>}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-2xl dark:shadow-black/60 w-full max-w-lg max-h-[90vh] overflow-y-auto dark:border dark:border-primary-800/50">
            <div className="p-4 sm:p-6 border-b dark:border-primary-900/40 flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">{editing ? 'تعديل طالب' : 'إضافة طالب جديد'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"><i className="fas fa-times text-xl"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              {[['name','الاسم الكامل','text',true],['age','العمر','number',false],['phone','رقم الهاتف','text',false],['whatsapp','رقم الواتساب','text',false],['guardianName','اسم ولي الأمر','text',false],['guardianPhone','هاتف ولي الأمر','text',false]].map(([k,l,t,req]) => (
                <div key={k}>
                  <label className={labelCls}>{l}</label>
                  <input type={t} required={req} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} className={inputCls} />
                </div>
              ))}
              <div>
                <label className={labelCls}>الفصل</label>
                <select value={form.assignedClass} onChange={e => setForm({...form, assignedClass: e.target.value})} className={inputCls}>
                  <option value="">-- اختر الفصل --</option>
                  {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>المعلم</label>
                <select value={form.assignedTeacher} onChange={e => setForm({...form, assignedTeacher: e.target.value})} className={inputCls}>
                  <option value="">-- اختر المعلم --</option>
                  {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>الحالة</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className={inputCls}>
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>
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

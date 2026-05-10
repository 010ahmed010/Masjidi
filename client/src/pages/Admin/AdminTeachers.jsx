import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', whatsapp: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchTeachers(); }, []);
  const fetchTeachers = () => axios.get('/api/teachers').then(r => setTeachers(r.data)).catch(() => {});

  const openAdd = () => { setEditing(null); setForm({ name: '', email: '', password: '', phone: '', whatsapp: '' }); setShowModal(true); };
  const openEdit = (t) => { setEditing(t); setForm({ name: t.name, email: t.email, password: '', phone: t.phone || '', whatsapp: t.whatsapp || '' }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editing) await axios.put(`/api/teachers/${editing._id}`, form);
      else await axios.post('/api/teachers', form);
      setShowModal(false); fetchTeachers();
    } catch (err) { alert(err.response?.data?.message || 'حدث خطأ'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد؟')) return;
    await axios.delete(`/api/teachers/${id}`); fetchTeachers();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800"><i className="fas fa-chalkboard-teacher text-primary-600 ml-2"></i>إدارة المعلمين</h1>
        <button onClick={openAdd} className="bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-800 text-sm">
          <i className="fas fa-plus ml-1"></i>إضافة معلم
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map(t => (
          <div key={t._id} className="bg-white rounded-2xl shadow-md p-5 card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-primary-700 text-lg"></i>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{t.name}</h3>
                <p className="text-sm text-gray-500">{t.email}</p>
              </div>
            </div>
            {t.phone && <p className="text-sm text-gray-600 mb-1"><i className="fas fa-phone text-primary-600 ml-2"></i>{t.phone}</p>}
            {t.assignedClasses?.length > 0 && (
              <p className="text-sm text-gray-600 mb-3">
                <i className="fas fa-school text-primary-600 ml-2"></i>
                {t.assignedClasses.map(c => c.name).join('، ')}
              </p>
            )}
            <div className="flex gap-2">
              <button onClick={() => openEdit(t)} className="flex-1 text-blue-600 border border-blue-200 rounded-lg py-1.5 text-xs font-semibold hover:bg-blue-50">
                <i className="fas fa-edit ml-1"></i>تعديل
              </button>
              <button onClick={() => handleDelete(t._id)} className="flex-1 text-red-600 border border-red-200 rounded-lg py-1.5 text-xs font-semibold hover:bg-red-50">
                <i className="fas fa-trash ml-1"></i>حذف
              </button>
            </div>
          </div>
        ))}
        {teachers.length === 0 && <div className="col-span-3 text-center py-12 text-gray-400 bg-white rounded-2xl shadow-md"><i className="fas fa-chalkboard-teacher text-5xl mb-3"></i><p>لا توجد معلمون بعد</p></div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="font-bold text-lg">{editing ? 'تعديل معلم' : 'إضافة معلم جديد'}</h2>
              <button onClick={() => setShowModal(false)}><i className="fas fa-times text-gray-400"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[['name','الاسم','text',true],['email','البريد الإلكتروني','email',true],['password',editing?'كلمة المرور (اتركها فارغة للإبقاء)':'كلمة المرور','password',!editing],['phone','رقم الهاتف','text',false],['whatsapp','رقم الواتساب','text',false]].map(([k,l,t,req]) => (
                <div key={k}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{l}</label>
                  <input type={t} required={req} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="flex-1 bg-primary-700 text-white py-2.5 rounded-xl font-bold hover:bg-primary-800 disabled:opacity-60">{loading ? 'جاري الحفظ...' : 'حفظ'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-bold">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

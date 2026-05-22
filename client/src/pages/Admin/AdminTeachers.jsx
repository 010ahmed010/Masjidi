import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', username: '', password: '', phone: '', whatsapp: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchTeachers(); }, []);
  const fetchTeachers = () => axios.get('/api/teachers').then(r => setTeachers(r.data)).catch(() => {});

  const openAdd = () => { setEditing(null); setForm({ name: '', username: '', password: '', phone: '', whatsapp: '' }); setShowModal(true); };
  const openEdit = (t) => { setEditing(t); setForm({ name: t.name, username: t.username || '', password: '', phone: t.phone || '', whatsapp: t.whatsapp || '' }); setShowModal(true); };

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
    if (!confirm('هل أنت متأكد من حذف هذا المعلم؟')) return;
    await axios.delete(`/api/teachers/${id}`); fetchTeachers();
  };

  const fields = [
    { key: 'name',     label: 'الاسم الكامل',   type: 'text',     required: true },
    { key: 'username', label: 'اسم المستخدم',   type: 'text',     required: true },
    { key: 'password', label: editing ? 'كلمة المرور (اتركها فارغة للإبقاء)' : 'كلمة المرور', type: 'password', required: !editing },
    { key: 'phone',    label: 'رقم الهاتف',      type: 'text',     required: false },
    { key: 'whatsapp', label: 'رقم الواتساب',    type: 'text',     required: false },
  ];

  const inputCls = "w-full border border-gray-300 dark:border-primary-800 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-right bg-white dark:bg-[#0d1a10] text-gray-800 dark:text-gray-100";

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
          <i className="fas fa-chalkboard-teacher text-primary-600 dark:text-primary-400 ml-2"></i>إدارة المعلمين
        </h1>
        <button onClick={openAdd} className="bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-800 text-sm">
          <i className="fas fa-plus ml-1"></i>إضافة معلم
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map(t => (
          <div key={t._id} className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 p-5 card-hover dark:border dark:border-primary-900/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-primary-700 dark:text-primary-400 text-lg"></i>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100">{t.name}</h3>
                <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                  <i className="fas fa-user-tag ml-1 text-xs"></i>{t.username}
                </p>
              </div>
            </div>
            {t.phone && <p className="text-sm text-gray-600 dark:text-gray-300 mb-1"><i className="fas fa-phone text-primary-600 dark:text-primary-400 ml-2"></i>{t.phone}</p>}
            {t.assignedClasses?.length > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                <i className="fas fa-school text-primary-600 dark:text-primary-400 ml-2"></i>
                {t.assignedClasses.map(c => c.name).join('، ')}
              </p>
            )}
            <div className="flex gap-2 mt-3">
              <button onClick={() => openEdit(t)} className="flex-1 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg py-1.5 text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20">
                <i className="fas fa-edit ml-1"></i>تعديل
              </button>
              <button onClick={() => handleDelete(t._id)} className="flex-1 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg py-1.5 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-900/20">
                <i className="fas fa-trash ml-1"></i>حذف
              </button>
            </div>
          </div>
        ))}
        {teachers.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-400 dark:text-gray-500 bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:border dark:border-primary-900/40">
            <i className="fas fa-chalkboard-teacher text-5xl mb-3"></i>
            <p>لا يوجد معلمون بعد</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-2xl dark:shadow-black/60 w-full max-w-md max-h-[90vh] flex flex-col dark:border dark:border-primary-800/50">
            <div className="flex-shrink-0 px-5 py-4 border-b dark:border-primary-900/40 flex items-center justify-between rounded-t-2xl">
              <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">
                <i className={`fas ${editing ? 'fa-edit' : 'fa-user-plus'} text-primary-600 dark:text-primary-400 ml-2`}></i>
                {editing ? 'تعديل معلم' : 'إضافة معلم جديد'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {fields.map(({ key, label, type, required }) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {label}{required && <span className="text-red-500 mr-1">*</span>}
                    </label>
                    <input
                      type={key === 'phone' || key === 'whatsapp' ? 'tel' : type}
                      required={required}
                      value={form[key]}
                      onChange={e => setForm({ ...form, [key]: (key === 'phone' || key === 'whatsapp') ? e.target.value.replace(/[^\d+]/g, '') : e.target.value })}
                      className={inputCls}
                      placeholder={label}
                      dir={key === 'phone' || key === 'whatsapp' ? 'ltr' : undefined}
                    />
                  </div>
                ))}
              </div>
              <div className="flex-shrink-0 px-5 py-4 border-t dark:border-primary-900/40 flex gap-3">
                <button type="submit" disabled={loading} className="flex-1 bg-primary-700 text-white py-2.5 rounded-xl font-bold hover:bg-primary-800 disabled:opacity-60">
                  {loading ? <><i className="fas fa-spinner fa-spin ml-1"></i>جاري الحفظ...</> : 'حفظ'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 dark:bg-primary-900/40 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-primary-800/50">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

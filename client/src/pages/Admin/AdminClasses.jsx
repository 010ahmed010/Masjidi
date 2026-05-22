import React, { useEffect, useState } from 'react';
import axios from 'axios';

const emptyCourse = { name: '', image: '' };

export default function AdminClasses() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', courses: [{ ...emptyCourse }], description: '', teacher: '', showOnHomePage: true });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAll();
    window.addEventListener('focus', fetchAll);
    return () => window.removeEventListener('focus', fetchAll);
  }, []);
  const fetchAll = async () => {
    const [c, t] = await Promise.allSettled([axios.get('/api/classes'), axios.get('/api/teachers')]);
    setClasses(c.value?.data || []); setTeachers(t.value?.data || []);
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', courses: [{ ...emptyCourse }], description: '', teacher: '', showOnHomePage: true });
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    let courses = c.courses && c.courses.length > 0
      ? c.courses.map(x => ({ name: x.name || '', image: x.image || '' }))
      : c.courseName ? [{ name: c.courseName, image: c.courseImage || '' }] : [{ ...emptyCourse }];
    setForm({ name: c.name, courses, description: c.description || '', teacher: c.teacher?._id || '', showOnHomePage: c.showOnHomePage !== false });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    const payload = { ...form, courses: form.courses.filter(c => c.name.trim()) };
    if (!payload.teacher) delete payload.teacher;
    try {
      if (editing) await axios.put(`/api/classes/${editing._id}`, payload);
      else await axios.post('/api/classes', payload);
      setShowModal(false); fetchAll();
    } catch (err) { alert(err.response?.data?.message || 'حدث خطأ'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد؟')) return;
    await axios.delete(`/api/classes/${id}`); fetchAll();
  };

  const updateCourse = (idx, field, value) => {
    const updated = form.courses.map((c, i) => i === idx ? { ...c, [field]: value } : c);
    setForm({ ...form, courses: updated });
  };

  const addCourse = () => setForm({ ...form, courses: [...form.courses, { ...emptyCourse }] });

  const removeCourse = (idx) => {
    if (form.courses.length === 1) return;
    setForm({ ...form, courses: form.courses.filter((_, i) => i !== idx) });
  };

  const inputCls = "w-full border border-gray-300 dark:border-primary-800 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-[#0d1a10] text-gray-800 dark:text-gray-100";
  const labelCls = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100"><i className="fas fa-school text-primary-600 dark:text-primary-400 ml-2"></i>إدارة الصفوف والدورات</h1>
        <button onClick={openAdd} className="bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-800 text-sm"><i className="fas fa-plus ml-1"></i>إضافة صف</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map(c => {
          const displayCourses = c.courses && c.courses.length > 0 ? c.courses : (c.courseName ? [{ name: c.courseName, image: c.courseImage }] : []);
          const coverImage = displayCourses.find(x => x.image)?.image || null;
          return (
            <div key={c._id} className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 overflow-hidden card-hover dark:border dark:border-primary-900/40">
              <div className="h-32 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                {coverImage ? <img src={coverImage} alt={c.name} className="w-full h-full object-cover" /> : <i className="fas fa-book-quran text-white text-5xl opacity-50"></i>}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">{c.name}</h3>
                {displayCourses.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {displayCourses.map((course, i) => (
                      <span key={i} className="text-xs bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400 px-2 py-0.5 rounded-full font-semibold">{course.name}</span>
                    ))}
                  </div>
                )}
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
          );
        })}
        {classes.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-400 dark:text-gray-500 bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:border dark:border-primary-900/40">
            <i className="fas fa-school text-5xl mb-3"></i>
            <p>لا توجد صفوف بعد</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-2xl dark:shadow-black/60 w-full max-w-md max-h-[90vh] flex flex-col dark:border dark:border-primary-800/50">
            <div className="flex-shrink-0 px-5 py-4 border-b dark:border-primary-900/40 flex items-center justify-between rounded-t-2xl">
              <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">{editing ? 'تعديل صف' : 'إضافة صف جديد'}</h2>
              <button onClick={() => setShowModal(false)}><i className="fas fa-times text-gray-400 dark:text-gray-500"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                <div>
                  <label className={labelCls}>اسم الصف <span className="text-red-500">*</span></label>
                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputCls} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelCls + " mb-0"}>الدورات</label>
                    <button type="button" onClick={addCourse} className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-1">
                      <i className="fas fa-plus text-xs"></i> إضافة دورة
                    </button>
                  </div>
                  <div className="space-y-3">
                    {form.courses.map((course, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-[#0d1a10] border border-gray-200 dark:border-primary-800/50 rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-primary-700 dark:text-primary-400">دورة {idx + 1}</span>
                          {form.courses.length > 1 && (
                            <button type="button" onClick={() => removeCourse(idx)} className="text-red-400 hover:text-red-600 text-xs">
                              <i className="fas fa-times"></i>
                            </button>
                          )}
                        </div>
                        <div>
                          <label className={labelCls}>اسم الدورة</label>
                          <input type="text" value={course.name} onChange={e => updateCourse(idx, 'name', e.target.value)} className={inputCls} placeholder="مثال: حفظ القرآن الكريم" />
                        </div>
                        <div>
                          <label className={labelCls}>رابط صورة الدورة</label>
                          <input type="text" value={course.image} onChange={e => updateCourse(idx, 'image', e.target.value)} className={inputCls} placeholder="https://..." />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>الوصف</label>
                  <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={inputCls} />
                </div>

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
              </div>
              <div className="flex-shrink-0 px-5 py-4 border-t dark:border-primary-900/40 flex gap-3">
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

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', age: '', whatsapp: '', guardianName: '', guardianPhone: '', assignedClass: '', status: 'active' });
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const detailRef = useRef(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const [s, c] = await Promise.allSettled([
      axios.get('/api/students'),
      axios.get('/api/classes'),
    ]);
    setStudents(s.value?.data || []);
    setClasses(c.value?.data || []);
  };

  const openAdd = () => { setEditing(null); setForm({ name: '', age: '', whatsapp: '', guardianName: '', guardianPhone: '', assignedClass: '', status: 'active' }); setShowModal(true); };
  const openEdit = (s, e) => {
    e.stopPropagation();
    setEditing(s);
    setForm({ name: s.name, age: s.age || '', whatsapp: s.whatsapp || '', guardianName: s.guardianName || '', guardianPhone: s.guardianPhone || '', assignedClass: s.assignedClass?._id || '', status: s.status });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editing) await axios.put(`/api/students/${editing._id}`, form);
      else await axios.post('/api/students', form);
      setShowModal(false); fetchAll();
    } catch (err) { alert(err.response?.data?.message || 'حدث خطأ'); }
    setLoading(false);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    if (selectedStudent?._id === id) setSelectedStudent(null);
    await axios.delete(`/api/students/${id}`); fetchAll();
  };

  const handleSelectStudent = (s) => {
    if (selectedStudent?._id === s._id) {
      setSelectedStudent(null);
      return;
    }
    setSelectedStudent(s);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const filtered = students.filter(s => !search || s.name.includes(search));

  const inputCls = "w-full border border-gray-300 dark:border-primary-800 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-[#0d1a10] text-gray-800 dark:text-gray-100";
  const labelCls = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1";

  const waLink = (num) => {
    if (!num) return null;
    const clean = num.replace(/\D/g, '');
    return `https://wa.me/${clean}`;
  };

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
          <div
            key={s._id}
            onClick={() => handleSelectStudent(s)}
            className={`bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 p-4 dark:border cursor-pointer transition-all ${selectedStudent?._id === s._id ? 'dark:border-primary-500 border-primary-400 ring-2 ring-primary-400/40' : 'dark:border-primary-900/40'}`}
          >
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
              {s.guardianName && <div><span className="text-gray-400">ولي الأمر:</span> {s.guardianName}</div>}
            </div>
            <div className="flex gap-2">
              <button onClick={(e) => openEdit(s, e)} className="flex-1 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg py-1.5 text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20"><i className="fas fa-edit ml-1"></i>تعديل</button>
              <button onClick={(e) => handleDelete(s._id, e)} className="flex-1 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg py-1.5 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-900/20"><i className="fas fa-trash ml-1"></i>حذف</button>
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
              <tr>{['الاسم', 'العمر', 'الفصل', 'المعلم', 'الحالة', 'إجراءات'].map(h => <th key={h} className="text-right p-3 font-semibold text-gray-700 dark:text-gray-300">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr
                  key={s._id}
                  onClick={() => handleSelectStudent(s)}
                  className={`border-t dark:border-primary-900/40 cursor-pointer transition-colors ${selectedStudent?._id === s._id ? 'bg-primary-50 dark:bg-primary-900/30' : 'hover:bg-gray-50 dark:hover:bg-primary-900/20'}`}
                >
                  <td className="p-3 font-semibold text-gray-800 dark:text-gray-100">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-chevron-left text-xs text-primary-400 dark:text-primary-500"></i>
                      {s.name}
                    </div>
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{s.age || '-'}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{s.assignedClass?.name || '-'}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{s.assignedTeacher?.name || '-'}</td>
                  <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full font-bold ${s.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>{s.status === 'active' ? 'نشط' : 'غير نشط'}</span></td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={(e) => openEdit(s, e)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 text-xs px-3 py-1 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"><i className="fas fa-edit ml-1"></i>تعديل</button>
                      <button onClick={(e) => handleDelete(s._id, e)} className="text-red-600 dark:text-red-400 hover:text-red-800 text-xs px-3 py-1 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"><i className="fas fa-trash ml-1"></i>حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-8 text-gray-400 dark:text-gray-500">لا توجد نتائج</div>}
        </div>
      </div>

      {/* Student detail panel */}
      {selectedStudent && (
        <div ref={detailRef} className="mt-6 bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 overflow-hidden dark:border dark:border-primary-900/40">
          <div className="px-6 py-4 bg-gradient-to-l from-primary-700 to-primary-900 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-user-graduate text-white text-lg"></i>
              </div>
              <div>
                <p className="font-bold text-white text-lg">{selectedStudent.name}</p>
                <p className="text-primary-200 text-xs">{selectedStudent.assignedClass?.name || 'غير محدد الفصل'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${selectedStudent.status === 'active' ? 'bg-green-500/30 text-green-200' : 'bg-red-500/30 text-red-200'}`}>
                {selectedStudent.status === 'active' ? 'نشط' : 'غير نشط'}
              </span>
              <button onClick={() => setSelectedStudent(null)} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <i className="fas fa-times text-white text-sm"></i>
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Basic info */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b dark:border-primary-900/40 pb-2">
                <i className="fas fa-info-circle ml-1 text-primary-500"></i>المعلومات الأساسية
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-sort-numeric-up text-primary-600 dark:text-primary-400 text-xs"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">العمر</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{selectedStudent.age || 'غير محدد'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-school text-primary-600 dark:text-primary-400 text-xs"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">الفصل</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{selectedStudent.assignedClass?.name || 'غير محدد'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-chalkboard-teacher text-primary-600 dark:text-primary-400 text-xs"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">المعلم</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{selectedStudent.assignedTeacher?.name || 'غير محدد'}</p>
                </div>
              </div>
            </div>

            {/* Guardian / contact info */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b dark:border-primary-900/40 pb-2">
                <i className="fas fa-address-book ml-1 text-primary-500"></i>بيانات التواصل
              </h3>
              {selectedStudent.guardianName && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-user-shield text-blue-600 dark:text-blue-400 text-xs"></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">ولي الأمر</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{selectedStudent.guardianName}</p>
                  </div>
                </div>
              )}
              {selectedStudent.guardianPhone && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-phone text-green-600 dark:text-green-400 text-xs"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 dark:text-gray-500">هاتف ولي الأمر</p>
                    <a
                      href={`tel:${selectedStudent.guardianPhone}`}
                      className="text-sm font-semibold text-green-700 dark:text-green-400 hover:underline"
                      dir="ltr"
                    >
                      {selectedStudent.guardianPhone}
                    </a>
                  </div>
                </div>
              )}
              {selectedStudent.whatsapp && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fab fa-whatsapp text-emerald-600 dark:text-emerald-400 text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 dark:text-gray-500">واتساب ولي الأمر</p>
                    <a
                      href={waLink(selectedStudent.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                      dir="ltr"
                    >
                      {selectedStudent.whatsapp}
                    </a>
                  </div>
                </div>
              )}
              {!selectedStudent.guardianPhone && !selectedStudent.whatsapp && !selectedStudent.guardianName && (
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">لا توجد بيانات تواصل</p>
              )}
            </div>
          </div>

          <div className="px-6 pb-5 flex gap-3">
            <button
              onClick={(e) => openEdit(selectedStudent, e)}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              <i className="fas fa-edit ml-1"></i>تعديل بيانات الطالب
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-2xl dark:shadow-black/60 w-full max-w-lg max-h-[90vh] flex flex-col dark:border dark:border-primary-800/50">
            <div className="flex-shrink-0 px-5 py-4 border-b dark:border-primary-900/40 flex items-center justify-between rounded-t-2xl">
              <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">{editing ? 'تعديل طالب' : 'إضافة طالب جديد'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"><i className="fas fa-times text-xl"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                <div>
                  <label className={labelCls}>الاسم الكامل <span className="text-red-500">*</span></label>
                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>العمر</label>
                  <input type="number" min="1" max="100" value={form.age} onChange={e => setForm({...form, age: e.target.value.replace(/[^\d]/g, '')})} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>اسم ولي الأمر <span className="text-red-500">*</span></label>
                  <input type="text" required value={form.guardianName} onChange={e => setForm({...form, guardianName: e.target.value})} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>هاتف ولي الأمر <span className="text-red-500">*</span></label>
                  <input type="tel" required value={form.guardianPhone} onChange={e => setForm({...form, guardianPhone: e.target.value.replace(/[^\d+]/g, '')})} className={inputCls} placeholder="05xxxxxxxx" dir="ltr" />
                </div>
                <div>
                  <label className={labelCls}>واتساب ولي الأمر</label>
                  <input type="tel" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value.replace(/[^\d+]/g, '')})} className={inputCls} placeholder="05xxxxxxxx" dir="ltr" />
                </div>
                <div>
                  <label className={labelCls}>الفصل <span className="text-red-500">*</span></label>
                  <select required value={form.assignedClass} onChange={e => setForm({...form, assignedClass: e.target.value})} className={inputCls}>
                    <option value="">-- اختر الفصل --</option>
                    {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>الحالة</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className={inputCls}>
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                  </select>
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

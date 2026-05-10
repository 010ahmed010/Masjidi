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

  useEffect(() => {
    fetchAll();
  }, []);

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800"><i className="fas fa-user-graduate text-primary-600 ml-2"></i>إدارة الطلاب</h1>
        <button onClick={openAdd} className="bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-800 text-sm">
          <i className="fas fa-plus ml-1"></i>إضافة طالب
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md mb-4 p-4">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="البحث بالاسم..." className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>{['الاسم', 'العمر', 'الفصل', 'المعلم', 'الهاتف', 'الحالة', 'إجراءات'].map(h => <th key={h} className="text-right p-3 font-semibold text-gray-700">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-semibold text-gray-800">{s.name}</td>
                  <td className="p-3 text-gray-600">{s.age || '-'}</td>
                  <td className="p-3 text-gray-600">{s.assignedClass?.name || '-'}</td>
                  <td className="p-3 text-gray-600">{s.assignedTeacher?.name || '-'}</td>
                  <td className="p-3 text-gray-600" dir="ltr">{s.phone || '-'}</td>
                  <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full font-bold ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{s.status === 'active' ? 'نشط' : 'غير نشط'}</span></td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => openEdit(s)} className="text-blue-600 hover:text-blue-800 text-xs px-3 py-1 border border-blue-200 rounded-lg"><i className="fas fa-edit ml-1"></i>تعديل</button>
                    <button onClick={() => handleDelete(s._id)} className="text-red-600 hover:text-red-800 text-xs px-3 py-1 border border-red-200 rounded-lg"><i className="fas fa-trash ml-1"></i>حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-8 text-gray-400">لا توجد نتائج</div>}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-800">{editing ? 'تعديل طالب' : 'إضافة طالب جديد'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[['name','الاسم الكامل','text',true],['age','العمر','number',false],['phone','رقم الهاتف','text',false],['whatsapp','رقم الواتساب','text',false],['guardianName','اسم ولي الأمر','text',false],['guardianPhone','هاتف ولي الأمر','text',false]].map(([k,l,t,req]) => (
                <div key={k}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{l}</label>
                  <input type={t} required={req} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">الفصل</label>
                <select value={form.assignedClass} onChange={e => setForm({...form, assignedClass: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
                  <option value="">-- اختر الفصل --</option>
                  {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">المعلم</label>
                <select value={form.assignedTeacher} onChange={e => setForm({...form, assignedTeacher: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
                  <option value="">-- اختر المعلم --</option>
                  {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">الحالة</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="flex-1 bg-primary-700 text-white py-2.5 rounded-xl font-bold hover:bg-primary-800 disabled:opacity-60">{loading ? 'جاري الحفظ...' : 'حفظ'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-bold hover:bg-gray-200">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

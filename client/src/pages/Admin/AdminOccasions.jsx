import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminOccasions() {
  const [occasions, setOccasions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', image: '', active: true });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchOccasions(); }, []);
  const fetchOccasions = () => axios.get('/api/occasions').then(r => setOccasions(r.data)).catch(() => {});

  const openAdd = () => { setEditing(null); setForm({ title: '', description: '', image: '', active: true }); setShowModal(true); };
  const openEdit = (o) => { setEditing(o); setForm({ title: o.title, description: o.description || '', image: o.image || '', active: o.active }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editing) await axios.put(`/api/occasions/${editing._id}`, form);
      else await axios.post('/api/occasions', form);
      setShowModal(false); fetchOccasions();
    } catch (err) { alert(err.response?.data?.message || 'حدث خطأ'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد؟')) return;
    await axios.delete(`/api/occasions/${id}`); fetchOccasions();
  };

  const toggleActive = async (o) => {
    await axios.put(`/api/occasions/${o._id}`, { ...o, active: !o.active }); fetchOccasions();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800"><i className="fas fa-star-and-crescent text-primary-600 ml-2"></i>إدارة المناسبات</h1>
        <button onClick={openAdd} className="bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-800 text-sm"><i className="fas fa-plus ml-1"></i>إضافة مناسبة</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {occasions.map(o => (
          <div key={o._id} className="bg-white rounded-2xl shadow-md overflow-hidden card-hover">
            {o.image && <img src={o.image} alt={o.title} className="w-full h-40 object-cover" />}
            {!o.image && <div className="h-32 bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center"><i className="fas fa-star-and-crescent text-white text-4xl opacity-50"></i></div>}
            <div className="p-4">
              <h3 className="font-bold text-gray-800 mb-1">{o.title}</h3>
              {o.description && <p className="text-sm text-gray-600 mb-3">{o.description}</p>}
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${o.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{o.active ? 'نشطة' : 'مخفية'}</span>
                <button onClick={() => toggleActive(o)} className="text-xs text-primary-600 hover:underline">{o.active ? 'إخفاء' : 'إظهار'}</button>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(o)} className="flex-1 text-blue-600 border border-blue-200 rounded-lg py-1.5 text-xs font-semibold hover:bg-blue-50"><i className="fas fa-edit ml-1"></i>تعديل</button>
                <button onClick={() => handleDelete(o._id)} className="flex-1 text-red-600 border border-red-200 rounded-lg py-1.5 text-xs font-semibold hover:bg-red-50"><i className="fas fa-trash ml-1"></i>حذف</button>
              </div>
            </div>
          </div>
        ))}
        {occasions.length === 0 && <div className="col-span-3 text-center py-12 text-gray-400 bg-white rounded-2xl shadow-md"><i className="fas fa-star-and-crescent text-5xl mb-3"></i><p>لا توجد مناسبات</p></div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="font-bold text-lg">{editing ? 'تعديل مناسبة' : 'إضافة مناسبة'}</h2>
              <button onClick={() => setShowModal(false)}><i className="fas fa-times text-gray-400"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[['title','عنوان المناسبة',true],['description','الوصف',false],['image','رابط الصورة',false]].map(([k,l,req]) => (
                <div key={k}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{l}</label>
                  <input type="text" required={req} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
                </div>
              ))}
              <div className="flex items-center gap-3">
                <input type="checkbox" id="active" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})} className="w-4 h-4 accent-primary-600" />
                <label htmlFor="active" className="text-sm font-semibold text-gray-700">إظهار في الموقع</label>
              </div>
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

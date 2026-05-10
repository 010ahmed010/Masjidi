import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', type: 'news', published: true });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchNews(); }, []);
  const fetchNews = () => axios.get('/api/news/all').then(r => setNews(r.data)).catch(() => {});

  const openAdd = () => { setEditing(null); setForm({ title: '', content: '', type: 'news', published: true }); setShowModal(true); };
  const openEdit = (n) => { setEditing(n); setForm({ title: n.title, content: n.content || '', type: n.type, published: n.published }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editing) await axios.put(`/api/news/${editing._id}`, form);
      else await axios.post('/api/news', form);
      setShowModal(false); fetchNews();
    } catch (err) { alert(err.response?.data?.message || 'حدث خطأ'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد؟')) return;
    await axios.delete(`/api/news/${id}`); fetchNews();
  };

  const typeLabel = t => t === 'offer' ? 'عرض' : t === 'announcement' ? 'إعلان' : 'خبر';
  const typeColor = t => t === 'offer' ? 'bg-orange-100 text-orange-700' : t === 'announcement' ? 'bg-blue-100 text-blue-700' : 'bg-primary-100 text-primary-700';

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800"><i className="fas fa-newspaper text-primary-600 ml-2"></i>إدارة الأخبار والإعلانات</h1>
        <button onClick={openAdd} className="bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-800 text-sm"><i className="fas fa-plus ml-1"></i>إضافة</button>
      </div>

      <div className="space-y-3">
        {news.map(n => (
          <div key={n._id} className="bg-white rounded-2xl shadow-md p-5 flex items-start gap-4 card-hover">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${typeColor(n.type)}`}>{typeLabel(n.type)}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${n.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{n.published ? 'منشور' : 'مخفي'}</span>
                <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString('ar-SA')}</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{n.title}</h3>
              {n.content && <p className="text-sm text-gray-600 line-clamp-2">{n.content}</p>}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => openEdit(n)} className="text-blue-600 border border-blue-200 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-blue-50"><i className="fas fa-edit ml-1"></i>تعديل</button>
              <button onClick={() => handleDelete(n._id)} className="text-red-600 border border-red-200 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-red-50"><i className="fas fa-trash"></i></button>
            </div>
          </div>
        ))}
        {news.length === 0 && <div className="text-center py-12 text-gray-400 bg-white rounded-2xl shadow-md"><i className="fas fa-newspaper text-5xl mb-3"></i><p>لا توجد أخبار</p></div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="font-bold text-lg">{editing ? 'تعديل' : 'إضافة خبر'}</h2>
              <button onClick={() => setShowModal(false)}><i className="fas fa-times text-gray-400"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">العنوان</label>
                <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">المحتوى</label>
                <textarea rows={4} value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">النوع</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
                  <option value="news">خبر</option>
                  <option value="offer">عرض</option>
                  <option value="announcement">إعلان</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="pub" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} className="w-4 h-4 accent-primary-600" />
                <label htmlFor="pub" className="text-sm font-semibold text-gray-700">نشر في الموقع</label>
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

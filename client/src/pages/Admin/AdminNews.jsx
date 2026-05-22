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
  const typeColor = t => t === 'offer' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : t === 'announcement' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400';

  const inputCls = "w-full border border-gray-300 dark:border-primary-800 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-[#0d1a10] text-gray-800 dark:text-gray-100";
  const labelCls = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100"><i className="fas fa-newspaper text-primary-600 dark:text-primary-400 ml-2"></i>إدارة الأخبار والإعلانات</h1>
        <button onClick={openAdd} className="bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-800 text-sm"><i className="fas fa-plus ml-1"></i>إضافة</button>
      </div>

      <div className="space-y-3">
        {news.map(n => (
          <div key={n._id} className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 p-4 sm:p-5 card-hover dark:border dark:border-primary-900/40">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${typeColor(n.type)}`}>{typeLabel(n.type)}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${n.published ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>{n.published ? 'منشور' : 'مخفي'}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(n.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1 truncate">{n.title}</h3>
                {n.content && <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{n.content}</p>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(n)} className="text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg px-2 sm:px-3 py-1.5 text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20"><i className="fas fa-edit sm:ml-1"></i><span className="hidden sm:inline">تعديل</span></button>
                <button onClick={() => handleDelete(n._id)} className="text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg px-2 sm:px-3 py-1.5 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-900/20"><i className="fas fa-trash"></i></button>
              </div>
            </div>
          </div>
        ))}
        {news.length === 0 && <div className="text-center py-12 text-gray-400 dark:text-gray-500 bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:border dark:border-primary-900/40"><i className="fas fa-newspaper text-5xl mb-3"></i><p>لا توجد أخبار</p></div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-2xl dark:shadow-black/60 w-full max-w-md max-h-[90vh] flex flex-col dark:border dark:border-primary-800/50">
            <div className="flex-shrink-0 px-5 py-4 border-b dark:border-primary-900/40 flex items-center justify-between rounded-t-2xl">
              <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">{editing ? 'تعديل' : 'إضافة خبر'}</h2>
              <button onClick={() => setShowModal(false)}><i className="fas fa-times text-gray-400 dark:text-gray-500"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                <div>
                  <label className={labelCls}>العنوان <span className="text-red-500">*</span></label>
                  <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>المحتوى</label>
                  <textarea rows={4} value={form.content} onChange={e => setForm({...form, content: e.target.value})} className={inputCls + " resize-none"}></textarea>
                </div>
                <div>
                  <label className={labelCls}>النوع</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className={inputCls}>
                    <option value="news">خبر</option>
                    <option value="offer">عرض</option>
                    <option value="announcement">إعلان</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="pub" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} className="w-4 h-4 accent-primary-600" />
                  <label htmlFor="pub" className={labelCls + " mb-0"}>نشر في الموقع</label>
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

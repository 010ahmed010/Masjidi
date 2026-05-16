import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminHonors() {
  const [honors, setHonors] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchHonors(); }, [filter]);
  const fetchHonors = () => axios.get(`/api/honors?status=${filter}`).then(r => setHonors(r.data)).catch(() => {});

  const updateStatus = async (id, status) => {
    setLoading(true);
    await axios.put(`/api/honors/${id}`, { status });
    fetchHonors(); setLoading(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100"><i className="fas fa-award text-gold-500 ml-2"></i>إدارة لوحة الشرف</h1>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {[['pending','في الانتظار','bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400'],['approved','موافق عليها','bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'],['rejected','مرفوضة','bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400']].map(([v,l,cls]) => (
          <button key={v} onClick={() => setFilter(v)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === v ? cls + ' ring-2 ring-offset-1 ring-current' : 'bg-gray-100 dark:bg-primary-900/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-primary-800/50'}`}>{l}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {honors.map(h => (
          <div key={h._id} className={`bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 p-5 border-r-4 dark:border-r-4 ${h.status === 'approved' ? 'border-green-500' : h.status === 'rejected' ? 'border-red-400' : 'border-yellow-400'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gold-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <i className="fas fa-user-graduate text-gold-600 dark:text-gold-400 text-lg"></i>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100">{h.student?.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{h.class?.name} | {h.teacher?.name}</p>
              </div>
            </div>
            {h.reason && <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 italic bg-gray-50 dark:bg-[#111f14] p-3 rounded-xl">"{h.reason}"</p>}
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">{new Date(h.createdAt).toLocaleDateString('ar-SA')}</p>
            {h.status === 'pending' && (
              <div className="flex gap-2">
                <button onClick={() => updateStatus(h._id, 'approved')} disabled={loading} className="flex-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 py-2 rounded-xl text-xs font-bold hover:bg-green-200 dark:hover:bg-green-900/50">
                  <i className="fas fa-check ml-1"></i>قبول
                </button>
                <button onClick={() => updateStatus(h._id, 'rejected')} disabled={loading} className="flex-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 py-2 rounded-xl text-xs font-bold hover:bg-red-200 dark:hover:bg-red-900/50">
                  <i className="fas fa-times ml-1"></i>رفض
                </button>
              </div>
            )}
            {h.status !== 'pending' && (
              <button onClick={() => updateStatus(h._id, 'pending')} className="w-full border border-gray-200 dark:border-primary-800 text-gray-600 dark:text-gray-400 py-2 rounded-xl text-xs font-semibold hover:bg-gray-50 dark:hover:bg-primary-900/20">
                إعادة للانتظار
              </button>
            )}
          </div>
        ))}
        {honors.length === 0 && <div className="col-span-3 text-center py-12 text-gray-400 dark:text-gray-500 bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:border dark:border-primary-900/40"><i className="fas fa-award text-5xl mb-3"></i><p>لا توجد ترشيحات</p></div>}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminSettings() {
  const [form, setForm] = useState({ registrationOpen: true, siteName: 'مسجدي', siteDescription: '', footerText: '', logoUrl: '' });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { axios.get('/api/settings').then(r => setForm(r.data)).catch(() => {}); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    await axios.put('/api/settings', form).catch(() => {});
    setSaved(true); setTimeout(() => setSaved(false), 3000); setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6"><i className="fas fa-cog text-primary-600 ml-2"></i>الإعدادات العامة</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="font-bold text-gray-700 text-lg border-b pb-2">إعدادات الموقع</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">اسم الموقع</label>
            <input type="text" value={form.siteName || ''} onChange={e => setForm({...form, siteName: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">وصف الموقع</label>
            <textarea rows={2} value={form.siteDescription || ''} onChange={e => setForm({...form, siteDescription: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"></textarea>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">نص الفوتر</label>
            <input type="text" value={form.footerText || ''} onChange={e => setForm({...form, footerText: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">رابط الشعار</label>
            <input type="text" value={form.logoUrl || ''} onChange={e => setForm({...form, logoUrl: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-800">حالة التسجيل</p>
                <p className="text-sm text-gray-500">التحكم في قبول تسجيلات الطلاب الجدد</p>
              </div>
              <button
                type="button"
                onClick={() => setForm({...form, registrationOpen: !form.registrationOpen})}
                className={`relative w-14 h-7 rounded-full transition-colors ${form.registrationOpen ? 'bg-primary-600' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${form.registrationOpen ? 'translate-x-7' : 'translate-x-0.5'}`}></span>
              </button>
            </div>
            <p className={`text-xs mt-2 font-bold ${form.registrationOpen ? 'text-green-600' : 'text-red-600'}`}>
              {form.registrationOpen ? '✓ التسجيل مفتوح حالياً' : '✗ التسجيل مغلق حالياً'}
            </p>
          </div>
        </div>

        {saved && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-sm font-semibold"><i className="fas fa-check-circle ml-2"></i>تم الحفظ بنجاح!</div>}

        <button type="submit" disabled={loading} className="bg-primary-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-800 disabled:opacity-60">
          {loading ? <><i className="fas fa-spinner fa-spin ml-2"></i>جاري الحفظ...</> : <><i className="fas fa-save ml-2"></i>حفظ الإعدادات</>}
        </button>
      </form>
    </div>
  );
}

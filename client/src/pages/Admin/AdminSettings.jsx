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

  const inputCls = "w-full border border-gray-300 dark:border-primary-800 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-[#0d1a10] text-gray-800 dark:text-gray-100";
  const labelCls = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6"><i className="fas fa-cog text-primary-600 dark:text-primary-400 ml-2"></i>الإعدادات العامة</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 p-6 space-y-4 dark:border dark:border-primary-900/40">
            <h2 className="font-bold text-gray-700 dark:text-gray-200 text-lg border-b dark:border-primary-900/40 pb-2">إعدادات الموقع</h2>

            <div>
              <label className={labelCls}>اسم الموقع</label>
              <input type="text" value={form.siteName || ''} onChange={e => setForm({...form, siteName: e.target.value})} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>وصف الموقع</label>
              <textarea rows={2} value={form.siteDescription || ''} onChange={e => setForm({...form, siteDescription: e.target.value})} className={inputCls + " resize-none"}></textarea>
            </div>
            <div>
              <label className={labelCls}>نص الفوتر</label>
              <input type="text" value={form.footerText || ''} onChange={e => setForm({...form, footerText: e.target.value})} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>رابط الشعار</label>
              <input type="text" value={form.logoUrl || ''} onChange={e => setForm({...form, logoUrl: e.target.value})} className={inputCls} />
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-100">حالة التسجيل</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">التحكم في قبول تسجيلات الطلاب الجدد</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({...form, registrationOpen: !form.registrationOpen})}
                  className={`relative w-14 h-7 rounded-full transition-colors ${form.registrationOpen ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${form.registrationOpen ? 'translate-x-7' : 'translate-x-0.5'}`}></span>
                </button>
              </div>
              <p className={`text-xs mt-2 font-bold ${form.registrationOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {form.registrationOpen ? '✓ التسجيل مفتوح حالياً' : '✗ التسجيل مغلق حالياً'}
              </p>
            </div>
          </div>

          {saved && <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl p-3 text-sm font-semibold"><i className="fas fa-check-circle ml-2"></i>تم الحفظ بنجاح!</div>}

          <button type="submit" disabled={loading} className="w-full bg-primary-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-800 disabled:opacity-60">
            {loading ? <><i className="fas fa-spinner fa-spin ml-2"></i>جاري الحفظ...</> : <><i className="fas fa-save ml-2"></i>حفظ الإعدادات</>}
          </button>
        </form>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminContact() {
  const [form, setForm] = useState({ whatsapp: '', phone: '', email: '', masjidImage: '', mapsIframe: '', description: '', address: '', facebook: '', instagram: '', twitter: '' });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { axios.get('/api/contact').then(r => setForm(r.data)).catch(() => {}); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    await axios.put('/api/contact', form).catch(() => {});
    setSaved(true); setTimeout(() => setSaved(false), 3000); setLoading(false);
  };

  const fields = [
    ['whatsapp', 'رقم الواتساب', 'fas fa-whatsapp'],
    ['phone', 'رقم الهاتف', 'fas fa-phone'],
    ['email', 'البريد الإلكتروني', 'fas fa-envelope'],
    ['address', 'العنوان', 'fas fa-map-marker-alt'],
    ['masjidImage', 'رابط صورة المسجد', 'fas fa-image'],
    ['facebook', 'رابط فيسبوك', 'fab fa-facebook'],
    ['instagram', 'رابط إنستغرام', 'fab fa-instagram'],
    ['twitter', 'رابط تويتر', 'fab fa-twitter'],
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6"><i className="fas fa-address-book text-primary-600 ml-2"></i>إعدادات التواصل</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="font-bold text-gray-700 text-lg border-b pb-2">معلومات الاتصال</h2>
          {fields.map(([k, l, icon]) => (
            <div key={k}>
              <label className="block text-sm font-semibold text-gray-700 mb-1"><i className={`${icon} text-primary-600 ml-1`}></i>{l}</label>
              <input type="text" value={form[k] || ''} onChange={e => setForm({...form,[k]:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1"><i className="fas fa-info-circle text-primary-600 ml-1"></i>الوصف المختصر</label>
            <textarea rows={3} value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"></textarea>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1"><i className="fas fa-map text-primary-600 ml-1"></i>كود خريطة جوجل (iframe)</label>
            <textarea rows={3} value={form.mapsIframe || ''} onChange={e => setForm({...form, mapsIframe: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none font-mono text-xs" dir="ltr" placeholder='<iframe src="..." ...></iframe>'></textarea>
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

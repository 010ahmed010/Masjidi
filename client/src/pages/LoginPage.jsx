import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/teacher');
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-islamic islamic-pattern flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-mosque text-white text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-primary-800">مسجدي</h1>
          <p className="text-gray-500 mt-2">تسجيل الدخول إلى لوحة التحكم</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm text-center">
            <i className="fas fa-exclamation-circle ml-1"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">البريد الإلكتروني</label>
            <div className="relative">
              <i className="fas fa-envelope absolute right-3 top-3 text-gray-400"></i>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="w-full border border-gray-300 rounded-lg pr-10 pl-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-right"
                placeholder="admin@masjidy.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">كلمة المرور</label>
            <div className="relative">
              <i className="fas fa-lock absolute right-3 top-3 text-gray-400"></i>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                className="w-full border border-gray-300 rounded-lg pr-10 pl-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-right"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-700 text-white py-3 rounded-lg font-bold text-lg hover:bg-primary-800 transition-colors disabled:opacity-60"
          >
            {loading ? <><i className="fas fa-spinner fa-spin ml-2"></i>جاري الدخول...</> : <><i className="fas fa-sign-in-alt ml-2"></i>دخول</>}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p className="font-semibold mb-1"><i className="fas fa-info-circle text-primary-600 ml-1"></i>بيانات المدير الافتراضية:</p>
          <p>البريد: admin@masjidy.com</p>
          <p>كلمة المرور: admin123</p>
          <button
            onClick={async () => { await fetch('/api/auth/seed-admin', { method: 'POST' }); }}
            className="mt-2 text-primary-600 underline text-xs"
          >
            إنشاء حساب المدير (أول مرة فقط)
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logoLight from '../assets/logo/MasjidiDLightMode.png';
import logoDark from '../assets/logo/MasjidiDarkMode.png';

export default function LoginPage() {
  const { dark } = useTheme();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(form.username, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/teacher');
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في تسجيل الدخول، تأكد من البيانات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-islamic islamic-pattern flex items-center justify-center px-4">
      <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-2xl dark:shadow-black/60 p-8 w-full max-w-md dark:border dark:border-primary-800/50">
        <div className="text-center mb-8">
          <img src={dark ? logoDark : logoLight} alt="مسجدي" className="h-16 w-auto object-contain mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mt-2">تسجيل الدخول إلى لوحة التحكم</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg p-3 mb-4 text-sm text-center">
            <i className="fas fa-exclamation-circle ml-1"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">اسم المستخدم</label>
            <div className="relative">
              <i className="fas fa-user absolute right-3 top-3 text-gray-400 dark:text-gray-500"></i>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({...form, username: e.target.value})}
                className="w-full border border-gray-300 dark:border-primary-800 rounded-lg pr-10 pl-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-right bg-white dark:bg-[#0d1a10] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600"
                placeholder="أدخل اسم المستخدم"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">كلمة المرور</label>
            <div className="relative">
              <i className="fas fa-lock absolute right-3 top-3 text-gray-400 dark:text-gray-500"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                className="w-full border border-gray-300 dark:border-primary-800 rounded-lg pr-10 pl-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-right bg-white dark:bg-[#0d1a10] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600"
                placeholder="أدخل كلمة المرور"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                tabIndex={-1}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-700 text-white py-3 rounded-lg font-bold text-lg hover:bg-primary-800 transition-colors disabled:opacity-60"
          >
            {loading
              ? <><i className="fas fa-spinner fa-spin ml-2"></i>جاري الدخول...</>
              : <><i className="fas fa-sign-in-alt ml-2"></i>دخول</>
            }
          </button>
        </form>

        <div className="mt-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full bg-gray-100 dark:bg-primary-900/40 hover:bg-gray-200 dark:hover:bg-primary-800/50 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold transition-colors"
          >
            <i className="fas fa-home ml-1"></i>
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

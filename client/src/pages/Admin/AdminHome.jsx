import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminHome() {
  const [stats, setStats] = useState({ students: 0, teachers: 0, classes: 0, pendingHonors: 0, news: 0 });

  useEffect(() => {
    const load = async () => {
      const [students, teachers, classes, honors, news] = await Promise.allSettled([
        axios.get('/api/students'),
        axios.get('/api/teachers'),
        axios.get('/api/classes'),
        axios.get('/api/honors?status=pending'),
        axios.get('/api/news/all'),
      ]);
      setStats({
        students: students.value?.data?.length || 0,
        teachers: teachers.value?.data?.length || 0,
        classes: classes.value?.data?.length || 0,
        pendingHonors: honors.value?.data?.length || 0,
        news: news.value?.data?.length || 0,
      });
    };
    load();
  }, []);

  const cards = [
    { icon: 'fas fa-user-graduate', label: 'الطلاب', value: stats.students, color: 'bg-blue-500', link: '/admin/students' },
    { icon: 'fas fa-chalkboard-teacher', label: 'المعلمون', value: stats.teachers, color: 'bg-primary-600', link: '/admin/teachers' },
    { icon: 'fas fa-school', label: 'الفصول', value: stats.classes, color: 'bg-purple-500', link: '/admin/classes' },
    { icon: 'fas fa-award', label: 'موافقات الشرف المعلقة', value: stats.pendingHonors, color: 'bg-gold-500', link: '/admin/honors' },
    { icon: 'fas fa-newspaper', label: 'الأخبار', value: stats.news, color: 'bg-orange-500', link: '/admin/news' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">لوحة التحكم الرئيسية</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {cards.map(card => (
          <a key={card.label} href={card.link} className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-center text-center card-hover">
            <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center mb-3`}>
              <i className={`${card.icon} text-white text-xl`}></i>
            </div>
            <p className="text-3xl font-bold text-gray-800">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </a>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          <i className="fas fa-info-circle text-primary-600 ml-2"></i>
          مرحباً بك في لوحة التحكم
        </h2>
        <p className="text-gray-600 leading-relaxed">
          يمكنك من هنا إدارة جميع جوانب المعهد — من إدارة الطلاب والمعلمين والفصول، إلى التحكم في محتوى الموقع العام مثل الأخبار والمناسبات ولوحة الشرف.
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 p-4 rounded-xl">
            <i className="fas fa-users text-blue-600 mb-2 text-lg"></i>
            <p className="font-semibold text-gray-700">إدارة المستخدمين</p>
            <p className="text-gray-500">أضف الطلاب وعيّن المعلمين لفصولهم</p>
          </div>
          <div className="bg-primary-50 p-4 rounded-xl">
            <i className="fas fa-globe text-primary-600 mb-2 text-lg"></i>
            <p className="font-semibold text-gray-700">المحتوى العام</p>
            <p className="text-gray-500">تحكم في ما يظهر على الموقع للزوار</p>
          </div>
          <div className="bg-gold-50 p-4 rounded-xl">
            <i className="fas fa-clipboard-check text-gold-600 mb-2 text-lg"></i>
            <p className="font-semibold text-gray-700">متابعة المعلمين</p>
            <p className="text-gray-500">راجع سجلات الحضور وموافقات الشرف</p>
          </div>
        </div>
      </div>
    </div>
  );
}

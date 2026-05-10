import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function TeacherHome() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get('/api/students').then(r => setStudents(r.data)).catch(() => {});
    axios.get('/api/classes').then(r => {
      const myClasses = r.data.filter(c => c.teacher?._id === user?.id || c.teacher === user?.id);
      setClasses(myClasses);
    }).catch(() => {});
  }, []);

  const filtered = students.filter(s => !search || s.name.includes(search));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">أهلاً، {user?.name}</h1>
      <p className="text-gray-500 mb-6">لوحة المعلومات العامة</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-md p-5 text-center card-hover">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-school text-primary-700 text-xl"></i>
          </div>
          <p className="text-3xl font-bold text-primary-700">{classes.length}</p>
          <p className="text-sm text-gray-500 mt-1">فصولي</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5 text-center card-hover">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-user-graduate text-blue-700 text-xl"></i>
          </div>
          <p className="text-3xl font-bold text-blue-700">{students.length}</p>
          <p className="text-sm text-gray-500 mt-1">طلابي</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5 text-center card-hover col-span-2 md:col-span-1">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-check-circle text-green-700 text-xl"></i>
          </div>
          <p className="text-3xl font-bold text-green-700">{students.filter(s => s.status === 'active').length}</p>
          <p className="text-sm text-gray-500 mt-1">طلاب نشطون</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 text-lg"><i className="fas fa-users text-primary-600 ml-2"></i>قائمة الطلاب</h2>
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="البحث بالاسم..."
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm mb-4"
        />
        <div className="space-y-2">
          {filtered.map(s => (
            <div key={s._id} className="border border-gray-100 rounded-xl p-4 cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-colors"
              onClick={() => setSelected(selected?._id === s._id ? null : s)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-primary-700 text-sm"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.assignedClass?.name || 'بدون فصل'}</p>
                  </div>
                </div>
                <i className={`fas fa-chevron-${selected?._id === s._id ? 'up' : 'down'} text-gray-400 text-xs`}></i>
              </div>
              {selected?._id === s._id && (
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-sm">
                  {s.age && <div><span className="text-gray-500">العمر:</span> <span className="font-semibold">{s.age} سنة</span></div>}
                  {s.phone && (
                    <div><span className="text-gray-500">الهاتف:</span>
                      <a href={`tel:${s.phone}`} className="font-semibold text-primary-600 hover:underline mr-1" dir="ltr">{s.phone}</a>
                    </div>
                  )}
                  {s.whatsapp && (
                    <div><span className="text-gray-500">واتساب:</span>
                      <a href={`https://wa.me/${s.whatsapp?.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="font-semibold text-green-600 hover:underline mr-1" dir="ltr">{s.whatsapp}</a>
                    </div>
                  )}
                  {s.guardianName && <div><span className="text-gray-500">ولي الأمر:</span> <span className="font-semibold">{s.guardianName}</span></div>}
                  {s.guardianPhone && (
                    <div><span className="text-gray-500">هاتف ولي الأمر:</span>
                      <a href={`tel:${s.guardianPhone}`} className="font-semibold text-primary-600 hover:underline mr-1" dir="ltr">{s.guardianPhone}</a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-8 text-gray-400"><i className="fas fa-user-graduate text-4xl mb-2"></i><p>لا توجد نتائج</p></div>}
        </div>
      </div>
    </div>
  );
}

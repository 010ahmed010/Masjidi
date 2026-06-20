import React, { useEffect, useState } from 'react';
import axios from 'axios';

const fmt = (bytes) => {
  if (bytes === null || bytes === undefined) return '—';
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + units[i];
};

const collectionArabic = {
  users: 'المستخدمون',
  students: 'الطلاب',
  teachers: 'المعلمون',
  classes: 'الصفوف',
  attendances: 'الحضور',
  honors: 'الشرف',
  occasions: 'المناسبات',
  news: 'الأخبار',
  contacts: 'التواصل',
  certificates: 'الشهادات',
  lessons: 'خطط الدرس',
  settings: 'الإعدادات',
};

const collectionIcon = {
  users: 'fas fa-user-shield',
  students: 'fas fa-user-graduate',
  teachers: 'fas fa-chalkboard-teacher',
  classes: 'fas fa-school',
  attendances: 'fas fa-clipboard-check',
  honors: 'fas fa-award',
  occasions: 'fas fa-star-and-crescent',
  news: 'fas fa-newspaper',
  contacts: 'fas fa-address-book',
  certificates: 'fas fa-certificate',
  lessons: 'fas fa-book-open',
  settings: 'fas fa-cog',
};

const StatCard = ({ icon, iconColor, label, value, sub }) => (
  <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 dark:border dark:border-primary-900/40 p-5 flex items-start gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColor}`}>
      <i className={`${icon} text-xl`}></i>
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
      <p className="text-xl font-bold text-gray-800 dark:text-gray-100 truncate">{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

export default function AdminDatabase() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    const res = await axios.get('/api/database/stats').catch(e => e.response);
    if (!res || res.status >= 400) {
      setError('تعذّر جلب إحصائيات قاعدة البيانات');
    } else {
      setStats(res.data);
      setLastRefresh(new Date());
    }
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  const usedPct = stats?.fsTotalSize
    ? Math.min(100, ((stats.fsUsedSize / stats.fsTotalSize) * 100).toFixed(1))
    : null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
          <i className="fas fa-database text-primary-600 dark:text-primary-400 ml-2"></i>إحصائيات قاعدة البيانات
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          {lastRefresh && (
            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <i className="fas fa-sync-alt"></i>
              آخر تحديث: {lastRefresh.toLocaleTimeString('ar-SA')}
            </span>
          )}
          <button onClick={fetchStats} disabled={loading}
            className="flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors disabled:opacity-50">
            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
            تحديث
          </button>
        </div>
      </div>

      {loading && !stats ? (
        <div className="text-center py-20 text-primary-600 dark:text-primary-400">
          <i className="fas fa-spinner fa-spin text-5xl mb-4"></i>
          <p className="text-gray-500 dark:text-gray-400 mt-3">جارٍ تحميل البيانات...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:border dark:border-primary-900/40">
          <i className="fas fa-exclamation-triangle text-red-400 text-5xl mb-4"></i>
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
          <button onClick={fetchStats} className="mt-4 px-5 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
            إعادة المحاولة
          </button>
        </div>
      ) : stats && (
        <>
          {/* DB name banner */}
          <div className="bg-gradient-to-l from-primary-700 to-primary-900 dark:from-[#0d2210] dark:to-[#071510] rounded-2xl p-5 mb-6 flex items-center gap-4 shadow-lg">
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-leaf text-green-300 text-2xl"></i>
            </div>
            <div>
              <p className="text-primary-200 text-xs mb-0.5">اسم قاعدة البيانات</p>
              <p className="text-white text-xl font-bold">{stats.dbName}</p>
              <p className="text-primary-300 text-xs mt-1">MongoDB Atlas • Cluster0</p>
            </div>
          </div>

          {/* Key stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon="fas fa-layer-group"
              iconColor="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              label="عدد المجموعات"
              value={stats.collections}
              sub="Collection"
            />
            <StatCard
              icon="fas fa-file-alt"
              iconColor="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
              label="إجمالي السجلات"
              value={stats.objects?.toLocaleString('ar-SA')}
              sub="Document"
            />
            <StatCard
              icon="fas fa-hdd"
              iconColor="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
              label="البيانات المخزّنة"
              value={fmt(stats.dataSize)}
              sub="Data Size"
            />
            <StatCard
              icon="fas fa-search"
              iconColor="bg-gold-400/20 dark:bg-gold-500/10 text-gold-600 dark:text-gold-400"
              label="حجم الفهارس"
              value={fmt(stats.indexSize)}
              sub="Index Size"
            />
          </div>

          {/* Storage breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Sizes card */}
            <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 dark:border dark:border-primary-900/40 p-5">
              <h2 className="text-base font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                <i className="fas fa-chart-pie text-primary-500"></i> تفاصيل التخزين
              </h2>
              <div className="space-y-3">
                {[
                  { label: 'حجم البيانات', value: fmt(stats.dataSize), color: 'bg-blue-500' },
                  { label: 'مساحة التخزين المخصصة', value: fmt(stats.storageSize), color: 'bg-primary-500' },
                  { label: 'حجم الفهارس', value: fmt(stats.indexSize), color: 'bg-gold-500' },
                  { label: 'الحجم الإجمالي', value: fmt(stats.totalSize), color: 'bg-purple-500' },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-primary-900/30 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${row.color}`}></span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{row.label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-100 font-mono">{row.value}</span>
                  </div>
                ))}
                {stats.avgObjSize > 0 && (
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">متوسط حجم السجل</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-100 font-mono">{fmt(stats.avgObjSize)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Filesystem card */}
            <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 dark:border dark:border-primary-900/40 p-5">
              <h2 className="text-base font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                <i className="fas fa-server text-primary-500"></i> مساحة الخادم
              </h2>
              {stats.fsTotalSize ? (
                <>
                  <div className="space-y-3 mb-4">
                    {[
                      { label: 'المساحة الكلية', value: fmt(stats.fsTotalSize), color: 'bg-gray-400' },
                      { label: 'المستخدمة', value: fmt(stats.fsUsedSize), color: 'bg-red-500' },
                      { label: 'المتاحة', value: fmt(stats.fsTotalSize - stats.fsUsedSize), color: 'bg-primary-500' },
                    ].map(row => (
                      <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-primary-900/30 last:border-0">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${row.color}`}></span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">{row.label}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-100 font-mono">{row.value}</span>
                      </div>
                    ))}
                  </div>
                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>الاستخدام</span>
                      <span>{usedPct}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 dark:bg-primary-900/40 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${usedPct > 85 ? 'bg-red-500' : usedPct > 60 ? 'bg-amber-500' : 'bg-primary-500'}`}
                        style={{ width: `${usedPct}%` }}
                      ></div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
                  <i className="fas fa-cloud text-4xl mb-3 text-primary-300 dark:text-primary-700"></i>
                  <p className="text-sm text-center">يعمل على MongoDB Atlas المُدار</p>
                  <p className="text-xs text-center mt-1 text-gray-400">معلومات مساحة الخادم غير متاحة على الخطة المجانية</p>
                </div>
              )}
            </div>
          </div>

          {/* Collections table */}
          <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 dark:border dark:border-primary-900/40 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-primary-900/40">
              <h2 className="text-base font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <i className="fas fa-table text-primary-500"></i> تفاصيل المجموعات
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-[#111f14]">
                  <tr>
                    <th className="text-right p-3 font-semibold text-gray-600 dark:text-gray-300 pr-5">المجموعة</th>
                    <th className="text-center p-3 font-semibold text-gray-600 dark:text-gray-300">السجلات</th>
                    <th className="text-center p-3 font-semibold text-gray-600 dark:text-gray-300">حجم البيانات</th>
                    <th className="text-center p-3 font-semibold text-gray-600 dark:text-gray-300">التخزين</th>
                    <th className="text-center p-3 font-semibold text-gray-600 dark:text-gray-300">الفهارس</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.collectionDetails.map((col, i) => (
                    <tr key={col.name} className={`border-t dark:border-primary-900/40 hover:bg-gray-50 dark:hover:bg-primary-900/20 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/50 dark:bg-[#152318]/40'}`}>
                      <td className="p-3 pr-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i className={`${collectionIcon[col.name] || 'fas fa-database'} text-primary-600 dark:text-primary-400 text-xs`}></i>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-100">{collectionArabic[col.name] || col.name}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{col.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center font-bold text-gray-700 dark:text-gray-200">{col.count.toLocaleString('ar-SA')}</td>
                      <td className="p-3 text-center text-gray-600 dark:text-gray-300 font-mono text-xs">{fmt(col.dataSize)}</td>
                      <td className="p-3 text-center text-gray-600 dark:text-gray-300 font-mono text-xs">{fmt(col.storageSize)}</td>
                      <td className="p-3 text-center text-gray-600 dark:text-gray-300 font-mono text-xs">{fmt(col.indexSize)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

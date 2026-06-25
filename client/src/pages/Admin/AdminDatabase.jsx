import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FREE_TIER_MB = 512;
const FREE_TIER_BYTES = FREE_TIER_MB * 1024 * 1024;

const fmtBytes = (b) => {
  if (b === null || b === undefined) return '—';
  if (b === 0) return '0 B';
  const u = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(Math.max(b, 1)) / Math.log(1024));
  return (b / Math.pow(1024, i)).toFixed(2) + ' ' + u[i];
};

const fmtUptime = (s) => {
  if (!s) return '—';
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}ي ${h}س`;
  if (h > 0) return `${h}س ${m}د`;
  return `${m}د`;
};

const collectionArabic = {
  users: 'المستخدمون', students: 'الطلاب', teachers: 'المعلمون',
  classes: 'الصفوف', attendances: 'الحضور', honors: 'الشرف',
  occasions: 'المناسبات', news: 'الأخبار', contacts: 'التواصل',
  certificates: 'الشهادات', lessons: 'خطط الدرس', settings: 'الإعدادات',
};
const collectionIcon = {
  users: 'fas fa-user-shield', students: 'fas fa-user-graduate',
  teachers: 'fas fa-chalkboard-teacher', classes: 'fas fa-school',
  attendances: 'fas fa-clipboard-check', honors: 'fas fa-award',
  occasions: 'fas fa-star-and-crescent', news: 'fas fa-newspaper',
  contacts: 'fas fa-address-book', certificates: 'fas fa-certificate',
  lessons: 'fas fa-book-open', settings: 'fas fa-cog',
};

const MetricCard = ({ icon, iconBg, label, main, sub, badge }) => (
  <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 dark:border dark:border-primary-900/40 p-5">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
        <i className={`${icon} text-base`}></i>
      </div>
      {badge && <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-semibold">{badge}</span>}
    </div>
    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
    <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{main}</p>
    {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
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
      setError(res?.data?.message || 'تعذّر جلب إحصائيات قاعدة البيانات');
    } else {
      setStats(res.data);
      setLastRefresh(new Date());
    }
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  const usedBytes = stats?.storageSize || 0;
  const usedPct = Math.min(100, ((usedBytes / FREE_TIER_BYTES) * 100)).toFixed(2);
  const barColor = usedPct > 85 ? 'bg-red-500' : usedPct > 60 ? 'bg-amber-500' : 'bg-primary-500';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
          <i className="fas fa-database text-primary-600 dark:text-primary-400 ml-2"></i>إحصائيات قاعدة البيانات
        </h1>
        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <i className="fas fa-clock"></i>
              {lastRefresh.toLocaleTimeString('ar-SA')}
            </span>
          )}
          <button onClick={fetchStats} disabled={loading}
            className="flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors disabled:opacity-50">
            <i className={`fas fa-sync-alt text-xs ${loading ? 'fa-spin' : ''}`}></i>
            تحديث
          </button>
        </div>
      </div>

      {loading && !stats ? (
        <div className="text-center py-24 text-primary-600 dark:text-primary-400">
          <i className="fas fa-spinner fa-spin text-5xl mb-4"></i>
          <p className="text-gray-400 dark:text-gray-500 mt-3 text-sm">جارٍ تحميل البيانات من MongoDB...</p>
        </div>
      ) : error ? (
        <div className="text-center py-24 bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:border dark:border-primary-900/40">
          <i className="fas fa-exclamation-triangle text-red-400 text-5xl mb-4"></i>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <button onClick={fetchStats} className="px-5 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
            إعادة المحاولة
          </button>
        </div>
      ) : stats && (
        <>
          {/* ═══ STORAGE USAGE — THE MAIN CARD ═══ */}
          <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 dark:border dark:border-primary-900/40 p-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-primary-100 dark:bg-primary-900/40 rounded-xl flex items-center justify-center">
                  <i className="fas fa-hdd text-primary-600 dark:text-primary-400 text-lg"></i>
                </div>
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-100">استخدام التخزين</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">MongoDB Atlas · {stats.dbName} · الخطة المجانية M0</p>
                </div>
              </div>
              <div className="text-left" dir="ltr">
                <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{fmtBytes(usedBytes)}</span>
                <span className="text-gray-400 dark:text-gray-500 text-base"> / {FREE_TIER_MB} MB</span>
                <span className={`mr-2 text-xs font-bold px-2 py-0.5 rounded-full ${usedPct > 85 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'}`}>
                  {usedPct}%
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-4 bg-gray-100 dark:bg-primary-900/30 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                style={{ width: `${usedPct}%`, minWidth: usedBytes > 0 ? '4px' : '0' }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
              <span>0 B</span>
              <span className="text-primary-600 dark:text-primary-400 font-semibold">
                متاح: {fmtBytes(FREE_TIER_BYTES - usedBytes)}
              </span>
              <span>{FREE_TIER_MB} MB</span>
            </div>

            {/* Sub-breakdown */}
            <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-100 dark:border-primary-900/30">
              {[
                { label: 'حجم البيانات', value: fmtBytes(stats.dataSize), dot: 'bg-blue-500' },
                { label: 'مساحة التخزين', value: fmtBytes(stats.storageSize), dot: 'bg-primary-500' },
                { label: 'حجم الفهارس', value: fmtBytes(stats.indexSize), dot: 'bg-gold-500' },
              ].map(r => (
                <div key={r.label} className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className={`w-2 h-2 rounded-full ${r.dot}`}></span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{r.label}</span>
                  </div>
                  <p className="font-bold text-gray-800 dark:text-gray-100 text-sm font-mono">{r.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ METRICS ROW ═══ */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard
              icon="fas fa-plug"
              iconBg="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              label="الاتصالات الحالية"
              main={stats.connections?.current ?? '—'}
              sub={`متاح: ${stats.connections?.available ?? '—'}`}
              badge={stats.connections?.current != null ? 'نشط' : null}
            />
            <MetricCard
              icon="fas fa-file-alt"
              iconBg="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
              label="إجمالي السجلات"
              main={stats.objects ?? '—'}
              sub={`في ${stats.collections} مجموعة`}
            />
            <MetricCard
              icon="fas fa-clock"
              iconBg="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
              label="وقت التشغيل"
              main={fmtUptime(stats.uptime)}
              sub="منذ آخر إعادة تشغيل"
            />
            <MetricCard
              icon="fas fa-code-branch"
              iconBg="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
              label="إصدار MongoDB"
              main={stats.version ?? '—'}
              sub={stats.repl ? `Replica Set · ${stats.repl.setName}` : 'Standalone'}
            />
          </div>

          {/* ═══ NETWORK + OPS ═══ */}
          {(stats.network || stats.opcounters) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {stats.network && (
                <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 dark:border dark:border-primary-900/40 p-5">
                  <h2 className="font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2 text-sm">
                    <i className="fas fa-network-wired text-primary-500"></i> الشبكة (منذ بدء التشغيل)
                  </h2>
                  <div className="space-y-3">
                    {[
                      { label: 'البيانات الواردة', value: fmtBytes(stats.network.bytesIn), icon: 'fas fa-arrow-down', color: 'text-green-600 dark:text-green-400' },
                      { label: 'البيانات الصادرة', value: fmtBytes(stats.network.bytesOut), icon: 'fas fa-arrow-up', color: 'text-blue-600 dark:text-blue-400' },
                      { label: 'إجمالي الطلبات', value: stats.network.numRequests ?? '—', icon: 'fas fa-exchange-alt', color: 'text-purple-600 dark:text-purple-400' },
                    ].map(r => (
                      <div key={r.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-primary-900/30 last:border-0">
                        <div className="flex items-center gap-2">
                          <i className={`${r.icon} ${r.color} text-xs w-4 text-center`}></i>
                          <span className="text-sm text-gray-600 dark:text-gray-300">{r.label}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-100 font-mono">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stats.opcounters && (
                <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 dark:border dark:border-primary-900/40 p-5">
                  <h2 className="font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2 text-sm">
                    <i className="fas fa-bolt text-gold-500"></i> عمليات قاعدة البيانات (منذ بدء التشغيل)
                  </h2>
                  <div className="space-y-3">
                    {[
                      { label: 'قراءة (Query)', value: stats.opcounters.query, color: 'bg-blue-500' },
                      { label: 'إدراج (Insert)', value: stats.opcounters.insert, color: 'bg-primary-500' },
                      { label: 'تحديث (Update)', value: stats.opcounters.update, color: 'bg-amber-500' },
                      { label: 'حذف (Delete)', value: stats.opcounters.delete, color: 'bg-red-500' },
                    ].map(r => {
                      const total = (stats.opcounters.query || 0) + (stats.opcounters.insert || 0) + (stats.opcounters.update || 0) + (stats.opcounters.delete || 0);
                      const pct = total > 0 ? Math.round((r.value / total) * 100) : 0;
                      return (
                        <div key={r.label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600 dark:text-gray-300">{r.label}</span>
                            <span className="font-bold text-gray-700 dark:text-gray-200">{r.value ?? 0}</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 dark:bg-primary-900/30 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${r.color}`} style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ COLLECTIONS TABLE ═══ */}
          <div className="bg-white dark:bg-[#1a2d1e] rounded-2xl shadow-md dark:shadow-black/30 dark:border dark:border-primary-900/40 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-primary-900/40 flex items-center gap-2">
              <i className="fas fa-table text-primary-500"></i>
              <h2 className="font-bold text-gray-700 dark:text-gray-200">تفاصيل المجموعات</h2>
              <span className="mr-auto text-xs text-gray-400 dark:text-gray-500">{stats.collections} مجموعة</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-[#111f14]">
                  <tr>
                    <th className="text-right p-3 font-semibold text-gray-600 dark:text-gray-300 pr-5">المجموعة</th>
                    <th className="text-center p-3 font-semibold text-gray-600 dark:text-gray-300">عدد السجلات</th>
                    <th className="text-center p-3 font-semibold text-gray-600 dark:text-gray-300">النسبة من الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.collectionDetails.map((col, i) => {
                    const totalDocs = stats.objects || 1;
                    const colPct = totalDocs > 0 ? ((col.count / totalDocs) * 100).toFixed(1) : 0;
                    return (
                      <tr key={col.name} className={`border-t dark:border-primary-900/40 hover:bg-gray-50 dark:hover:bg-primary-900/20 transition-colors ${i % 2 === 1 ? 'bg-gray-50/40 dark:bg-[#152318]/30' : ''}`}>
                        <td className="p-3 pr-5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                              <i className={`${collectionIcon[col.name] || 'fas fa-database'} text-primary-600 dark:text-primary-400 text-xs`}></i>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{collectionArabic[col.name] || col.name}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{col.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center font-bold text-gray-700 dark:text-gray-200 text-base">{col.count}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-100 dark:bg-primary-900/30 rounded-full overflow-hidden">
                              <div className="h-full bg-primary-500 rounded-full" style={{ width: `${colPct}%` }}></div>
                            </div>
                            <span className="text-xs text-gray-400 dark:text-gray-500 w-10 text-left">{colPct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

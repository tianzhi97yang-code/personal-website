
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { RefreshCw, Users, Map, Smartphone, Eye } from 'lucide-react';

interface VisitorLog {
    id: string;
    ip: string;
    city: string;
    country: string;
    path: string;
    visited_at: string;
    user_agent: string;
}

const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) => (
    <div className="bg-white dark:bg-stone-800 p-6 rounded-3xl shadow-sm border border-warm-paper dark:border-stone-700 flex items-center gap-4">
        <div className={`p-3 rounded-full ${color} text-white`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-xs font-bold uppercase text-stone-400 tracking-wider">{label}</p>
            <p className="text-2xl font-serif font-bold text-deep-brown dark:text-stone-200">{value}</p>
        </div>
    </div>
);

const AnalyticsPage = () => {
    const [logs, setLogs] = useState<VisitorLog[]>([]);
    const [stats, setStats] = useState({ total: 0, topCountry: '-', topDevice: '-' });
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        setLoading(true);
        // Fetch more for stats
        const { data } = await supabase
            .from('visitor_logs')
            .select('*')
            .order('visited_at', { ascending: false })
            .limit(500);

        if (data) {
            setLogs(data);

            // Calculate Stats
            const countries: { [key: string]: number } = {};
            const devices: { [key: string]: number } = {};

            data.forEach(log => {
                // Country
                const c = log.country || 'Unknown';
                countries[c] = (countries[c] || 0) + 1;

                // Device (Simple heuristic)
                const ua = log.user_agent || '';
                let dev = 'Desktop';
                if (ua.includes('iPhone') || ua.includes('Android')) dev = 'Mobile';
                devices[dev] = (devices[dev] || 0) + 1;
            });

            const topCountry = Object.entries(countries).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
            const topDevice = Object.entries(devices).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

            setStats({
                total: data.length, // This is just the limit, ideally should be count query
                topCountry,
                topDevice
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-deep-brown dark:text-warm-cream">Visitor Insights</h2>
                    <p className="text-soft-brown dark:text-stone-400">Systematic analysis of your audience.</p>
                </div>
                <button onClick={fetchLogs} className="p-3 bg-white dark:bg-stone-700 rounded-full shadow-md hover:rotate-180 transition-transform">
                    <RefreshCw size={20} className="text-rose-500" />
                </button>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={Eye} label="Recent Visits (Logged)" value={stats.total} color="bg-rose-400" />
                <StatCard icon={Map} label="Top Region" value={stats.topCountry} color="bg-blue-400" />
                <StatCard icon={Smartphone} label="Common Device" value={stats.topDevice} color="bg-emerald-400" />
            </div>

            {/* Google Analytics Connected */}
            <div className="bg-white dark:bg-stone-800 rounded-3xl shadow-sm overflow-hidden border border-warm-paper dark:border-stone-700">
                <div className="p-6 border-b border-stone-100 dark:border-stone-700">
                    <h3 className="font-bold text-lg text-deep-brown dark:text-stone-200">Detailed Access Log</h3>
                </div>
                <div className="overflow-x-auto max-h-[600px]">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-stone-50 dark:bg-stone-900 z-10 shadow-sm">
                            <tr className="text-xs font-bold uppercase text-stone-500">
                                <th className="p-4">Time</th>
                                <th className="p-4">Location</th>
                                <th className="p-4">System Info</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 dark:divide-stone-700">
                            {logs.map(log => (
                                <tr key={log.id} className="hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors text-sm">
                                    <td className="p-4 text-soft-brown dark:text-stone-400 whitespace-nowrap">
                                        {new Date(log.visited_at).toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-deep-brown dark:text-stone-200">{log.country}</div>
                                        <div className="text-xs text-stone-400">{log.city}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-mono text-xs text-rose-500 mb-1">{log.path}</div>
                                        <div className="text-xs text-stone-400 max-w-[200px] truncate" title={log.user_agent}>
                                            {log.user_agent}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;

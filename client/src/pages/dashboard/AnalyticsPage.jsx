import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../services/axiosInstance';
import toast from 'react-hot-toast';
import { 
  RevenueTrendChart, 
  ClientConcentrationChart, 
  ARAgingChart,
  GrowthVelocityChart
} from '../../components/analytics/InsightCharts';

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [velocity, setVelocity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All Time');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [insightsRes, velocityRes] = await Promise.all([
          axiosInstance.get(`/analytics/insights?period=${activeFilter}`),
          axiosInstance.get('/analytics/velocity')
        ]);
        setData(insightsRes.data.data);
        setVelocity(velocityRes.data.data);
      } catch (error) {
        toast.error('Failed to load financial intelligence');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [activeFilter]);

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#ef4444'];
  const totalUnpaid = data?.arAging?.reduce((a, b) => a + (b.amount || 0), 0) || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight font-headline">Insights</h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">Comprehensive overview of financial performance.</p>
        </div>
        
        <div className="flex bg-[#1E1E1E] p-1 rounded-xl border border-[#2E2E2E] w-fit">
          {['YTD', 'All Time'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === filter ? 'bg-[#2E2E2E] text-white shadow-lg' : 'text-gray-500 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#161616] border border-[#262626] rounded-3xl p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">Revenue vs Expenses</h3>
              <p className="text-sm text-gray-500">Filtered by {activeFilter}</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] md:text-xs">
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#6366f1]"></div><span className="text-gray-400 uppercase tracking-wider font-bold">Revenue</span></div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]"></div><span className="text-gray-400 uppercase tracking-wider font-bold">Expense</span></div>
            </div>
          </div>
          <RevenueTrendChart data={data} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#161616] border border-[#262626] rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Client Concentration</h3>
              <p className="text-sm text-gray-500 text-nowrap">Revenue by top accounts</p>
            </div>
          </div>
          <ClientConcentrationChart data={data?.clientConcentration} colors={COLORS} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#161616] border border-[#262626] rounded-3xl p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">A/R Aging</h3>
              <p className="text-sm text-gray-500">Outstanding invoices by age</p>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="text-xl md:text-2xl font-black text-white">₹{totalUnpaid.toLocaleString()}</span>
              <span className="text-[9px] uppercase tracking-widest text-rose-400 font-bold">Total Unpaid</span>
            </div>
          </div>
          <ARAgingChart data={data?.arAging} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#161616] border border-[#262626] rounded-3xl p-6 md:p-8 flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-auto z-10">
            <div>
              <h3 className="text-xl font-bold text-white">Billing Momentum</h3>
              <p className="text-sm text-gray-500">Month-over-month sales</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${Number(velocity?.growthPercentage) >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {Number(velocity?.growthPercentage) >= 0 ? '+' : ''}{velocity?.growthPercentage || 0}%
            </div>
          </div>
          <div className="mt-8 z-10">
            <div className="text-3xl md:text-4xl font-black text-white">₹{velocity?.currentMonthMRR?.toLocaleString() || 0}</div>
            <div className="text-sm text-gray-500 mt-1">Total Billed This Month</div>
          </div>
          <GrowthVelocityChart data={velocity?.trend} />
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

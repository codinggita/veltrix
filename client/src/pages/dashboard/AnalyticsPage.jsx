import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../services/axiosInstance';
import toast from 'react-hot-toast';
import { 
  RevenueTrendChart, 
  ClientConcentrationChart, 
  ARAgingChart 
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight font-headline">Insights</h1>
          <p className="text-gray-400 mt-1">Comprehensive overview of financial performance.</p>
        </div>
        
        <div className="flex bg-[#1E1E1E] p-1 rounded-xl border border-[#2E2E2E]">
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#161616] border border-[#262626] rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Revenue vs Expenses</h3>
              <p className="text-sm text-gray-500">Filtered by {activeFilter}</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#6366f1]"></div><span className="text-gray-400">Revenue</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#f43f5e]"></div><span className="text-gray-400">Expense</span></div>
            </div>
          </div>
          <RevenueTrendChart data={data} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#161616] border border-[#262626] rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Client Concentration</h3>
              <p className="text-sm text-gray-500">Revenue by top accounts</p>
            </div>
          </div>
          <ClientConcentrationChart data={data?.clientConcentration} colors={COLORS} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#161616] border border-[#262626] rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">A/R Aging</h3>
              <p className="text-sm text-gray-500">Outstanding invoices by age</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-black text-white">₹{data?.arAging.reduce((a, b) => a + b.amount, 0).toLocaleString()}</span>
              <span className="text-[10px] uppercase tracking-widest text-rose-400 font-bold">Total Unpaid</span>
            </div>
          </div>
          <ARAgingChart data={data?.arAging} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#161616] border border-[#262626] rounded-3xl p-8 flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-auto">
            <div>
              <h3 className="text-xl font-bold text-white">Growth Velocity</h3>
              <p className="text-sm text-gray-500">Month-over-month MRR</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${velocity?.growthPercentage >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {velocity?.growthPercentage >= 0 ? '+' : ''}{velocity?.growthPercentage}%
            </div>
          </div>
          <div className="mt-8">
            <div className="text-4xl font-black text-white">₹{velocity?.currentMonthMRR.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">Current Month MRR</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

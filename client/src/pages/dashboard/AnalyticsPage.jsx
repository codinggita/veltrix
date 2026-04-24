import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import axiosInstance from '../../services/axiosInstance';
import toast from 'react-hot-toast';

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [velocity, setVelocity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All Time');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [insightsRes, velocityRes] = await Promise.all([
          axiosInstance.get('/analytics/insights'),
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
  }, []);

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#ef4444'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Formatting data for chart
  const trendData = data?.revenueTrend.map(item => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[item._id.month - 1];
    
    // Match with expense data
    const expense = data.expenseTrend.find(e => e._id.month === item._id.month && e._id.year === item._id.year);
    
    return {
      name: monthName,
      revenue: item.revenue,
      expense: expense ? expense.expenses : 0
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight font-headline">Insights</h1>
          <p className="text-gray-400 mt-1">Comprehensive overview of financial performance.</p>
        </div>
        
        <div className="flex bg-[#1E1E1E] p-1 rounded-xl border border-[#2E2E2E]">
          {['YTD', 'Q3 2023', 'All Time'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === filter 
                  ? 'bg-[#2E2E2E] text-white shadow-lg' 
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Revenue vs Expenses */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#161616] border border-[#262626] rounded-3xl p-8 overflow-hidden relative group"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Revenue vs Expenses</h3>
              <p className="text-sm text-gray-500">Trailing 6 Months</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-gray-400">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <span className="text-gray-400">Expense</span>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  hide
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161616', border: '1px solid #262626', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Client Concentration */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#161616] border border-[#262626] rounded-3xl p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Client Concentration</h3>
              <p className="text-sm text-gray-500">Revenue by top accounts</p>
            </div>
            <button className="text-gray-500 hover:text-white">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-[240px] w-[240px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.clientConcentration}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="totalRevenue"
                  >
                    {data?.clientConcentration.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-white">
                  {data?.clientConcentration.length > 0 ? (
                    `${Math.round((data.clientConcentration[0].totalRevenue / data.clientConcentration.reduce((a, b) => a + b.totalRevenue, 0)) * 100)}%`
                  ) : '0%'}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500">Top Client</span>
              </div>
            </div>

            <div className="flex-1 space-y-4 w-full">
              {data?.clientConcentration.map((client, index) => (
                <div key={client.name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">{client.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">₹{client.totalRevenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* A/R Aging */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#161616] border border-[#262626] rounded-3xl p-8"
        >
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

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.arAging}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                <XAxis 
                  dataKey="_id" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#1E1E1E' }}
                  contentStyle={{ backgroundColor: '#161616', border: '1px solid #262626', borderRadius: '12px' }}
                />
                <Bar 
                  dataKey="amount" 
                  radius={[8, 8, 0, 0]}
                >
                  {data?.arAging.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry._id === '> 60 Days' ? '#fca5a5' : '#262626'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Growth Velocity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#161616] border border-[#262626] rounded-3xl p-8 flex flex-col relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-auto">
            <div>
              <h3 className="text-xl font-bold text-white">Growth Velocity</h3>
              <p className="text-sm text-gray-500">Month-over-month MRR</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              velocity?.growthPercentage >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
            }`}>
              {velocity?.growthPercentage >= 0 ? '+' : ''}{velocity?.growthPercentage}%
            </div>
          </div>

          <div className="mt-8">
            <div className="text-4xl font-black text-white">₹{velocity?.currentMonthMRR.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">Current Month MRR</div>
          </div>

          {/* Abstract visual trace */}
          <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20 pointer-events-none">
            <svg viewBox="0 0 400 100" className="w-full h-full preserve-3d">
              <path 
                d="M0,80 Q100,20 200,60 T400,10" 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="2"
                className="animate-pulse"
              />
              <path 
                d="M0,80 Q100,20 200,60 T400,10 L400,100 L0,100 Z" 
                fill="url(#growthGradient)" 
              />
              <defs>
                <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

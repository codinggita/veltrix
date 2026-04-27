import React from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

export const RevenueTrendChart = ({ data }) => {
  if (!data?.revenueTrend) return <div className="h-[300px] flex items-center justify-center text-text-muted">No trend data available</div>;

  const trendData = data.revenueTrend.map(item => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[item._id.month - 1];
    const expense = data.expenseTrend?.find(e => e._id.month === item._id.month && e._id.year === item._id.year);
    return {
      name: monthName,
      revenue: item.revenue,
      expense: expense ? expense.expenses : 0
    };
  });

  return (
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
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
          <YAxis hide />
          <Tooltip contentStyle={{ backgroundColor: '#161616', border: '1px solid #262626', borderRadius: '12px' }} />
          <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
          <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const GrowthVelocityChart = ({ data }) => {
  if (!data || data.length < 2) return null;
  
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40 h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 80, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="#10b981" 
            strokeWidth={2} 
            fill="url(#colorGrowth)" 
            fillOpacity={1} 
            isAnimationActive={true}
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ClientConcentrationChart = ({ data, colors }) => {
  const totalRevenue = data?.reduce((acc, curr) => acc + (curr.totalRevenue || 0), 0) || 0;
  const topClientPercent = totalRevenue > 0 && data?.[0] 
    ? Math.round((data[0].totalRevenue / totalRevenue) * 100) 
    : 0;

  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      <div className="h-[240px] w-[240px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data || []} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="totalRevenue">
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black text-white">
            {topClientPercent}%
          </span>
          <span className="text-[10px] uppercase tracking-widest text-gray-500">Top Client</span>
        </div>
      </div>
      <div className="flex-1 space-y-4 w-full">
        {data?.map((client, index) => (
          <div key={client.name} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[index % colors.length] }}></div>
              <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">{client.name}</span>
            </div>
            <span className="text-xs text-gray-500">₹{client.totalRevenue?.toLocaleString() || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ARAgingChart = ({ data }) => {
  if (!data) return <div className="h-[200px] flex items-center justify-center text-text-muted text-xs italic">No aging data</div>;
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
          <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
          <YAxis hide />
          <Tooltip cursor={{ fill: '#1E1E1E' }} contentStyle={{ backgroundColor: '#161616', border: '1px solid #262626', borderRadius: '12px' }} />
          <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry._id === '> 60 Days' ? '#fca5a5' : '#262626'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import PageWrapper from '../../components/layout/PageWrapper';
import StatCard from '../../components/dashboard/StatCard';
import axiosInstance from '../../services/axiosInstance';
import Loader from '../../components/ui/Loader';
import { formatCurrency, formatDate } from '../../utils/formatters';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/stats/dashboard');
        console.log('Dashboard Stats Response:', res.data.data);
        setStats(res.data.data);
      } catch (error) {
        console.error('Failed to load dashboard stats', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [];
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      
      let rev = 0;
      let exp = 0;

      if (stats?.cashFlowData) {
        const foundRev = stats.cashFlowData.revenue?.find(r => 
          Number(r._id.month) === Number(m) && Number(r._id.year) === Number(y)
        );
        const foundExp = stats.cashFlowData.expenses?.find(e => 
          Number(e._id.month) === Number(m) && Number(e._id.year) === Number(y)
        );
        
        rev = foundRev?.amount || 0;
        exp = foundExp?.amount || 0;
      }
      
      data.push({
        name: months[m - 1],
        income: rev,
        expenses: exp
      });
    }

    console.log('Processed Chart Data:', data);
    return data;
  }, [stats]);

  if (isLoading) {
    return (
      <PageWrapper title="">
        <div className="flex h-64 items-center justify-center">
          <Loader size="lg" />
        </div>
      </PageWrapper>
    );
  }

  const metrics = [
    {
      title: "Total Revenue",
      value: stats?.totalRevenue || 0,
      prefix: "₹",
      description: "Total settled payments",
      icon: <span className="material-symbols-outlined text-[24px] text-primary">account_balance</span>
    },
    {
      title: "Pending Amount",
      value: stats?.pendingAmount || 0,
      prefix: "₹",
      description: `${stats?.totalInvoices || 0} invoices awaiting payment`,
      icon: <span className="material-symbols-outlined text-[24px] text-warning">hourglass_empty</span>
    },
    {
      title: "Total Clients",
      value: stats?.totalClients || 0,
      description: "Active business partners",
      icon: <span className="material-symbols-outlined text-[24px] text-success">group</span>
    },
    {
      title: "Active Invoices",
      value: stats?.totalInvoices || 0,
      description: "Total invoices generated",
      icon: <span className="material-symbols-outlined text-[24px] text-primary">analytics</span>
    }
  ];

  return (
    <PageWrapper title="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((m, i) => (
          <StatCard 
            key={i}
            title={m.title} 
            value={m.value} 
            prefix={m.prefix}
            description={m.description}
            icon={m.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-[#121212] border border-[#1E1E1E] rounded-2xl p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Cash Flow Analytics</h2>
              <p className="text-xs text-text-muted font-medium mt-1">Overview of income vs operating expenses</p>
            </div>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1A1A', 
                    border: '1px solid #2A2A2A', 
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#E5E7EB'
                  }}
                  itemStyle={{ color: '#E5E7EB' }}
                  cursor={{ stroke: '#4F46E5', strokeWidth: 1 }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
                <Area 
                  name="Income"
                  type="monotone" 
                  dataKey="income" 
                  stroke="#4F46E5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                  animationDuration={1500}
                />
                <Area 
                  name="Expenses"
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fill="transparent"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#121212] border border-[#1E1E1E] rounded-2xl p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em]">Recent Invoices</h2>
            <button onClick={() => navigate('/app/invoices')} className="text-[11px] font-bold text-primary uppercase tracking-wider hover:opacity-80 transition-opacity">View All</button>
          </div>
          <div className="space-y-6">
            {stats?.recentInvoices?.length > 0 ? (
              stats.recentInvoices.map((inv) => (
                <InvoiceItem 
                  key={inv._id}
                  name={inv.client?.name || 'Unknown Client'} 
                  date={formatDate(inv.createdAt)} 
                  amount={formatCurrency(inv.total)} 
                  status={inv.status.toUpperCase()} 
                />
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="text-xs text-text-muted italic">No recent invoices</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold text-white tracking-tight mb-6">Payment Pipeline</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PipelineColumn 
          title="PENDING" 
          count={stats?.recentInvoices?.filter(i => i.status === 'sent').length || 0} 
          color="primary"
        >
          {stats?.recentInvoices?.filter(i => i.status === 'sent').slice(0, 2).map(inv => (
             <PipelineCard 
                key={inv._id}
                id={inv.invoiceNumber} 
                name={inv.client?.name} 
                date={`Due ${formatDate(inv.dueDate, { month: 'short', day: 'numeric' })}`} 
                amount={formatCurrency(inv.total)} 
             />
          ))}
        </PipelineColumn>

        <PipelineColumn 
          title="OVERDUE" 
          count={stats?.recentInvoices?.filter(i => i.status === 'overdue').length || 0} 
          color="error"
        >
          {stats?.recentInvoices?.filter(i => i.status === 'overdue').slice(0, 2).map(inv => (
             <PipelineCard 
                key={inv._id}
                id={inv.invoiceNumber} 
                name={inv.client?.name} 
                date="Past Due" 
                amount={formatCurrency(inv.total)} 
                urgent 
             />
          ))}
        </PipelineColumn>

        <PipelineColumn 
          title="RECENTLY PAID" 
          count={stats?.recentInvoices?.filter(i => i.status === 'paid').length || 0} 
          color="success"
        >
          {stats?.recentInvoices?.filter(i => i.status === 'paid').slice(0, 2).map(inv => (
             <PipelineCard 
                key={inv._id}
                id={inv.invoiceNumber} 
                name={inv.client?.name} 
                date={`Paid ${formatDate(inv.updatedAt || inv.createdAt, { month: 'short', day: 'numeric' })}`} 
                amount={formatCurrency(inv.total)} 
                settled 
             />
          ))}
        </PipelineColumn>
      </div>
    </PageWrapper>
  );
};

const InvoiceItem = ({ name, date, amount, status }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-[#2A2A2A]">
        <span className="material-symbols-outlined text-[18px] text-text-muted">person</span>
      </div>
      <div>
        <div className="text-sm font-bold text-white leading-tight">{name}</div>
        <div className="text-[10px] text-text-muted font-medium mt-0.5">{date}</div>
      </div>
    </div>
    <div className="text-right">
      <div className="text-sm font-bold text-white tracking-tight">{amount}</div>
      <div className={`text-[8px] font-black uppercase tracking-widest mt-1 ${
        status === 'PAID' ? 'text-success' : status === 'PENDING' || status === 'SENT' ? 'text-warning' : 'text-error'
      }`}>{status}</div>
    </div>
  </div>
);

const PipelineColumn = ({ title, count, color, children }) => (
  <div className="flex flex-col gap-5">
    <div className="flex items-center gap-2 mb-1">
      <div className={`w-1.5 h-1.5 rounded-full ${color === 'primary' ? 'bg-primary' : color === 'error' ? 'bg-error' : 'bg-success'}`} />
      <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{title}</h3>
      <span className="ml-auto bg-[#1A1A1A] text-text-muted text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#2A2A2A]">{count}</span>
    </div>
    <div className="space-y-4">
       {children}
       {count === 0 && <div className="p-6 border border-[#1E1E1E] border-dashed rounded-2xl text-center text-[10px] text-text-muted uppercase tracking-widest font-bold">Clear</div>}
    </div>
  </div>
);

const PipelineCard = ({ id, name, date, amount, urgent, settled }) => (
  <div className={`bg-[#121212] border ${urgent ? 'border-error/30' : 'border-[#1E1E1E]'} p-6 rounded-2xl hover:border-primary/50 transition-all cursor-pointer group shadow-lg`}>
    <div className="flex justify-between items-start mb-3">
      <span className="text-[10px] font-bold text-primary tracking-widest uppercase">{id}</span>
      {urgent && <span className="material-symbols-outlined text-error text-[14px]">error</span>}
      {settled && <span className="material-symbols-outlined text-success text-[14px]">check_circle</span>}
    </div>
    <h4 className="text-sm font-black text-white mb-4 tracking-tight">{name}</h4>
    <div className="flex justify-between items-end">
      <div className={`text-[10px] font-bold ${urgent ? 'text-error animate-pulse' : 'text-text-muted'}`}>{date}</div>
      <div className="text-sm font-black text-white tracking-tight">{amount}</div>
    </div>
  </div>
);

export default DashboardPage;

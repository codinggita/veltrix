import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        setStats(res.data.data);
      } catch (error) {
        console.error('Failed to load dashboard stats', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <PageWrapper title="">
        <div className="flex h-64 items-center justify-center">
          <Loader size="lg" />
        </div>
      </PageWrapper>
    );
  }

  // Data mapping from API
  const metrics = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue || 0),
      description: "Total settled payments",
      icon: <span className="material-symbols-outlined text-[24px] text-primary">account_balance</span>
    },
    {
      title: "Pending Amount",
      value: formatCurrency(stats?.pendingAmount || 0),
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
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((m, i) => (
          <StatCard 
            key={i}
            title={m.title} 
            value={m.value.toString().replace('₹', '')} 
            prefix={m.value.toString().includes('₹') ? '₹' : ''}
            description={m.description}
            icon={m.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Cash Flow Analytics */}
        <div className="lg:col-span-2 bg-[#121212] border border-[#1E1E1E] rounded-2xl p-8">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Cash Flow Analytics</h2>
              <p className="text-xs text-text-muted font-medium mt-1">Overview of income vs operating expenses</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1E1E1E]" />
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Expenses</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-4 px-2 text-center">
            <div className="w-full h-full flex items-center justify-center text-text-muted text-xs italic border border-white/5 border-dashed rounded-xl">
               Financial trend visualization coming in next update
            </div>
          </div>
        </div>

        {/* Recent Invoices */}
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

      {/* Payment Pipeline */}
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

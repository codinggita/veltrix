import React, { useEffect, useState } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatCard from '../../components/dashboard/StatCard';
import axiosInstance from '../../services/axiosInstance';
import Loader from '../../components/ui/Loader';

const DashboardPage = () => {
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

  return (
    <PageWrapper title="">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Revenue" 
          value="12,450.00" 
          prefix="₹"
          trend="+12%"
          description="from last month"
          icon={<span className="material-symbols-outlined text-[24px] text-primary">account_balance</span>}
        />
        <StatCard 
          title="Pending Payments" 
          value="2,300.00" 
          prefix="₹"
          description="8 invoices awaiting payment"
          icon={<span className="material-symbols-outlined text-[24px] text-warning">hourglass_empty</span>}
        />
        <StatCard 
          title="Overdue Amount" 
          value="450.00" 
          prefix="₹"
          description="3 accounts past due date"
          icon={<span className="material-symbols-outlined text-[24px] text-error">priority_high</span>}
        />
        <StatCard 
          title="Monthly Earnings" 
          value="4,200.00" 
          prefix="₹"
          progress={75}
          icon={<span className="material-symbols-outlined text-[24px] text-primary">analytics</span>}
        />
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
          
          <div className="h-64 flex items-end justify-between gap-4 px-2">
            {[
              { month: 'JAN', income: 40, expense: 20 },
              { month: 'FEB', income: 55, expense: 30 },
              { month: 'MAR', income: 70, expense: 40 },
              { month: 'APR', income: 85, expense: 35 },
              { month: 'MAY', income: 60, expense: 45 },
              { month: 'JUN', income: 75, expense: 25 },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-4">
                <div className="w-full max-w-[40px] flex flex-col justify-end h-full gap-0.5 rounded-sm overflow-hidden group">
                  <div className="bg-primary/20 group-hover:bg-primary/40 transition-colors duration-300" style={{ height: `${bar.income}%` }} />
                  <div className="bg-[#1A1A1A] group-hover:bg-[#222] transition-colors duration-300" style={{ height: `${bar.expense}%` }} />
                </div>
                <span className="text-[10px] font-bold text-text-muted tracking-widest">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-[#121212] border border-[#1E1E1E] rounded-2xl p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em]">Recent Invoices</h2>
            <button className="text-[11px] font-bold text-primary uppercase tracking-wider hover:opacity-80 transition-opacity">View All</button>
          </div>
          <div className="space-y-6">
            <InvoiceItem name="Acme Studio" date="Mar 12, 2024" amount="₹1,200.00" status="PAID" />
            <InvoiceItem name="Global Tech" date="Mar 10, 2024" amount="₹850.00" status="PENDING" />
            <InvoiceItem name="Nebula Design" date="Mar 05, 2024" amount="₹450.00" status="OVERDUE" />
          </div>
        </div>
      </div>

      {/* Payment Pipeline */}
      <h2 className="text-lg font-bold text-white tracking-tight mb-6">Payment Pipeline</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PipelineColumn title="PENDING" count={3} color="primary">
          <PipelineCard id="INV-0042" name="Vanguard Solutions" date="Due Mar 25" amount="₹2,100.00" />
          <PipelineCard id="INV-0045" name="Creative Flow Ltd" date="Due Mar 28" amount="₹1,150.00" />
        </PipelineColumn>

        <PipelineColumn title="OVERDUE" count={1} color="error">
          <PipelineCard id="INV-0039" name="Atlas Corp" date="5 Days Past Due" amount="₹450.00" urgent />
        </PipelineColumn>

        <PipelineColumn title="RECENTLY PAID" count={12} color="success">
          <PipelineCard id="INV-0038" name="Swift Logistics" date="Received Mar 14" amount="₹3,400.00" settled />
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
        status === 'PAID' ? 'text-success' : status === 'PENDING' ? 'text-warning' : 'text-error'
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
    <div className="space-y-4">{children}</div>
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

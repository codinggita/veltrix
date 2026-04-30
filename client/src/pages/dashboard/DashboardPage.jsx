import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import PageWrapper from '../../components/layout/PageWrapper';
import StatCard from '../../components/dashboard/StatCard';
import axiosInstance from '../../services/axiosInstance';
import Loader from '../../components/ui/Loader';
import SEO from '../../components/ui/SEO';
import { formatCurrency, formatDate } from '../../utils/formatters';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActivityOpen, setIsActivityOpen] = useState(false);

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

  const chartData = useMemo(() => {
    if (!stats?.cashFlowData) return [];
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = [];
    const now = new Date();
    
    // Create map for faster lookups and easier debugging
    const revenueMap = {};
    const expenseMap = {};
    
    (stats.cashFlowData.revenue || []).forEach(r => {
      const key = `${r._id.year}-${r._id.month}`;
      revenueMap[key] = r.income || r.amount || r.revenue || 0;
    });
    
    (stats.cashFlowData.expenses || []).forEach(e => {
      const key = `${e._id.year}-${e._id.month}`;
      expenseMap[key] = e.expenses || e.amount || e.expense || 0;
    });

    // Generate last 6 months trailing from current date
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = targetDate.getMonth() + 1;
      const y = targetDate.getFullYear();
      const key = `${y}-${m}`;
      
      result.push({
        name: monthNames[m - 1],
        income: Number(revenueMap[key] || 0),
        expenses: Number(expenseMap[key] || 0)
      });
    }
    
    return result;
  }, [stats]);

  if (isLoading) {
    return (
      <PageWrapper title="">
        <div className="flex h-[60vh] items-center justify-center">
          <Loader size="lg" />
        </div>
      </PageWrapper>
    );
  }

  const metrics = [
    {
      title: "Total Revenue", value: formatCurrency(stats?.totalRevenue || 0),
      description: "Total settled payments", icon: "account_balance"
    },
    {
      title: "Pending Amount", value: formatCurrency(stats?.pendingAmount || 0),
      description: `${stats?.totalInvoices || 0} invoices awaiting payment`, icon: "hourglass_empty"
    },
    {
      title: "Total Clients", value: stats?.totalClients || 0,
      description: "Active business partners", icon: "group"
    },
    {
      title: "Active Invoices", value: stats?.totalInvoices || 0,
      description: "Total invoices generated", icon: "receipt_long"
    }
  ];

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  return (
    <PageWrapper title="">
      <SEO title="Dashboard" description="Overview of your financial sovereign state. Track revenue, pending invoices, and recent transactions." />
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 pb-12">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <motion.div key={i} variants={itemVariants}>
              <StatCard title={m.title} value={m.value} description={m.description} icon={m.icon} />
            </motion.div>
          ))}
        </div>

        {/* Charts & Recent Invoices */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="xl:col-span-2 premium-card rounded-3xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Cash Flow Analytics</h2>
                <p className="text-sm text-text-muted mt-1">Overview of income vs operating expenses</p>
              </div>
            </div>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 11, fontWeight: 600 }} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(24,24,27,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px', color: '#FAFAFA', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#FAFAFA' }}
                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#A1A1AA' }} />
                  <Area name="Income" type="monotone" dataKey="income" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" animationDuration={1500} />
                  <Area name="Expenses" type="monotone" dataKey="expenses" stroke="#F43F5E" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="premium-card rounded-3xl p-6 md:p-8 flex flex-col relative">
            <button 
              onClick={() => setIsActivityOpen(!isActivityOpen)}
              className="flex justify-between items-center w-full group text-left"
            >
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Recent Activity</h2>
                <p className="text-sm text-text-muted mt-1">{stats?.recentInvoices?.length || 0} events tracked</p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-white/5 group-hover:bg-primary/10 flex items-center justify-center text-text-muted group-hover:text-primary transition-all duration-500 ring-1 ring-white/10 ${isActivityOpen ? 'rotate-180 bg-primary/10 text-primary' : ''}`}>
                <span className="material-symbols-outlined text-[20px]">expand_more</span>
              </div>
            </button>

            <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)] ${isActivityOpen ? 'max-h-[600px] mt-8 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-4 pr-1 scrollbar-hide">
                {stats?.recentInvoices?.length > 0 ? (
                  stats.recentInvoices.map((inv) => (
                    <div 
                      key={inv._id}
                      onClick={() => navigate(`/app/invoices/edit/${inv._id}`)}
                      className="flex items-center justify-between p-4 bg-[#09090B] rounded-2xl ring-1 ring-white/5 hover:ring-primary/40 hover:bg-[#121214] transition-all cursor-pointer group scale-btn"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center ring-1 ring-white/10 group-hover:bg-primary/10 transition-colors">
                          <span className="material-symbols-outlined text-[18px] text-text-secondary group-hover:text-primary transition-colors">description</span>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white leading-tight group-hover:text-primary transition-colors">#{inv.invoiceNumber}</div>
                          <div className="text-[11px] text-text-muted font-medium mt-0.5 truncate">{inv.client?.name || 'Unknown Client'}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white tracking-tight tabular-nums">{formatCurrency(inv.total)}</div>
                        <div className={`text-[9px] font-black uppercase tracking-widest mt-1 ${inv.status === 'paid' ? 'text-success' : inv.status === 'sent' ? 'text-warning' : 'text-danger'}`}>{inv.status}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center text-text-muted italic text-sm">No activity records found</div>
                )}
                
                <button 
                  onClick={() => navigate('/app/invoices')}
                  className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-black text-white uppercase tracking-[0.2em] transition-all border border-dashed border-white/10"
                >
                  Enter Full Ledger
                </button>
              </div>
            </div>

            {!isActivityOpen && stats?.recentInvoices?.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-700 space-y-3">
                <div className="flex items-center justify-between px-1 mb-4">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Latest Transactions</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#6366f1]"></span>
                </div>
                {stats.recentInvoices.slice(0, 5).map((inv, idx) => (
                  <div key={inv._id} className="flex items-center justify-between px-1 group/item">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="text-[10px] font-bold text-text-muted tabular-nums w-4">0{idx + 1}</span>
                      <span className="text-xs font-medium text-white truncate max-w-[120px] group-hover/item:text-primary transition-colors">{inv.client?.name}</span>
                    </div>
                    <span className="text-[11px] font-black text-white tabular-nums tracking-tight">{formatCurrency(inv.total)}</span>
                  </div>
                ))}
                <div className="pt-2">
                  <p className="text-[9px] text-text-muted font-bold text-center uppercase tracking-widest opacity-50">Click to expand full history</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Payment Pipeline */}
        <motion.div variants={itemVariants} className="pt-4">
          <div className="mb-6 px-2 md:px-0">
            <h2 className="text-2xl font-bold text-white tracking-tight">Payment Pipeline</h2>
            <p className="text-sm text-text-muted mt-1">Track invoice progression</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <PipelineColumn title="Pending Review" count={stats?.pipeline?.pending || 0} color="warning" onViewAll={() => navigate('/app/invoices')}>
              {stats?.recentInvoices?.filter(i => i.status === 'sent').slice(0, 3).map(inv => (
                 <PipelineCard key={inv._id} id={inv.invoiceNumber} name={inv.client?.name} date={`Due ${formatDate(inv.dueDate, { month: 'short', day: 'numeric' })}`} amount={formatCurrency(inv.total)} status="pending" onClick={() => navigate(`/app/invoices/edit/${inv._id}`)} />
              ))}
            </PipelineColumn>

            <PipelineColumn title="Needs Attention" count={stats?.pipeline?.overdue || 0} color="danger" onViewAll={() => navigate('/app/invoices')}>
              {stats?.recentInvoices?.filter(i => i.status === 'overdue').slice(0, 3).map(inv => (
                 <PipelineCard key={inv._id} id={inv.invoiceNumber} name={inv.client?.name} date="Past Due" amount={formatCurrency(inv.total)} status="overdue" onClick={() => navigate(`/app/invoices/edit/${inv._id}`)} />
              ))}
            </PipelineColumn>

            <PipelineColumn title="Recently Settled" count={stats?.pipeline?.paid || 0} color="success" onViewAll={() => navigate('/app/invoices')}>
              {stats?.recentInvoices?.filter(i => i.status === 'paid').slice(0, 3).map(inv => (
                 <PipelineCard key={inv._id} id={inv.invoiceNumber} name={inv.client?.name} date={`Paid ${formatDate(inv.updatedAt || inv.createdAt, { month: 'short', day: 'numeric' })}`} amount={formatCurrency(inv.total)} status="paid" onClick={() => navigate(`/app/invoices/edit/${inv._id}`)} />
              ))}
            </PipelineColumn>
          </div>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
};

const InvoiceItem = ({ name, date, amount, status }) => (
  <div className="flex items-center justify-between group cursor-default">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center ring-1 ring-white/10 group-hover:bg-white/10 transition-colors">
        <span className="material-symbols-outlined text-[18px] text-text-secondary">person</span>
      </div>
      <div>
        <div className="text-sm font-bold text-white leading-tight group-hover:text-primary transition-colors">{name}</div>
        <div className="text-xs text-text-muted font-medium mt-0.5">{date}</div>
      </div>
    </div>
    <div className="text-right">
      <div className="text-sm font-bold text-white tracking-tight tabular-nums">{amount}</div>
      <div className={`text-[9px] font-black uppercase tracking-widest mt-1 ${status === 'PAID' ? 'text-success' : status === 'PENDING' || status === 'SENT' ? 'text-warning' : 'text-danger'}`}>{status}</div>
    </div>
  </div>
);

const PipelineColumn = ({ title, count, color, children, onViewAll }) => (
  <div className="flex flex-col gap-4 bg-white/[0.02] p-4 rounded-3xl ring-1 ring-white/5 h-full relative">
    <div className="flex items-center gap-2 mb-2 px-2">
      <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] bg-${color}`} />
      <h3 className="text-[11px] font-black text-text-secondary uppercase tracking-[0.15em]">{title}</h3>
      <span className="ml-auto bg-black/50 text-white text-[10px] font-bold px-2.5 py-1 rounded-full ring-1 ring-white/10">{count}</span>
    </div>
    <div className="space-y-3 flex-1">
       {children}
       {count === 0 && (
         <div className="py-12 flex flex-col items-center justify-center text-text-muted/50 border-2 border-dashed border-white/5 rounded-2xl">
           <span className="material-symbols-outlined text-3xl mb-2">check_circle</span>
           <span className="text-[11px] uppercase tracking-widest font-bold">All Clear</span>
         </div>
       )}
    </div>
    {count > 3 && onViewAll && (
      <button 
        onClick={onViewAll}
        className="w-full py-3 mt-2 rounded-xl bg-white/5 hover:bg-white/10 hover:ring-1 hover:ring-white/20 text-[10px] font-black text-text-muted hover:text-white uppercase tracking-[0.2em] transition-all border border-dashed border-white/10"
      >
        View All {count}
      </button>
    )}
  </div>
);

const PipelineCard = ({ id, name, date, amount, status, onClick }) => (
  <div onClick={onClick} className="bg-[#18181B] p-5 rounded-2xl ring-1 ring-white/5 hover:ring-primary/50 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all cursor-pointer group scale-btn">
    <div className="flex justify-between items-start mb-3">
      <span className="text-[10px] font-bold text-text-muted group-hover:text-primary tracking-widest uppercase transition-colors">{id}</span>
      {status === 'overdue' && <span className="material-symbols-outlined text-danger text-[16px] animate-pulse">error</span>}
      {status === 'paid' && <span className="material-symbols-outlined text-success text-[16px]">task_alt</span>}
    </div>
    <h4 className="text-sm font-bold text-white mb-4 tracking-tight truncate">{name}</h4>
    <div className="flex justify-between items-end">
      <div className={`text-[11px] font-bold ${status === 'overdue' ? 'text-danger' : 'text-text-muted'}`}>{date}</div>
      <div className="text-sm font-black text-white tracking-tight tabular-nums">{amount}</div>
    </div>
  </div>
);

export default DashboardPage;

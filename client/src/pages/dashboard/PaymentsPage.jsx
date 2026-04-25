import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageWrapper from '../../components/layout/PageWrapper';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import PaymentModal from '../../components/payments/PaymentModal';
import { getPayments, getPaymentStats } from '../../store/slices/paymentSlice';
import { formatCurrency, formatDate } from '../../utils/formatters';

const PaymentsPage = () => {
  const dispatch = useDispatch();
  const { payments, stats, isLoading } = useSelector((state) => state.payment);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getPayments());
    dispatch(getPaymentStats());
  }, [dispatch]);

  const filteredPayments = activeFilter === 'All' 
    ? payments 
    : payments.filter(p => p.status === activeFilter);

  const columns = [
    { 
      header: 'Transaction ID', 
      accessor: 'transactionId',
      render: (row) => <span className="font-mono text-[10px] text-text-muted uppercase tracking-tighter">{row.transactionId}</span>
    },
    { 
      header: 'Date', 
      accessor: 'date',
      render: (row) => <span className="text-xs font-medium text-text-muted">{formatDate(row.date)}</span>
    },
    { 
      header: 'Client', 
      accessor: 'client',
      render: (row) => <span className="text-sm font-bold text-white">{row.client?.name || 'Unknown Client'}</span>
    },
    { 
      header: 'Amount', 
      accessor: 'amount',
      render: (row) => (
        <div className="text-right font-black text-white tabular-nums">
          {formatCurrency(row.amount)}
        </div>
      )
    },
    { 
      header: 'Method', 
      accessor: 'method',
      render: (row) => (
        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/40 tracking-widest">
          <span className="material-symbols-outlined text-[16px]">
            {row.method === 'Credit Card' ? 'credit_card' : 'account_balance'}
          </span>
          {row.method}
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <Badge variant={row.status === 'Paid' ? 'success' : row.status === 'Pending' ? 'warning' : 'danger'} className="uppercase tracking-widest px-3 py-1 text-[9px] font-black">
          {row.status}
        </Badge>
      )
    }
  ];

  return (
    <PageWrapper title="Payments">
      <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white tracking-tight text-glow">Payments Ledger</h2>
            <p className="text-sm text-text-muted font-medium">Comprehensive record of all incoming transactions.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} variant="brand">
            Record Payment
          </Button>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Collected', value: formatCurrency(stats.totalCollected), color: 'primary' },
            { label: 'Pending Processing', value: formatCurrency(stats.pendingProcessing), color: 'warning' },
            { label: 'Failed Transactions', value: formatCurrency(stats.failedTransactions), color: 'danger' }
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-${stat.color}/10 transition-all`} />
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <h3 className="text-2xl font-black text-white italic tracking-tighter">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Table Section */}
        <div className="glass-panel rounded-[32px] border border-white/5 overflow-hidden">
          <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <select 
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="bg-[#1A1A1A] text-white text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 border border-white/10 focus:border-primary outline-none cursor-pointer"
              >
                <option value="All">Status: All</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
            <button className="flex items-center gap-2 text-[10px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export CSV
            </button>
          </div>

          <Table 
            columns={columns} 
            data={filteredPayments} 
            loading={isLoading} 
            emptyMessage="No payment records found."
          />
        </div>
      </div>

      <PaymentModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          dispatch(getPaymentStats()); // Refresh stats after modal closes
        }} 
      />
    </PageWrapper>
  );
};

export default PaymentsPage;

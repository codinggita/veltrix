import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageWrapper from '../../components/layout/PageWrapper';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import { getPayments, getPaymentStats } from '../../features/paymentSlice';

const PaymentsPage = () => {
  const dispatch = useDispatch();
  const { payments, stats, isLoading } = useSelector((state) => state.payment);
  const [activeFilter, setActiveFilter] = useState('All');

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
      render: (row) => <span className="font-mono text-xs text-text-muted">{row.transactionId}</span>
    },
    { 
      header: 'Date', 
      accessor: 'date',
      render: (row) => new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    { 
      header: 'Client', 
      accessor: 'client',
      render: (row) => <span className="font-bold text-white">{row.client?.name || 'Unknown Client'}</span>
    },
    { 
      header: 'Amount', 
      accessor: 'amount',
      render: (row) => (
        <div className="text-right font-bold text-white tabular-nums">
          ₹{row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      )
    },
    { 
      header: 'Method', 
      accessor: 'method',
      render: (row) => (
        <div className="flex items-center gap-2 text-text-muted">
          <span className="material-symbols-outlined text-[18px]">
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
        <Badge variant={row.status === 'Paid' ? 'success' : row.status === 'Pending' ? 'warning' : 'error'}>
          {row.status}
        </Badge>
      )
    }
  ];

  return (
    <PageWrapper title="Payments Ledger">
      <p className="text-text-muted text-sm font-medium -mt-6 mb-8">
        Comprehensive record of all incoming transactions.
      </p>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-bg-secondary border border-border-dark rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 relative z-10">Total Collected</p>
          <p className="text-3xl font-black text-white tabular-nums tracking-tight relative z-10">
            ₹{stats.totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-bg-secondary border border-border-dark rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-warning/5 rounded-full blur-2xl group-hover:bg-warning/10 transition-all duration-500" />
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 relative z-10">Pending Processing</p>
          <p className="text-3xl font-black text-white tabular-nums tracking-tight relative z-10">
            ₹{stats.pendingProcessing.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-bg-secondary border border-border-dark rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-danger/5 rounded-full blur-2xl group-hover:bg-danger/10 transition-all duration-500" />
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 relative z-10">Failed Transactions</p>
          <p className="text-3xl font-black text-white tabular-nums tracking-tight relative z-10">
            ₹{stats.failedTransactions.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-bg-secondary border border-border-dark rounded-2xl overflow-hidden">
        <div className="p-4 bg-bg-tertiary/30 border-b border-border-dark flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select 
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="bg-bg-tertiary text-text-primary text-xs font-bold rounded-xl px-4 py-2 border border-border-dark focus:border-primary/50 focus:ring-0 outline-none cursor-pointer uppercase tracking-widest"
            >
              <option value="All">Status: All</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          <button className="flex items-center gap-2 text-xs font-bold text-primary hover:text-white transition-colors uppercase tracking-widest">
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
    </PageWrapper>
  );
};

export default PaymentsPage;

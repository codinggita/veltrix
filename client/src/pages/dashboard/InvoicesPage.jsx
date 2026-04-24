import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getInvoices, deleteInvoice } from '../../features/invoiceSlice';
import { toast } from 'react-hot-toast';

const InvoicesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { invoices, isLoading } = useSelector((state) => state.invoices || state.invoice);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(getInvoices());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      await dispatch(deleteInvoice(id));
      toast.success('Invoice deleted');
    }
  };

  const filteredInvoices = Array.isArray(invoices) ? invoices.filter(inv => 
    filter === 'all' ? true : inv.status === filter
  ) : [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'sent': return 'primary';
      case 'overdue': return 'danger';
      case 'draft': return 'neutral';
      default: return 'neutral';
    }
  };

  const stats = {
    total: filteredInvoices.length,
    paid: filteredInvoices.filter(i => i.status === 'paid').length,
    pending: filteredInvoices.filter(i => i.status === 'sent').length,
    amount: filteredInvoices.reduce((acc, i) => acc + i.total, 0)
  };

  return (
    <PageWrapper title="Invoices">
      <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white tracking-tight text-glow">Invoice Ledger</h2>
            <p className="text-sm text-text-muted font-medium">Manage your financial pipelines and payment statuses.</p>
          </div>
          <Button onClick={() => navigate('/app/invoices/create')} variant="brand">
            Create New Invoice
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Total Volume', value: `₹${stats.amount.toLocaleString()}` },
            { label: 'Settled', value: stats.paid },
            { label: 'Pending', value: stats.pending },
            { label: 'Active Invoices', value: stats.total }
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-all" />
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <h3 className="text-2xl font-black text-white italic tracking-tighter">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="flex gap-2 p-1 bg-[#1A1A1A] rounded-2xl w-fit border border-white/5">
          {['all', 'paid', 'sent', 'overdue', 'draft'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === s ? 'bg-white text-black shadow-lg' : 'text-text-muted hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="glass-panel rounded-[32px] border border-white/5 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5">
                <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Invoice</th>
                <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Client</th>
                <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Date</th>
                <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Amount</th>
                <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredInvoices.map((inv) => (
                <motion.tr layout key={inv._id} className="hover:bg-white/5 transition-all group">
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-white italic tracking-tight">#{inv.invoiceNumber}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
                        <span className="text-[10px] font-black text-primary uppercase">{inv.client?.name?.[0]}</span>
                      </div>
                      <span className="text-sm font-bold text-white whitespace-nowrap">{inv.client?.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-medium text-text-muted">{new Date(inv.issueDate).toLocaleDateString()}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-white tabular-nums">₹{inv.total?.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant={getStatusColor(inv.status)} className="uppercase tracking-widest px-3 py-1 text-[9px] font-black">
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="text-text-muted hover:text-white transition-all">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      <button onClick={() => handleDelete(inv._id)} className="text-text-muted hover:text-rose-500 transition-all">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  );
};

export default InvoicesPage;

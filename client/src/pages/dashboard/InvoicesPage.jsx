import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getInvoices, deleteInvoice } from '../../store/slices/invoiceSlice';
import { toast } from 'react-hot-toast';

const InvoicesPage = () => {
  const dispatch = useDispatch(), navigate = useNavigate();
  const { invoices, isLoading } = useSelector((state) => state.invoices);
  const [filter, setFilter] = useState('all');

  useEffect(() => { dispatch(getInvoices()); }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this invoice?')) {
      await dispatch(deleteInvoice(id));
      toast.success('Invoice deleted');
    }
  };

  const filteredInvoices = Array.isArray(invoices) ? invoices.filter(inv => 
    filter === 'all' ? true : inv.status === filter
  ) : [];

  const getStatusColor = (s) => {
    if (s === 'paid') return 'success';
    if (s === 'sent') return 'primary';
    if (s === 'overdue') return 'error';
    return 'neutral';
  };

  const stats = {
    total: filteredInvoices.length,
    paid: filteredInvoices.filter(i => i.status === 'paid').length,
    pending: filteredInvoices.filter(i => i.status === 'sent').length,
    amount: filteredInvoices.reduce((acc, i) => acc + i.total, 0)
  };

  return (
    <PageWrapper title="">
      <div className="space-y-8 max-w-[1400px] mx-auto pb-20 px-4 md:px-0 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Invoice Ledger</h2>
            <p className="text-sm md:text-base text-text-muted font-medium">Manage your financial pipelines.</p>
          </div>
          <Button onClick={() => navigate('/app/invoices/create')} variant="brand" className="w-full md:w-auto shadow-[0_0_20px_rgba(99,102,241,0.3)]">Create Invoice</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'Total Volume', value: `₹${stats.amount.toLocaleString('en-IN')}` },
            { label: 'Settled', value: stats.paid },
            { label: 'Pending', value: stats.pending },
            { label: 'Active', value: stats.total }
          ].map((stat, i) => (
            <div key={i} className="premium-card p-6 md:p-8 rounded-3xl relative overflow-hidden group cursor-default">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all duration-700" />
              <p className="text-[10px] md:text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-3">{stat.label}</p>
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight tabular-nums">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="flex gap-2 p-1.5 bg-[#18181B] rounded-2xl w-fit ring-1 ring-white/5 shadow-inner overflow-x-auto max-w-full scrollbar-hide">
          {['all', 'paid', 'sent', 'overdue', 'draft'].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-5 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap scale-btn ${filter === s ? 'bg-white text-black shadow-md ring-1 ring-black/10' : 'text-text-muted hover:text-white hover:bg-white/5'}`}>{s}</button>
          ))}
        </div>

        <div className="glass-panel rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl ring-1 ring-white/10">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left min-w-[800px] lg:min-w-0">
              <thead>
                <tr className="bg-[#121214]/80 border-b border-white/5">
                  {['Invoice', 'Client', 'Date', 'Amount', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-8 py-5 text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#09090B]/40">
                {filteredInvoices.length > 0 ? filteredInvoices.map((inv) => (
                  <motion.tr layout key={inv._id} className="hover:bg-white/[0.02] transition-colors duration-300 group">
                    <td className="px-8 py-5"><span className="text-sm font-black text-white tracking-tight tabular-nums group-hover:text-primary transition-colors">#{inv.invoiceNumber}</span></td>
                    <td className="px-8 py-5"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-1 ring-primary/20"><span className="text-[10px] font-black text-primary uppercase">{inv.client?.name?.[0]}</span></div><span className="text-sm font-bold text-white tracking-tight">{inv.client?.name}</span></div></td>
                    <td className="px-8 py-5"><span className="text-xs font-bold text-text-muted tabular-nums tracking-wide">{new Date(inv.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span></td>
                    <td className="px-8 py-5"><span className="text-sm font-black text-white tabular-nums tracking-tight">₹{inv.total?.toLocaleString('en-IN')}</span></td>
                    <td className="px-8 py-5"><Badge variant={getStatusColor(inv.status)} className="uppercase tracking-widest px-3 py-1 text-[9px] font-black shadow-sm">{inv.status}</Badge></td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={() => navigate(`/app/invoices/edit/${inv._id}`)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-all scale-btn"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(inv._id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-danger hover:bg-danger/10 transition-all scale-btn">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-8 py-16 text-center text-sm font-bold text-text-muted uppercase tracking-widest">
                      No invoices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
export default InvoicesPage;

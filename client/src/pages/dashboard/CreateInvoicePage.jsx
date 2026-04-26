import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import InvoicePreview from '../../components/invoices/InvoicePreview';
import { getClients } from '../../store/slices/clientSlice';
import { createInvoice } from '../../store/slices/invoiceSlice';

const CreateInvoicePage = () => {
  const dispatch = useDispatch(), navigate = useNavigate();
  const { clients } = useSelector((state) => state.client);
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ client: '', dueDate: '', status: 'draft', items: [{ description: '', quantity: 1, unitPrice: 0 }], notes: '', tax: 0, currency: 'INR', invoiceNumber: `INV-${Date.now().toString().slice(-4)}` });

  useEffect(() => { dispatch(getClients()); }, [dispatch]);

  const handleItemChange = (i, f, v) => {
    const n = [...formData.items];
    n[i] = { ...n[i], [f]: v };
    setFormData({ ...formData, items: n });
  };

  const handleSubmit = async () => {
    if (!formData.client || !formData.dueDate) return toast.error('Fill fields');
    if (formData.items.some(i => !i.description || i.unitPrice <= 0)) return toast.error('Check items');
    const res = await dispatch(createInvoice(formData));
    if (createInvoice.fulfilled.match(res)) { toast.success('Created'); navigate('/app/invoices'); }
    else toast.error(res.payload || 'Failed');
  };

  const subtotal = formData.items.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);
  const selectedClient = (clients || []).find(c => c._id === formData.client);

  return (
    <PageWrapper title="Create">
      <div className="flex flex-col xl:flex-row gap-8 max-w-[1400px] mx-auto pb-20 px-4 md:px-0">
        <div className="flex-1 space-y-6">
          <div className="glass-panel p-6 md:p-10 rounded-[32px] border border-white/5 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 md:gap-6">
              <div className="md:col-span-3"><label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Invoice #</label><Input value={formData.invoiceNumber} onChange={e => setFormData({...formData, invoiceNumber: e.target.value})} className="!py-3" /></div>
              <div className="md:col-span-4"><label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Client</label><select className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})}><option value="">Select Client</option>{(clients || []).map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
              <div className="md:col-span-3"><label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Due Date</label><input type="date" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none color-scheme-dark" style={{ colorScheme: 'dark' }} value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} /></div>
              <div className="md:col-span-2"><label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Status</label><select className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase text-white focus:border-primary outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}><option value="draft">Draft</option><option value="sent">Sent</option><option value="paid">Paid</option></select></div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center"><h3 className="text-sm font-black text-white uppercase tracking-widest">Line Items</h3><button onClick={() => setFormData({...formData, items: [...formData.items, {description: '', quantity: 1, unitPrice: 0}]})} className="text-primary text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-white transition-all"><span className="material-symbols-outlined text-sm">add_circle</span> Add Item</button></div>
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="bg-white/[0.02] border border-white/5 p-6 rounded-[24px] space-y-4 relative group hover:border-white/10 transition-colors">
                    <div className="flex flex-col gap-2">
                      <label className="text-[8px] font-black text-text-muted uppercase tracking-widest">Description</label>
                      <input placeholder="Service or product details..." className="w-full bg-transparent text-sm text-white outline-none border-b border-white/5 pb-2 focus:border-primary/30 transition-colors" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} />
                    </div>
                    <div className="flex items-end justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="space-y-2">
                          <label className="text-[8px] font-black text-text-muted uppercase tracking-widest text-center block">Qty</label>
                          <input type="number" className="w-16 bg-[#131313] border border-white/10 rounded-lg py-2 text-center text-sm text-white focus:border-primary outline-none" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[8px] font-black text-text-muted uppercase tracking-widest text-center block">Unit Price</label>
                          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-text-muted">₹</span><input type="number" className="w-28 bg-[#131313] border border-white/10 rounded-lg py-2 pl-7 pr-3 text-sm text-white focus:border-primary outline-none" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', Number(e.target.value))} /></div>
                        </div>
                      </div>
                      {formData.items.length > 1 && (
                        <button onClick={() => setFormData({...formData, items: formData.items.filter((_, i) => i !== index)})} className="p-3 text-rose-500/20 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2"><label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Additional Notes</label><textarea placeholder="Terms, conditions, or payment instructions..." className="w-full bg-[#1A1A1A] border border-white/10 rounded-2xl p-4 text-sm text-white min-h-[100px] outline-none focus:border-primary resize-none" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} /></div>
          </div>
        </div>
        <div className="xl:w-[480px] w-full">
          <div className="sticky top-24 space-y-6">
            <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" /><span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Live Preview</span></div><Button onClick={handleSubmit} variant="brand" className="px-8">Save Invoice</Button></div>
            <div className="rounded-[32px] overflow-hidden shadow-2xl"><InvoicePreview formData={formData} selectedClient={selectedClient} user={user} subtotal={subtotal} total={subtotal + Number(formData.tax)} /></div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
export default CreateInvoicePage;

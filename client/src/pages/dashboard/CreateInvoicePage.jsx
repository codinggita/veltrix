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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clients } = useSelector((state) => state.client);
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    client: '',
    dueDate: '',
    status: 'draft',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    notes: '',
    tax: 0,
    currency: 'INR',
    invoiceNumber: `INV-${Date.now().toString().slice(-4)}`
  });

  useEffect(() => { dispatch(getClients()); }, [dispatch]);

  const handleAddItem = () => {
    setFormData({ ...formData, items: [...formData.items, { description: '', quantity: 1, unitPrice: 0 }] });
  };

  const handleRemoveItem = (index) => {
    if (formData.items.length === 1) return;
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async () => {
    if (!formData.client || !formData.dueDate) return toast.error('Please fill in required fields');
    if (formData.items.some(i => !i.description || i.unitPrice <= 0)) return toast.error('Check your items');
    
    const result = await dispatch(createInvoice(formData));
    if (createInvoice.fulfilled.match(result)) {
      toast.success('Invoice created');
      navigate('/app/invoices');
    } else {
      toast.error(result.payload || 'Failed to create invoice');
    }
  };

  const subtotal = formData.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const total = subtotal + Number(formData.tax);
  const selectedClient = (clients || []).find(c => c._id === formData.client);

  return (
    <PageWrapper title="Create">
      <div className="flex gap-8 max-w-[1400px] mx-auto pb-20">
        <div className="flex-1 space-y-8">
          <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-8">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-3 space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Invoice #</label>
                <Input value={formData.invoiceNumber} onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})} className="!py-3" />
              </div>
              <div className="col-span-4 space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Client</label>
                <select 
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                >
                  <option value="">Select a client</option>
                  {(clients || []).map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="col-span-3 space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Due Date</label>
                <input type="date" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Status</label>
                <select 
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Line Items</label>
                <button onClick={handleAddItem} className="text-primary text-[10px] font-black uppercase tracking-widest hover:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">add_circle</span> Add Item
                </button>
              </div>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {formData.items.map((item, index) => (
                    <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex gap-4 items-start bg-white/5 p-4 rounded-2xl border border-white/5">
                      <input placeholder="Desc" className="flex-1 bg-transparent border-none text-sm text-white outline-none" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} />
                      <input type="number" className="w-20 bg-[#131313] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-center outline-none" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))} />
                      <div className="w-32 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-xs">₹</span>
                        <input type="number" className="w-full bg-[#131313] border border-white/10 rounded-lg pl-7 pr-3 py-1.5 text-sm outline-none" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))} />
                      </div>
                      <button onClick={() => handleRemoveItem(index)} className="p-1 px-2 text-white/20 hover:text-rose-500"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Notes</label>
              <textarea placeholder="Internal notes..." className="w-full bg-[#1A1A1A] border border-white/10 rounded-2xl p-4 text-sm text-white min-h-[100px] outline-none focus:border-primary resize-none" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="w-[480px]">
          <div className="sticky top-24 space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Live Preview</span>
              </div>
              <Button onClick={handleSubmit} variant="brand" className="px-8 !rounded-full">Save Invoice</Button>
            </div>
            <InvoicePreview formData={formData} selectedClient={selectedClient} user={user} subtotal={subtotal} total={total} />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CreateInvoicePage;

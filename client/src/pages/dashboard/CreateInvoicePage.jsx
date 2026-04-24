import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { getClients } from '../../features/clientSlice';
import { createInvoice } from '../../features/invoiceSlice';

const CreateInvoicePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clients } = useSelector((state) => state.clients || state.client);
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    client: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    notes: '',
    tax: 0,
    currency: 'INR',
    invoiceNumber: `INV-${Date.now().toString().slice(-4)}`
  });

  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const handleRemoveItem = (index) => {
    if (formData.items.length === 1) return;
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  };

  const handleSubmit = async () => {
    if (!formData.client || !formData.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const hasEmpty = formData.items.some(i => !i.description || i.unitPrice <= 0);
    if (hasEmpty) {
      toast.error('Please provide valid descriptions and prices for all items');
      return;
    }
    
    const result = await dispatch(createInvoice(formData));
    if (createInvoice.fulfilled.match(result)) {
      toast.success('Invoice created successfully');
      navigate('/app/invoices');
    } else {
      toast.error(result.payload || 'Failed to create invoice');
    }
  };

  const subtotal = calculateSubtotal();
  const total = subtotal + Number(formData.tax);
  const selectedClient = (clients || []).find(c => c._id === formData.client);

  return (
    <PageWrapper title="Create Invoice">
      <div className="flex gap-8 max-w-[1400px] mx-auto pb-20">
        <div className="flex-1 space-y-8">
          <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-8">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-4 space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Invoice #</label>
                <Input 
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                  className="!py-3"
                />
              </div>
              <div className="col-span-5 space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Client</label>
                <select 
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                >
                  <option value="">Select a client</option>
                  {(clients || []).map(client => (
                    <option key={client._id} value={client._id}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-3 space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Due Date</label>
                <input 
                  type="date"
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Line Items</label>
                <button onClick={handleAddItem} className="text-primary text-[10px] font-black uppercase tracking-widest hover:text-white transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">add_circle</span> Add Item
                </button>
              </div>
              
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {formData.items.map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4 items-start bg-white/5 p-4 rounded-2xl border border-white/5 group"
                    >
                      <div className="flex-1 space-y-1">
                        <input 
                          placeholder="Description"
                          className="w-full bg-transparent border-none text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-0"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        />
                      </div>
                      <div className="w-20 space-y-1">
                        <input 
                          type="number"
                          placeholder="Qty"
                          className="w-full bg-[#131313] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-center focus:border-primary outline-none transition-all"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                        />
                      </div>
                      <div className="w-32 space-y-1">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-xs">₹</span>
                          <input 
                            type="number"
                            placeholder="Rate"
                            className="w-full bg-[#131313] border border-white/10 rounded-lg pl-7 pr-3 py-1.5 text-sm focus:border-primary outline-none transition-all"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                          />
                        </div>
                      </div>
                      <button onClick={() => handleRemoveItem(index)} className="p-1 px-2 text-white/20 hover:text-rose-500 transition-all">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Internal Notes</label>
              <textarea 
                placeholder="Add some notes for your own records..."
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-2xl p-4 text-sm text-white min-h-[120px] focus:outline-none focus:border-primary transition-all resize-none"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
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

            <div className="bg-[#131313] rounded-[48px] p-12 shadow-2xl border border-white/5 aspect-[1/1.414] overflow-hidden flex flex-col font-sans relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
              
              <div className="flex justify-between items-start mb-16 relative z-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                      <span className="material-symbols-outlined text-white text-2xl">account_balance_wallet</span>
                    </div>
                    <span className="text-2xl font-black text-white tracking-tighter italic">VELTRIX</span>
                  </div>
                  <div className="text-[9px] text-white/40 leading-relaxed max-w-[180px] font-black uppercase tracking-[0.2em]">
                    {user?.businessName || 'FINANCIAL OS'}<br />
                    LEVEL 42, Veltrix Tower<br />
                    BLOCK-C, FINTECH PLAZA
                  </div>
                </div>
                <div className="text-right">
                  <h1 className="text-5xl font-black text-white italic tracking-tighter leading-none">INVOICE</h1>
                  <p className="text-[10px] font-black text-primary mt-2 uppercase tracking-[0.4em]">#{formData.invoiceNumber}</p>
                </div>
              </div>

              <div className="flex justify-between mb-16 relative z-10">
                <div className="space-y-3">
                  <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">BILLING ASSET</h4>
                  <p className="text-xl font-black text-white italic tracking-tight">{selectedClient?.name || '...'}</p>
                  <div className="text-[10px] text-white/40 font-bold tracking-tight">
                    {selectedClient?.businessName || 'Business Unit'}<br />
                    {selectedClient?.email || 'network@veltrix.os'}
                  </div>
                </div>
                <div className="text-right py-2">
                  <div className="space-y-1">
                    <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">SETTLEMENT DATE</h4>
                    <p className="text-[12px] font-black text-white">{formData.dueDate || 'PENDING'}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 relative z-10">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-4 text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Description</th>
                      <th className="text-center py-4 text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Qty</th>
                      <th className="text-right py-4 text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {formData.items.map((item, i) => (
                      <tr key={i} className="text-white">
                        <td className="py-5 pr-4">
                          <p className="text-[11px] font-black italic tracking-tight underline decoration-primary/20 decoration-dashed">{item.description || '...'}</p>
                        </td>
                        <td className="py-5 text-center text-[12px] font-black tabular-nums">{item.quantity}</td>
                        <td className="py-5 text-right text-[12px] font-black tracking-tighter tabular-nums">₹{(item.quantity * item.unitPrice).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-white/5 pt-10 mt-auto space-y-4 relative z-10">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">NET LOGICAL VOLUME</span>
                  <span className="text-[14px] font-black text-white tabular-nums">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-8 rounded-[32px] border border-white/5 shadow-inner">
                  <span className="text-xl font-black text-white italic tracking-tighter">FINAL SETTLEMENT</span>
                  <span className="text-4xl font-black text-white tracking-tighter italic tabular-nums">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 pt-6 opacity-20 justify-center">
                  <span className="material-symbols-outlined text-success text-[14px]">verified_user</span>
                  <span className="text-[8px] font-black text-white uppercase tracking-[0.5em]">VELTRIX BLOCKCHAIN SECURED ASSET</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CreateInvoicePage;

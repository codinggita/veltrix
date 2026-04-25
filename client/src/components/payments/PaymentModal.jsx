import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { getClients } from '../../store/slices/clientSlice';
import { getInvoices } from '../../store/slices/invoiceSlice';
import { createPayment } from '../../store/slices/paymentSlice';

const PaymentModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { clients } = useSelector((state) => state.client);
  const { invoices } = useSelector((state) => state.invoices);
  
  const [formData, setFormData] = useState({
    client: '',
    invoice: '',
    amount: '',
    method: 'Wire Transfer',
    status: 'Paid',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(getClients());
      dispatch(getInvoices());
    }
  }, [isOpen, dispatch]);

  const filteredInvoices = invoices.filter(inv => inv.client?._id === formData.client || inv.client === formData.client);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.client || !formData.amount) {
      return toast.error('Please fill in required fields');
    }

    const result = await dispatch(createPayment(formData));
    if (createPayment.fulfilled.match(result)) {
      toast.success('Payment recorded successfully');
      onClose();
      setFormData({
        client: '',
        invoice: '',
        amount: '',
        method: 'Wire Transfer',
        status: 'Paid',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    } else {
      toast.error(result.payload || 'Failed to record payment');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Payment">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Client</label>
            <select 
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
              value={formData.client}
              onChange={(e) => setFormData({...formData, client: e.target.value, invoice: ''})}
              required
            >
              <option value="">Select Client</option>
              {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Invoice (Optional)</label>
            <select 
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              value={formData.invoice}
              onChange={(e) => {
                const inv = filteredInvoices.find(i => i._id === e.target.value);
                setFormData({...formData, invoice: e.target.value, amount: inv ? inv.total : formData.amount});
              }}
              disabled={!formData.client}
            >
              <option value="">No Invoice</option>
              {filteredInvoices.map(i => (
                <option key={i._id} value={i._id}>{i.invoiceNumber} (₹{i.total})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Amount</label>
            <Input 
              type="number" 
              placeholder="0.00" 
              value={formData.amount} 
              onChange={(e) => setFormData({...formData, amount: e.target.value})} 
              required 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Date</label>
            <input 
              type="date" 
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none" 
              value={formData.date} 
              onChange={(e) => setFormData({...formData, date: e.target.value})} 
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Method</label>
            <select 
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
              value={formData.method}
              onChange={(e) => setFormData({...formData, method: e.target.value})}
            >
              {['Wire Transfer', 'Credit Card', 'ACH Transfer', 'Cash', 'Other'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Status</label>
            <select 
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              {['Paid', 'Pending', 'Failed'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Notes</label>
          <textarea 
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-4 text-sm text-white min-h-[80px] outline-none focus:border-primary resize-none"
            placeholder="Payment reference, check number, etc."
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="neutral" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="brand" className="flex-1">Confirm Payment</Button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentModal;

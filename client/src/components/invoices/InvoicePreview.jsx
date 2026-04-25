import React from 'react';

const InvoicePreview = ({ formData, selectedClient, user, subtotal, total }) => {
  return (
    <div className="bg-[#131313] rounded-[48px] p-12 shadow-2xl border border-white/5 aspect-[1/1.414] overflow-hidden flex flex-col font-sans relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
      
      {/* Invoice Header */}
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

      {/* Billing Info */}
      <div className="flex justify-between mb-16 relative z-10">
        <div className="space-y-3">
          <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">BILLING ASSET</h4>
          <p className="text-xl font-black text-white italic tracking-tight">{selectedClient?.name || '...'}</p>
          <div className="text-[10px] text-white/40 font-bold tracking-tight">
            {selectedClient?.businessName || 'Business Unit'}<br />
            {selectedClient?.email || 'network@veltrix.os'}
          </div>
        </div>
        <div className="text-right py-2 space-y-4">
          <div className="space-y-1">
            <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">SETTLEMENT DATE</h4>
            <p className="text-[12px] font-black text-white">{formData.dueDate || 'PENDING'}</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">STATUS</h4>
            <p className={`text-[10px] font-black uppercase tracking-widest ${
              formData.status === 'paid' ? 'text-success' : 
              formData.status === 'overdue' ? 'text-error' : 
              formData.status === 'sent' ? 'text-primary' : 'text-white/40'
            }`}>{formData.status}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
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

      {/* Totals */}
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
  );
};

export default InvoicePreview;

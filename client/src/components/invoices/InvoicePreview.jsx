import React from 'react';

const InvoicePreview = ({ formData, selectedClient, user, subtotal, total }) => {
  return (
    <div className="bg-[#131313] rounded-[24px] md:rounded-[48px] p-6 md:p-12 shadow-2xl border border-white/5 flex flex-col font-sans relative min-h-[600px] lg:aspect-[1/1.414]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
      
      <div className="flex justify-between items-start mb-8 md:mb-16 relative z-10">
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl md:text-2xl">account_balance_wallet</span>
            </div>
            <span className="text-xl md:text-2xl font-black text-white tracking-tighter italic uppercase">VELTRIX</span>
          </div>
          <div className="text-[7px] md:text-[9px] text-white/40 leading-relaxed max-w-[120px] md:max-w-[180px] font-black uppercase tracking-[0.2em]">
            {user?.businessName || 'FINANCIAL OS'}<br />
            {user?.address?.street || 'LEVEL 42, Veltrix Tower'}<br />
            {user?.address?.city || 'FINTECH PLAZA'}
          </div>
        </div>
        <div className="text-right">
          <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-none">INVOICE</h1>
          <p className="text-[8px] md:text-[10px] font-black text-primary mt-1 md:mt-2 uppercase tracking-[0.4em]">#{formData.invoiceNumber}</p>
        </div>
      </div>

      <div className="flex justify-between mb-8 md:mb-16 relative z-10">
        <div className="space-y-2 md:space-y-3">
          <h4 className="text-[7px] md:text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">BILLING ASSET</h4>
          <p className="text-lg md:text-xl font-black text-white italic tracking-tight">{selectedClient?.name || '...'}</p>
          <div className="text-[8px] md:text-[10px] text-white/40 font-bold tracking-tight">
            {selectedClient?.businessName || 'Business Unit'}<br />
            {selectedClient?.email || 'network@veltrix.os'}
          </div>
        </div>
        <div className="text-right py-1 md:py-2 space-y-2 md:space-y-4">
          <div className="space-y-0.5 md:space-y-1">
            <h4 className="text-[7px] md:text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">SETTLEMENT DATE</h4>
            <p className="text-[10px] md:text-[12px] font-black text-white">{formData.dueDate || 'PENDING'}</p>
          </div>
          <div className="space-y-0.5 md:space-y-1">
            <h4 className="text-[7px] md:text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">STATUS</h4>
            <p className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${formData.status === 'paid' ? 'text-success' : formData.status === 'overdue' ? 'text-error' : formData.status === 'sent' ? 'text-primary' : 'text-white/40'}`}>{formData.status}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 relative z-10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left py-4 text-[7px] md:text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Description</th>
              <th className="text-center py-4 text-[7px] md:text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Qty</th>
              <th className="text-right py-4 text-[7px] md:text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {formData.items.map((item, i) => (
              <tr key={i} className="text-white">
                <td className="py-4 md:py-5 pr-4 truncate max-w-[100px] md:max-w-none"><p className="text-[9px] md:text-[11px] font-black italic tracking-tight">{item.description || '...'}</p></td>
                <td className="py-4 md:py-5 text-center text-[10px] md:text-[12px] font-black tabular-nums">{item.quantity}</td>
                <td className="py-4 md:py-5 text-right text-[10px] md:text-[12px] font-black tabular-nums">₹{(item.quantity * (item.unitPrice || 0)).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-white/5 pt-6 md:pt-10 mt-auto space-y-3 md:space-y-4 relative z-10">
        <div className="flex justify-between items-center px-1">
          <span className="text-[7px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">NET LOGICAL VOLUME</span>
          <span className="text-[12px] md:text-[14px] font-black text-white tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between items-center bg-white/5 p-4 md:p-8 rounded-[20px] md:rounded-[32px] border border-white/5">
          <span className="text-xs md:text-xl font-black text-white italic tracking-tighter">FINAL SETTLEMENT</span>
          <span className="text-xl md:text-4xl font-black text-white tracking-tighter italic tabular-nums">₹{total.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex items-center gap-2 pt-4 md:pt-6 opacity-20 justify-center">
          <span className="material-symbols-outlined text-success text-[10px] md:text-[14px]">verified_user</span>
          <span className="text-[6px] md:text-[8px] font-black text-white uppercase tracking-[0.2em] md:tracking-[0.5em]">VELTRIX BLOCKCHAIN SECURED ASSET</span>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;

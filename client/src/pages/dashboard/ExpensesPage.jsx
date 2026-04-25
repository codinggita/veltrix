import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import PageWrapper from '../../components/layout/PageWrapper';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ExpenseModal from '../../components/expenses/ExpenseModal';
import { getExpenses, deleteExpense } from '../../store/slices/expenseSlice';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ExpensesPage = () => {
  const dispatch = useDispatch();
  const { expenses, isLoading } = useSelector((state) => state.expenses);
  const [activeCategory, setActiveCategory] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  useEffect(() => {
    dispatch(getExpenses());
  }, [dispatch]);

  const filteredExpenses = activeCategory === 'All' 
    ? expenses 
    : expenses.filter(e => e.category === activeCategory);

  const handleDelete = async (id) => {
    if (window.confirm('Archive this expense record?')) {
      const result = await dispatch(deleteExpense(id));
      if (deleteExpense.fulfilled.match(result)) {
        toast.success('Expense deleted');
      } else {
        toast.error(result.payload || 'Deletion failed');
      }
    }
  };

  const handleEdit = (expense) => {
    setExpenseToEdit(expense);
    setIsModalOpen(true);
  };

  const columns = [
    { 
      header: 'Date', 
      accessor: 'date',
      render: (row) => <span className="text-xs font-medium text-text-muted">{formatDate(row.date)}</span>
    },
    { 
      header: 'Category', 
      accessor: 'category',
      render: (row) => (
        <Badge variant="neutral" className="uppercase tracking-widest px-3 py-1 text-[9px] font-black border border-white/5 bg-white/5">
          {row.category}
        </Badge>
      )
    },
    { 
      header: 'Description', 
      accessor: 'description',
      render: (row) => <span className="text-sm font-bold text-white line-clamp-1 max-w-[300px]">{row.description}</span>
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
      header: 'Actions', 
      accessor: '_id',
      render: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => handleEdit(row)} className="text-text-muted hover:text-primary transition-all">
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button onClick={() => handleDelete(row._id)} className="text-text-muted hover:text-rose-500 transition-all">
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      )
    }
  ];

  // Stats calculation
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const thisMonth = expenses
    .filter(e => new Date(e.date).getMonth() === new Date().getMonth())
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const categoriesMap = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});
  const largestCategory = Object.entries(categoriesMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return (
    <PageWrapper title="Expenses">
      <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white tracking-tight text-glow">Operation Costs</h2>
            <p className="text-sm text-text-muted font-medium">Track and categorize business expenditures.</p>
          </div>
          <Button onClick={() => { setExpenseToEdit(null); setIsModalOpen(true); }} variant="brand">
            Add Expense
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Expenditures', value: formatCurrency(totalExpenses) },
            { label: 'This Month', value: formatCurrency(thisMonth) },
            { label: 'Largest Category', value: largestCategory }
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-all" />
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <h3 className="text-2xl font-black text-white italic tracking-tighter">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Filters and Table */}
        <div className="glass-panel rounded-[32px] border border-white/5 overflow-hidden">
          <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
            <div className="flex gap-2">
              {['All', 'Marketing', 'Rent', 'Salaries', 'Software', 'Other'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeCategory === cat ? 'bg-white text-black' : 'text-text-muted hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <Table 
            columns={columns} 
            data={filteredExpenses} 
            loading={isLoading} 
            emptyMessage="No expense records found."
          />
        </div>
      </div>

      <ExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        expenseToEdit={expenseToEdit}
      />
    </PageWrapper>
  );
};

export default ExpensesPage;

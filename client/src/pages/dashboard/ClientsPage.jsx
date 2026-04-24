import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getClients, deleteClient } from '../../features/clientSlice';
import PageWrapper from '../../components/layout/PageWrapper';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import ClientModal from '../../components/clients/ClientModal';

const ClientsPage = () => {
  const dispatch = useDispatch();
  const { clients, isLoading } = useSelector((state) => state.client);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);

  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);

  const handleOpenModal = (client = null) => {
    setClientToEdit(client);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      dispatch(deleteClient(id));
    }
  };

  const columns = [
    { 
      header: 'Client Name', 
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary/10 text-primary flex justify-center items-center font-bold text-xs uppercase tracking-wider">
            {row.name.charAt(0)}
          </div>
          <span className="font-semibold text-text-primary">{row.name}</span>
        </div>
      )
    },
    { header: 'Email Address', accessor: 'email', render: (row) => row.email || <span className="text-text-muted italic">N/A</span> },
    { header: 'Phone', accessor: 'phone', render: (row) => row.phone || <span className="text-text-muted italic">N/A</span> },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleOpenModal(row)}
            className="text-text-muted hover:text-primary transition-colors text-sm font-medium flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="text-text-muted hover:text-error transition-colors text-sm font-medium flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      ),
    },
  ];

  const actions = (
    <Button onClick={() => handleOpenModal()}>
      + New Client
    </Button>
  );

  return (
    <PageWrapper title="Clients" actions={actions}>
      <Table 
        columns={columns} 
        data={clients} 
        loading={isLoading} 
        emptyMessage="No clients found. Add your first client to start generating invoices."
      />
      <ClientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        clientToEdit={clientToEdit} 
      />
    </PageWrapper>
  );
};

export default ClientsPage;

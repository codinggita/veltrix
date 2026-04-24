import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { createClient, updateClient } from '../../features/clientSlice';

const ClientModal = ({ isOpen, onClose, clientToEdit = null }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    if (clientToEdit) {
      setFormData({
        name: clientToEdit.name || '',
        email: clientToEdit.email || '',
        phone: clientToEdit.phone || '',
      });
    } else {
      setFormData({ name: '', email: '', phone: '' });
    }
  }, [clientToEdit, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (clientToEdit) {
      dispatch(updateClient({ id: clientToEdit._id, data: formData }));
    } else {
      dispatch(createClient(formData));
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={clientToEdit ? 'Edit Client Details' : 'Add New Client'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g. Acme Corporation"
        />
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="billing@acmecorp.com"
        />
        <Input
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+91 9786543210"
        />
        <div className="flex justify-end gap-3 pt-6 border-t border-border-dark mt-6">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit">
            {clientToEdit ? 'Save Changes' : 'Create Client'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ClientModal;

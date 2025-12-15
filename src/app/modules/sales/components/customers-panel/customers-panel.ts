import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interfaces locales
interface Customer {
  id: number;
  name: string;
  type: 'empresa' | 'negocio' | 'persona';
  ruc: string;
  phone: string;
  email: string;
  location: string;
  category: 'regular' | 'premium' | 'vip';
  creditLimit: number;
  paymentTerms: string;
  salesRepresentative: string;
  lastPurchase: Date | null;
  totalPurchases: number;
  notes: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

@Component({
  selector: 'app-customers-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers-panel.html',
  styleUrl: './customers-panel.css'
})
export class CustomersPanel {
  customers: Customer[] = [
    {
      id: 1,
      name: 'Acuícola del Pacífico S.A.',
      type: 'empresa',
      ruc: '1798765432001',
      phone: '099-875-4123',
      email: 'ventas@acuipacifico.com',
      location: 'Guayaquil, Ecuador',
      category: 'premium',
      creditLimit: 50000,
      paymentTerms: '30 días',
      salesRepresentative: 'María González',
      lastPurchase: new Date('2024-01-15'),
      totalPurchases: 68500,
      notes: 'Cliente preferencial, paga puntualmente',
      status: 'active',
      createdAt: new Date('2023-05-10')
    },
    {
      id: 2,
      name: 'Mariscos del Litoral',
      type: 'negocio',
      ruc: '0908765432',
      phone: '098-123-4567',
      email: 'mariscos@litoral.ec',
      location: 'Manta, Ecuador',
      category: 'premium',
      creditLimit: 30000,
      paymentTerms: '15 días',
      salesRepresentative: 'Carlos Ruiz',
      lastPurchase: new Date('2024-01-10'),
      totalPurchases: 42100,
      notes: 'Pide productos premium regularmente',
      status: 'active',
      createdAt: new Date('2023-06-15')
    }
  ];
  
  filteredCustomers: Customer[] = [...this.customers];
  isLoading = false;
  error: string | null = null;
  
  // Filtros
  searchTerm = '';
  statusFilter = 'all';
  categoryFilter = 'all';
  
  // Modal
  showModal = false;
  editingCustomer: Customer | null = null;
  
  // Formulario 
  customerForm = {
    name: '',
    type: 'empresa' as 'empresa' | 'negocio' | 'persona',
    ruc: '',
    phone: '',
    email: '',
    location: '',
    category: 'regular' as 'regular' | 'premium' | 'vip',
    creditLimit: 0,
    paymentTerms: '',
    notes: ''
  };

  // ========== FILTROS ==========
  applyFilters() {
    this.filteredCustomers = this.customers.filter(customer => {
      const matchesSearch = !this.searchTerm || 
        customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.ruc.includes(this.searchTerm) ||
        customer.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || 
        customer.status === this.statusFilter;
      
      const matchesCategory = this.categoryFilter === 'all' || 
        customer.category === this.categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }

  // ========== MODAL ==========
  openAddModal() {
    this.editingCustomer = null;
    this.customerForm = {
      name: '',
      type: 'empresa',
      ruc: '',
      phone: '',
      email: '',
      location: '',
      category: 'regular',
      creditLimit: 0,
      paymentTerms: '',
      notes: ''
    };
    this.showModal = true;
  }

  openEditModal(customer: Customer) {
    this.editingCustomer = customer;
    this.customerForm = {
      name: customer.name,
      type: customer.type,
      ruc: customer.ruc,
      phone: customer.phone,
      email: customer.email,
      location: customer.location,
      category: customer.category,
      creditLimit: customer.creditLimit,
      paymentTerms: customer.paymentTerms,
      notes: customer.notes
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingCustomer = null;
  }

  // ========== CRUD ==========
  saveCustomer() {
    if (this.editingCustomer) {
      const index = this.customers.findIndex(c => c.id === this.editingCustomer!.id);
      if (index !== -1) {
        this.customers[index] = {
          ...this.customers[index],
          ...this.customerForm,
          id: this.customers[index].id,
          totalPurchases: this.customers[index].totalPurchases,
          lastPurchase: this.customers[index].lastPurchase,
          salesRepresentative: this.customers[index].salesRepresentative,
          status: this.customers[index].status,
          createdAt: this.customers[index].createdAt
        };
        this.applyFilters();
        this.closeModal();
      }
    } else {
      const newCustomer: Customer = {
        id: Math.max(...this.customers.map(c => c.id)) + 1,
        ...this.customerForm,
        salesRepresentative: 'Sin asignar',
        lastPurchase: null,
        totalPurchases: 0,
        status: 'active',
        createdAt: new Date()
      };
      
      this.customers.push(newCustomer);
      this.applyFilters();
      this.closeModal();
    }
  }

  deleteCustomer(customer: Customer) {
    if (confirm(`¿Estás seguro de eliminar a ${customer.name}?`)) {
      this.customers = this.customers.filter(c => c.id !== customer.id);
      this.applyFilters();
    }
  }

  loadCustomers() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.applyFilters();
    }, 500);
  }

  // ========== HELPERS ==========
  getCustomerTypeIcon(type: string): string {
    switch (type) {
      case 'empresa': return '🏢';
      case 'negocio': return '🏪';
      case 'persona': return '👤';
      default: return '👥';
    }
  }

  getStatusBadgeClass(status: string): string {
    return status === 'active' ? 'status-active' : 'status-inactive';
  }

  trackByCustomerId(index: number, customer: Customer): number {
    return customer.id;
  }
}
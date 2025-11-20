import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';
import { EditProduct } from '../edit-product/edit-product';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class Products {

  productos = [
    { id: 1, lote: "L001", tipo: "Camarón Vannamei", estanque: "Estanque 1", stock: 5000, peso: 15 },
    { id: 2, lote: "L002", tipo: "Camarón Tigre Negro", estanque: "Estanque 2", stock: 4200, peso: 18 },
    { id: 3, lote: "L003", tipo: "Camarón Rosado", estanque: "Estanque 1", stock: 3800, peso: 12 },
    { id: 4, lote: "L004", tipo: "Camarón Blanco del Pacífico", estanque: "Estanque 3", stock: 6400, peso: 20 }
  ];

  // --- FILTROS ---
  filtroLote = "";
  filtroTipo = "";
  filtroEstanque = "";

  // --- LISTAS DINÁMICAS PARA LOS SELECT ---
  lotes: string[] = [...new Set(this.productos.map(p => p.lote))];
  tipos: string[] = [...new Set(this.productos.map(p => p.tipo))];
  estanques: string[] = [...new Set(this.productos.map(p => p.estanque))];

  // --- LISTA FILTRADA ---
  productosFiltrados = [...this.productos];
  // --- PRODUCTO PARA MODAL "VER" ---
  productoSeleccionado: any = null;
  // --- PRODUCTO PARA MODAL "EDITAR" ---
  productoEditando: any = {};
  
  constructor(private dialog: MatDialog) {}


  // --- MÉTODOS --
  filtrar() {
    this.productosFiltrados = this.productos.filter(p =>
      (this.filtroLote ? p.lote === this.filtroLote : true) &&
      (this.filtroTipo ? p.tipo === this.filtroTipo : true) &&
      (this.filtroEstanque ? p.estanque === this.filtroEstanque : true)
    );
  }

  verProducto(p: any) {
    this.productoSeleccionado = { ...p };
  }

  agregarProducto(form: any) {
    if (!form.valid) return;

    const nuevo = {
      id: this.productos.length + 1,
      ...form.value
    };

    this.productos.push(nuevo);
    this.lotes = [...new Set(this.productos.map(p => p.lote))];
    this.tipos = [...new Set(this.productos.map(p => p.tipo))];
    this.estanques = [...new Set(this.productos.map(p => p.estanque))];

    this.filtrar();
    form.reset();
  }

  editarProducto(producto: any) {
  const dialogRef = this.dialog.open(EditProduct, {
    width: '450px',
    data: {
      ...producto,
      tipos: this.tipos,          // enviar lista dinámica
      estanques: this.estanques   // enviar lista dinámica
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const index = this.productos.findIndex(p => p.id === result.id);
      if (index !== -1) {
        this.productos[index] = result;
        this.filtrar();
      }
    }
  });
}



  guardarEdicion() {
    const index = this.productos.findIndex(x => x.id === this.productoEditando.id);

    if (index !== -1) {
      this.productos[index] = { ...this.productoEditando };
      this.lotes = [...new Set(this.productos.map(p => p.lote))];
      this.tipos = [...new Set(this.productos.map(p => p.tipo))];
      this.estanques = [...new Set(this.productos.map(p => p.estanque))];

      this.filtrar();
    }
  }

  eliminarProducto(id: number) {
    this.productos = this.productos.filter(p => p.id !== id);
    this.lotes = [...new Set(this.productos.map(p => p.lote))];
    this.tipos = [...new Set(this.productos.map(p => p.tipo))];
    this.estanques = [...new Set(this.productos.map(p => p.estanque))];

    this.filtrar();
  }
}

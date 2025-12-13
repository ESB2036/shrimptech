import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
//DIALOG
import { EditProduct } from './edit-product/edit-product';
import { AddProduct } from './add-product/add-product';
import { ViewProduct } from './view-product/view-product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatToolbarModule
  ],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class Products {

  //PRODUCTOS 
  productos = [
    { id: 1, lote: "L001", tipo: "Camarón Vannamei", estanque: "Estanque 1", stock: 5000, peso: 15 },
    { id: 2, lote: "L002", tipo: "Camarón Tigre Negro", estanque: "Estanque 2", stock: 4200, peso: 18 },
    { id: 3, lote: "L003", tipo: "Camarón Rosado", estanque: "Estanque 1", stock: 3800, peso: 12 },
    { id: 4, lote: "L004", tipo: "Camarón Blanco del Pacífico", estanque: "Estanque 3", stock: 6400, peso: 20 }
  ];

  //FILTROS
  filtroLote = "";
  filtroTipo = "";
  filtroEstanque = "";

  //DATOS FILTROS
  tiposOriginales = [
  "Camarón Vannamei",
  "Camarón Tigre Negro",
  "Camarón Rosado",
  "Camarón Blanco del Pacífico"
];

estanquesOriginales = [
  "Estanque 1",
  "Estanque 2",
  "Estanque 3",
  "Estanque 4"
];

  //LISTAS DINÁMICAS
  lotes = [...new Set(this.productos.map(p => p.lote))];
  tipos = [...new Set(this.productos.map(p => p.tipo))];
  estanques = [...new Set(this.productos.map(p => p.estanque))];

  //PRODUCTOS FILTRADOS
  productosFiltrados = [...this.productos];

  //TABLA
  displayedColumns: string[] = [
    'id',
    'lote',
    'tipo',
    'estanque',
    'stock',
    'peso',
    'acciones'
  ];

  constructor(private dialog: MatDialog) { }

  //FILTRAR
  filtrar() {
    this.productosFiltrados = this.productos.filter(p =>
      (this.filtroLote ? p.lote === this.filtroLote : true) &&
      (this.filtroTipo ? p.tipo === this.filtroTipo : true) &&
      (this.filtroEstanque ? p.estanque === this.filtroEstanque : true)
    );
  }

  //AGREGAR
  openAgregarDialog() {
  const dialogRef = this.dialog.open(AddProduct, {
    data: {
      nuevo: true,
      tipos: this.tiposOriginales,
      estanques: this.estanquesOriginales
    }
  });

  dialogRef.afterClosed().subscribe((result: any) => {
    if (result) {
      result.id = this.productos.length + 1;   
      this.productos.push(result);              
      this.actualizarListas();                 
      this.filtrar();                         
    }
  });
}

 //EDITAR 
  openEditarDialog(producto: any) {
    const dialogRef = this.dialog.open(EditProduct, {
      data: {
        tipos: this.tipos,
        estanques: this.estanques,
        producto: { ...producto }  
      }
    });

  dialogRef.afterClosed().subscribe((result: any) => {
    if (result) {
      const index = this.productos.findIndex(p => p.id === result.id);
      if (index >= 0) {
        this.productos[index] = result; 
        this.actualizarListas();
        this.filtrar();
      }
    }
  });
}

  //VER
  openVerDialog(producto: any) {
    this.dialog.open(ViewProduct, {
    data: { producto }
    });
  }

  //ELIMINAR
  eliminarProducto(id: number) {
    this.productos = this.productos.filter(p => p.id !== id);
    this.actualizarListas();
    this.filtrar();
  }

  //ACTUALIZAR LISTAS
  actualizarListas() {
    this.lotes = [...new Set(this.productos.map(p => p.lote))];
    this.tipos = [...new Set(this.productos.map(p => p.tipo))];
    this.estanques = [...new Set(this.productos.map(p => p.estanque))];
  }
}


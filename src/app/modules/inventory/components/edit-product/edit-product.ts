import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-product.html',
  styleUrls: ['./edit-product.css'],
})
export class EditProduct {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditProduct>
  ) {}

  guardar() {
    this.dialogRef.close(this.data);
  }

  cerrar() {
    this.dialogRef.close();
  }
}

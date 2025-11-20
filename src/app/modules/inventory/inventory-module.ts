import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryRoutingModule } from './inventory-routing-module';
import { RouterModule } from '@angular/router';


import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    InventoryRoutingModule,
    RouterModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
  ],
})
export class InventoryModule {}

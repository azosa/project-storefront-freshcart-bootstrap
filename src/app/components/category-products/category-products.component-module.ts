import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryProductsComponent } from './category-products.component';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  imports: [CommonModule, RouterModule, ReactiveFormsModule,MatSelectModule],
  declarations: [CategoryProductsComponent],
  providers: [],
  exports: [CategoryProductsComponent]
})
export class CategoryProductsComponentModule {
}

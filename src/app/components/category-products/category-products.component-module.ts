import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryProductsComponent } from './category-products.component';
import { MatSelectModule } from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
@NgModule({
  imports: [CommonModule, RouterModule, ReactiveFormsModule,MatSelectModule,MatButtonModule,MatButtonToggleModule],
  declarations: [CategoryProductsComponent],
  providers: [],
  exports: [CategoryProductsComponent]
})
export class CategoryProductsComponentModule {
}

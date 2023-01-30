import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponentModule } from '../home/home.component-module';
import { StoreProductsComponent } from './store-products.component';
import { CommonModule } from '@angular/common';
@NgModule({
  imports: [ReactiveFormsModule, HomeComponentModule,CommonModule],
  declarations: [StoreProductsComponent],
  providers: [],
  exports: [StoreProductsComponent]
})
export class StoreProductsComponentModule {
}

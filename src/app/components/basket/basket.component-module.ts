import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BasketComponent } from './basket.component';

@NgModule({
  imports: [CommonModule],
  declarations: [BasketComponent],
  providers: [],
  exports: [BasketComponent]
})
export class BasketComponentModule {
}

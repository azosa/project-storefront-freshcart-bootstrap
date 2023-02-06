import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WishlistComponent } from './wishlist.component';

@NgModule({
  imports: [CommonModule],
  declarations: [WishlistComponent],
  providers: [],
  exports: [WishlistComponent]
})
export class WishlistComponentModule {
}

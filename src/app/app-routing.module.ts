import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CategoryProductsComponent } from './components/category-products/category-products.component';
import { StoreProductsComponent } from './components/store-products/store-products.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { BasketComponent } from './components/basket/basket.component';
import { HomeComponentModule } from './components/home/home.component-module';
import { CategoryProductsComponentModule } from './components/category-products/category-products.component-module';
import { StoreProductsComponentModule } from './components/store-products/store-products.component-module';
import { WishlistComponentModule } from './components/wishlist/wishlist.component-module';
import { BasketComponentModule } from './components/basket/basket.component-module';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'categories/:categoryId', component: CategoryProductsComponent },
  { path: 'stores/:storeId', component: StoreProductsComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'basket', component: BasketComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    HomeComponentModule,
    CategoryProductsComponentModule,
    StoreProductsComponentModule,
    WishlistComponentModule,
    BasketComponentModule
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }

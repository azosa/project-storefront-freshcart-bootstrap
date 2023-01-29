import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';


@NgModule({
    declarations: [HomeComponent],
    providers: [],
    exports: [HomeComponent],
    imports: [CommonModule, RouterModule]
})
export class HomeComponentModule {
}

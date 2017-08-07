import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
import { CartComponent } from './components/cart.component';

@NgModule({
  declarations: [
    CartComponent
  ],
  imports: [
    // angular modules
    CommonModule,
    FormsModule,

    // Custom Modules
    
  ],
  exports: [
    CartComponent
  ],
})

export class CartModule { }
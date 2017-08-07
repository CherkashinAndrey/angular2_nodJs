import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
import { LogoComponent } from './components/logo.component';

@NgModule({
  declarations: [
    LogoComponent
  ],
  imports: [
    // angular modules
    CommonModule,
    FormsModule,

    // Custom Modules
    
  ],
  exports: [
    LogoComponent
  ],
})
export class LogoModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { logoComponent, NgbdModalComponent, NgbdModalContent } from './components/login.component';

@NgModule({
  declarations: [
    logoComponent,
    NgbdModalContent,
    NgbdModalComponent,
  ],
  imports: [
    // angular modules
    CommonModule,
    FormsModule,
    BrowserModule, 
    ReactiveFormsModule, 
    JsonpModule, 
    NgbModule.forRoot(),

    // Custom Modules
    
  ],
  entryComponents: [NgbdModalContent],
  exports: [
    logoComponent,
    NgbdModalContent,
    NgbdModalComponent,
  ],
  bootstrap: [logoComponent]
})

export class loginModule { }
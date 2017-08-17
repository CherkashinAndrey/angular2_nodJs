import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule }   from '@angular/router';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
 
import { LogoModule } from './components/logo/logo.module';
import { GenderModule } from './components/gender-link/gender-link.module';
import { loginModule } from './components/login/login.module';
import { CartModule } from './components/cart/cart.module';
import { ContainerComponent } from './components/container/container.component';
import { ThumbnailComponent } from './components/thumbnail/thumbnail.component';
import { AddItemsComponent } from './components/addItems/addItems.component';

import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { DialogService } from "ng2-bootstrap-modal";

import { AdditionCalculateWindow, AdditionCalculateWindowData } from './components/modal/thumbnailModal.component';

import { HeroDetailComponent } from './hero-detail.component';
import { HeroesComponent }     from './heroes.component';
import { HeroService }         from './hero.service';

import { GenderService } from './service/gender.service';
import { ThumbnailService } from  './service/thumbnail.service';

import { NgbdModalContentItem, NgbdModalComponentItem } from './components/addItems/addItems.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    HeroDetailComponent,
    HeroesComponent,
    ContainerComponent,
    ThumbnailComponent,
    AddItemsComponent,
    NgbdModalContentItem,
    NgbdModalComponentItem,
    AdditionCalculateWindow,
    DialogService,
  ],
  imports: [
    // angular modules
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    ModalModule.forRoot(),
    BootstrapModalModule,
    // Custom Modules
    LogoModule,
    GenderModule,
    loginModule,
    CartModule,
    NgbModule.forRoot(),
    RouterModule.forRoot([
      {
        path: 'man',
        component: GenderService
      },
      {
        path: 'women',
        component: GenderService
      }
    ]),
  ],
  entryComponents: [NgbdModalContentItem, NgbdModalComponentItem, AdditionCalculateWindow],
  exports: [
    NgbdModalContentItem,
    NgbdModalComponentItem,
    DialogService,
  ],
  providers: [HeroService, GenderService, HttpModule, ThumbnailService],
  bootstrap: [AppComponent]
})



export class AppModule { }

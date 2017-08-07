import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule }   from '@angular/router';
import { HttpModule } from '@angular/http';
 
import { LogoModule } from './components/logo/logo.module';
import { GenderModule } from './components/gender-link/gender-link.module';
import { loginModule } from './components/login/login.module';
import { CartModule } from './components/cart/cart.module';
import { ContainerComponent } from './components/container/container.component';
import { ThumbnailComponent } from './components/thumbnail/thumbnail.component';
import { AddItemsComponent } from './components/addItems/addItems.component';

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
  ],
  imports: [
    // angular modules
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,

    // Custom Modules
    LogoModule,
    GenderModule,
    loginModule,
    CartModule,
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
  entryComponents: [NgbdModalContentItem],
  exports: [
    NgbdModalContentItem,
    NgbdModalComponentItem,
  ],
  providers: [HeroService, GenderService, HttpModule, ThumbnailService],
  bootstrap: [AppComponent]
})



export class AppModule { }

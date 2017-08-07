import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule }   from '@angular/router';
 
import { GenderComponent } from './components/gender.components';

import { HeroesComponent } from './../../heroes.component'

@NgModule({
  declarations: [
    GenderComponent
  ],
  imports: [
    // angular modules
    CommonModule,
    FormsModule,
    RouterModule.forRoot([
    {
      path: 'men',
      component: HeroesComponent
    },
    {
      path: 'women',
      component: HeroesComponent
    },
    {
      path: 'children',
      component: HeroesComponent
    }
  ]),

    // Custom Modules
    
  ],
  exports: [
    GenderComponent
  ],
})

export class  GenderModule { }
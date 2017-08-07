import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
import { PassengerDashboardComponent } from './containers/passenger-dashboard/passenger-dashboard.components';

import { PassengerCountComponent } from './components/passenger-count/passenger-count.component';
import { PassengerDetailComponent } from './components/passenger-detail/passenger-detail.component';



@NgModule({
  declarations: [
      PassengerDashboardComponent,
      PassengerCountComponent,
      PassengerDetailComponent,
  ],
  imports: [
    // angular modules
    CommonModule,
    FormsModule,

    // Custom Modules
    
  ],
  exports: [
      PassengerDashboardComponent
  ],
})
export class DashboardModule { }
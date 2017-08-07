import { Component, OnInit } from '@angular/core';

import { Passenger } from '../../models/passenger.interfase';

@Component({
    selector: 'passenger-dashboard',
    templateUrl: './passenger-dashboard.component.html',
    styleUrls: ['./passenger-dashboard.scss']
})


export class PassengerDashboardComponent implements OnInit {
   objSame: Passenger[];

  constructor() {

  }  

  ngOnInit() {
      this.objSame = [
    {"id" : 1, "firstMane": "Anna", "age": 20, "checked": true},
    {"id" : 2, "firstMane": "Peet", "age": 30, "checked": true},
    {"id" : 3, "firstMane": "Sergio", "age": 25, "checked": true},
    {"id" : 4, "firstMane": "Kuzya", "age": 21, "checked": false},
    {"id" : 5, "firstMane": "Motis", "age": 15, "checked": false },
  ]
  }
}

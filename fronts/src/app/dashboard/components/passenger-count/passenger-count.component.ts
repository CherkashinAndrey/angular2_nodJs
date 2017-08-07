import { Component, Input } from '@angular/core';

import { Passenger } from '../../models/passenger.interfase';

@Component({
    selector: 'passenger-count',
    templateUrl: './passenger-count.component.html',
    styleUrls: ['./passenger-count.component.scss']
})


export class PassengerCountComponent {
    @Input()
    items: Passenger[];

    checkedInCount(): number {
        if (!this.items) {
            return;
        }
        return this.items.filter((el:Passenger) => {
            return el.checked;
        }).length;
    }

    constructor() {

    }
}
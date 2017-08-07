import { Component, Input, Output, EventEmitter, OnInit  } from '@angular/core';

import { HeroService } from './hero.service';

@Component({
  selector: 'my-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: [ './heroes.component.scss' ]
})




export class HeroesComponent  {
  title = 'Tour of Heroes HeroesComponent';

  constructor() {

  }

}

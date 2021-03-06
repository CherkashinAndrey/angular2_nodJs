import { Component, Input, Output, EventEmitter, OnInit  } from '@angular/core';

import { HeroService } from './hero.service';

const HEROES: Hero[] = [
  { id: 11, name: 'Mr. Nice' },
  { id: 12, name: 'Narco' },
  { id: 13, name: 'Bombasto' },
  { id: 14, name: 'Celeritas' },
  { id: 15, name: 'Magneta' },
  { id: 16, name: 'RubberMan' },
  { id: 17, name: 'Dynama' },
  { id: 18, name: 'Dr IQ' },
  { id: 19, name: 'Magma' },
  { id: 20, name: 'Tornado' }
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [HeroService],
})




export class AppComponent  {
  title = 'Tour of Heroes';
  // heroes: Hero[];
  // selectedHero: Hero;

  constructor(private heroService: HeroService) {
    //  heroService = new HeroService(); // don't do this
  }

  // getHeroes(): void {
  //   this.heroService.getHeroes()
  //     .then( (heroes) => {
  //       this.heroes = heroes;
  //     })
  // }

  // ngOnInit(): void {
  //   this.getHeroes();
  // }

  // onSelect(hero: Hero): void {
  //   this.selectedHero = hero;
  //   console.log(this.selectedHero);
  // }

}



export class Hero {
  id: number;
  name: string;
}

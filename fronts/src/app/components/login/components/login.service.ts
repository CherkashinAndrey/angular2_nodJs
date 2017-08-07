// import { Injectable } from '@angular/core';
// import { Http }       from '@angular/http';
 
// import { Observable }     from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
 
// // import { Hero }           from './hero';
 
// @Injectable()
// export class loginService {
 
//   constructor(private http: Http) {}
 
//   search(term: string): Observable<Hero[]> {
//     return this.http
//                .get(`api/heroes/?name=${term}`)
//                .map(response => response.json().data as Hero[]);
//   }
// }


import { Injectable } from '@angular/core';
import { Login } from '../../../model/login.model';



// @Injectable()
// export class loginService {
//   getHeroes(): Login[] {
//     return [
//       {'email':'111@ee.ff' , 'password': '999'},
//       {'email':'34@hg.ff' , 'password': '88'},
//       {'email':'45@j.ff' , 'password': '111'},
//       {'email':'21@kk.ff' , 'password': '222'},
//       {'email':'345@lff.ff' , 'password': '333'},
//     ];
//   }
// }
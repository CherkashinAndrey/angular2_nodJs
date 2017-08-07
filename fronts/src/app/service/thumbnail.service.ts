import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

import { Gender } from './../interface/gender.interface';

@Injectable()
export class ThumbnailService {
    public thumbnails: Observable<Gender[]>
    public _thumbnails =  new Subject<any>();
    private dataStore: {
        thumbnails: Gender[]
    };
    dataThumbnail = [ 
                    { id: 100, name: 'Mr. Nice' },
                    { id: 102, name: 'Narco' },
                    { id: 103, name: 'Bombasto' },
                ];

    constructor(private http: Http) {
        // this.dataStore = { thumbnails: [] };
        // console.log(this.dataStore);
        this.thumbnails = this._thumbnails.asObservable();
    }   

    getThumbnail(): Promise<Gender[]> {
        // this.thumbnails = Promise.resolve(this.dataThumbnail);
        return Promise.resolve(this.dataThumbnail);
    }

    loadAll() {
        // debugger
        //  this.http.get(`http://localhost:9128/auth/logout`).map(response => response.json()).subscribe(data => {
        //     this.dataStore.thumbnails = data;
        //  }, error => console.log('Could not load .'));
        // console.log(this.dataStore);
    }

    addItem(item) {
        item = JSON.stringify(item);
        return this.http
            .post('http://127.0.0.1:9128/items/add', item)
            .subscribe(data => {
                debugger
            }, error => {
                console.log('error');
            });
    }

    setThumbnail(gender) {
        switch(gender) {
            case 'women' : 
                this.dataStore.thumbnails = [
                    { id: 11, name: 'Mr. Nice' },
                    { id: 12, name: 'Narco' },
                    { id: 13, name: 'Bombasto' },
                ]
            break;

            case 'men' : 
               this.dataThumbnail = [
                    { id: 18, name: 'Dr IQ' },
                    { id: 19, name: 'Magma' },
                    { id: 20, name: 'Tornado' }
                ]
            break;

        }
    }

    changeSources(data) {
        this._thumbnails.next(data);
    }

    getSources():Observable< Gender[] > {
        return this.http.get(`http://localhost:9128/getitems`)
            .map(response => {
                console.log('<<<>>>>',response.json());
                 return response.json(); //.sources as Gender[];
            })
            .catch(this.errorHandler)
    }

    getAllArticlesBySourcesArr(sourcesArr) {
        let requestsArr:any = [];
        // sourcesArr.forEach(element => {
        //     let requestItem = this.http
        //         .get(ARTICLES_END_POINT + `?source=${element.id}&apiKey=${API_KEY}`)
        //         .map(response => Object.assign(element, response.json()))
        //         .catch(this.errorHandler);

        //     requestsArr.push(requestItem);
        // });
        return Observable.forkJoin(requestsArr)
            .map(data => {data})
    }

    // getArticlesBySource(source = this.basicSource):Observable< article[] > {
    //     const { API_KEY, ARTICLES_END_POINT, SOURCES_END_POINT } = this.newsApiSettings;
    //     const url = ARTICLES_END_POINT + `?source=${source}&apiKey=${API_KEY}`;
    //     return this.http.get(url)
    //         .map(response => {
    //             return response.json().articles as article[];
    //         })
    //         .catch(this.errorHandler)
    // }

    errorHandler(error):any {
        Observable.throw(error.json().error || 'Server error');
    }

}

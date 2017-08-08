import { Component, OnChanges } from "@angular/core";
import { FormBuilder, Validators} from '@angular/forms';
import { Observable } from 'rxjs';

import { GenderService } from  './../../service/gender.service';
import { ThumbnailService } from  './../../service/thumbnail.service';

import { Gender } from './../../interface/gender.interface';
import * as io from 'socket.io-client';


@Component({
    selector: "thumbnail",
    templateUrl: "./thumbnail.component.html",
    styleUrls: ["./thumbnail.component.scss"],
    providers: [ GenderService, ThumbnailService ],
})

export class ThumbnailComponent {
    thumbnails = [];
    sourcesSubscribe:any;
    // private url = 'http://localhost:9128/';  
    // private socket;

    constructor (private genderService: GenderService, 
                 private thumbnailService: ThumbnailService) {
        this.sourcesSubscribe = this.thumbnailService.thumbnails.subscribe(data => {
            console.log(data);
            console.log('this.thumbnails',this.thumbnails);
            this.thumbnails = data;
            // this.thumbnails = data;
           // this.getAllArticlesBySourcesArr(data)
        })

    }

    // getAllArticlesBySourcesArr(sourcesArr) {
    //     this.thumbnailService.getAllArticlesBySourcesArr(sourcesArr)
    //     .subscribe(data => {
    //         // let itteratedData = Array.from(data);
    //         let articleArr = [];
    //         // for ( let item of itteratedData as any) {
    //         //     item.articles.forEach(element => {
    //         //         element.name = item.name;
    //         //         element.sourceUrl = item.url;
    //         //         element.sourceLogosUrl = item.urlsToLogos;
    //         //         articleArr.push(element)
    //         //     });
    //         // }
    //         // this.channelArticles = articleArr;
    //     })
    // }

    getGender(): void {
        this.thumbnailService.getSources()
        .subscribe( (data) => {
           console.log(data);
           this.thumbnailService.changeSources(data)
        })
    }

    ngOnInit(): void {
        this.getGender(); 

        // this.socket = io(this.url);
        // console.log('socket', this.socket);
        // this.socket.on('updatedThumbmail', (data) => {
        //     console.log('updatedThumbmail->>>>>>>>>', data);

        //    // this._thumbnails.next(data);    
        // });
        // this.thumbnailService.getThumbnail()
        //     .then(data => {
        //         debugger
        //         this.thumbnails = data;
        //     });
        // this.getGender();
         
        // this.thumbnailService.loadAll();
    }

}

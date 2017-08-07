import { Component, Output, EventEmitter, Input } from "@angular/core";

import { Router } from '@angular/router';

// import { GenderService } from  './../../service/gender.service';
import { ThumbnailService } from  './../../../service/thumbnail.service';

@Component({
    selector: "gender-link",
    templateUrl: "./gender.component.html",
    styleUrls: ["./gender.component.scss"],
    providers: [ ThumbnailService ],
})


export class GenderComponent {
    constructor (private router: Router, private thumbnailService : ThumbnailService) {

    }

    onSelect(gender) {
        this.thumbnailService.setThumbnail(gender);

    // this.router.navigate(['/hero', hero.id]);
    }
}

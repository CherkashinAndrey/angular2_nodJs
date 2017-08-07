import { Component } from "@angular/core";

// import { ThumbnailComponent } from './../thumbnail/thumbnail.component'

@Component({
    selector: "container",
    templateUrl: "./container.component.html",
    styleUrls: ["./container.component.scss"],
})


export class ContainerComponent {
    constructor () {

    }

    onChangedThumbnail(gender) {
        console.log('99999999',gender);
    }
}

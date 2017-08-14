import { Component, ViewContainerRef, ViewEncapsulation } from "@angular/core";
import { FormBuilder, Validators} from '@angular/forms';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { ThumbnailService } from  './../../service/thumbnail.service';
import { Gender } from './../../interface/gender.interface';

import { AdditionCalculateWindow, AdditionCalculateWindowData } from './../../components/modal/thumbnailModal.component';

@Component({
    selector: "addItem",
    templateUrl: "./addItems.component.html",
    styleUrls: ["./addItems.component.scss"],
    providers: [ThumbnailService]
})


export class AddItemsComponent {
    constructor (vcRef: ViewContainerRef, public modal: Modal) {
        // modal.defaultViewContainer = vcRef;
    }
    open() {
        
    }

    openCustom() {
        debugger
        this.modal.open(AdditionCalculateWindow, new AdditionCalculateWindowData(2, 3));
    }

}


@Component({
  selector: 'ngbd-modal-content-item',
  templateUrl: './modal/addItems-modal.content.html',
  styleUrls: ['./modal/addItems-modal.content.scss'],
})

export class NgbdModalContentItem {
    objItem = {
        "name": "333",
        "sale": "0",
        "price": "400",
        "status": "active",
    }
    constructor(public activeModal: NgbActiveModal, public thumbnailService: ThumbnailService) {
    }

    sendItemForm(objItem) {
        console.log(objItem);
        console.log(this.activeModal);
        this.thumbnailService.addItem(objItem);
        this.activeModal.close();
    }
}



@Component({
  selector: 'ngbd-modal-component-item',
  templateUrl: './modal/addItems-modal.component.html'
})

export class NgbdModalComponentItem {
  constructor(private modalService: NgbModal) {

  }

  openModal() {
    const modalRef = this.modalService.open(NgbdModalContentItem);
    // modalRef.componentInstance.name = 'Nikto';
  }
}
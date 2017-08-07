import { Component, NgModule, Input, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { Router }            from '@angular/router';
 
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';
 
// Observable class extensions
import 'rxjs/add/observable/of';
 
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
 
// import { loginService } from './login.service';
// import { Hero } from './hero';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})

export class logoComponent {
    constructor() {}
    onClick() {
        console.log("54645")
    }
}


@Component({
  selector: 'ngbd-modal-content',
  templateUrl: './modal/modal-login-content.html',
  styleUrls: ['./modal/modal-login-content.scss'],
})

export class NgbdModalContent {
    objLogin = {
        email: "",
        password: "",
    }
    constructor(public activeModal: NgbActiveModal) {

    }

    logIn(objLogin) {
        console.log(objLogin);
        console.log(this.activeModal);
        this.activeModal.close();
    }
}



@Component({
  selector: 'ngbd-modal-component',
  templateUrl: './modal/modal-login-component.html'
})

export class NgbdModalComponent {
  constructor(private modalService: NgbModal) {

  }

  open() {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = 'Nikto';
  }
}


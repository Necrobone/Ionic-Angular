import {Component, Input, OnInit} from '@angular/core';
import {Place} from '../../places/place.model';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
})

export class AddComponent implements OnInit {
    @Input() selectedPlace: Place;

    constructor(private modalController: ModalController) {}

    ngOnInit() {}

    onBookCancel() {
        this.modalController.dismiss(null, 'cancel');
    }

    onBookPlace() {
        this.modalController.dismiss({message: 'This is a dummy message!'}, 'confirm');
    }
}

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ModalController, NavController} from '@ionic/angular';
import {Place} from '../../place.model';
import {PlacesService} from '../../places.service';
import {AddComponent} from '../../../bookings/add/add.component';

@Component({
    selector: 'app-view',
    templateUrl: './view.page.html',
    styleUrls: ['./view.page.scss'],
})

export class ViewPage implements OnInit {
    place: Place;

    constructor(
        private route: ActivatedRoute,
        private navCtrl: NavController,
        private placesService: PlacesService,
        private modalController: ModalController
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (!paramMap.has('placeId')) {
                this.navCtrl.navigateBack('/places/tabs/search');
                return;
            }

            this.place = this.placesService.getPlace(paramMap.get('placeId'));
        });
    }

    onBookPlace() {
        this.modalController.create({component: AddComponent, componentProps: {selectedPlace: this.place}}).then(modal => {
            modal.present();
            return modal.onDidDismiss();
        }).then(resultData => {
            console.log(resultData.data, resultData.role);
            if (resultData.role === 'confirm') {
                console.log('BOOKED');
            }
        });
    }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ActionSheetController, ModalController, NavController} from '@ionic/angular';
import {Place} from '../../place.model';
import {PlacesService} from '../../places.service';
import {AddComponent} from '../../../bookings/add/add.component';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-view',
    templateUrl: './view.page.html',
    styleUrls: ['./view.page.scss'],
})

export class ViewPage implements OnInit, OnDestroy {
    place: Place;
    private placeSub: Subscription;

    constructor(
        private route: ActivatedRoute,
        private navCtrl: NavController,
        private placesService: PlacesService,
        private modalController: ModalController,
        private actionSheetController: ActionSheetController
    ) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (!paramMap.has('placeId')) {
                this.navCtrl.navigateBack('/places/tabs/search');
                return;
            }

            this.placesService.getPlace(paramMap.get('placeId')).subscribe(place => {
                this.place = place;
            });
        });
    }

    onBookPlace() {
        this.actionSheetController.create({
            header: 'Choose an Action',
            buttons: [
                {
                    text: 'Select Date',
                    handler: () => {
                        this.openBookingModal('select');
                    }
                },
                {
                    text: 'Random Date',
                    handler: () => {
                        this.openBookingModal('random');
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ],
        }).then(actionSheetEl => {
            actionSheetEl.present();
        });
    }

    openBookingModal(mode: 'select' | 'random') {
        console.log(mode);
        this.modalController.create({component: AddComponent, componentProps: {selectedPlace: this.place, selectedMode: mode}})
            .then(modal => {
                modal.present();
                return modal.onDidDismiss();
            }).then(resultData => {
            console.log(resultData.data, resultData.role);
            if (resultData.role === 'confirm') {
                console.log('BOOKED');
            }
        });
    }

    ngOnDestroy(): void {
        if (this.placeSub) {
            this.placeSub.unsubscribe();
        }
    }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { AddComponent } from '../../../bookings/add/add.component';
import { Subscription } from 'rxjs';
import { BookingService } from '../../../bookings/booking.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
    selector: 'app-view',
    templateUrl: './view.page.html',
    styleUrls: ['./view.page.scss'],
})

export class ViewPage implements OnInit, OnDestroy {
    place: Place;
    isBookable = false;
    private placeSub: Subscription;

    constructor(
        private route: ActivatedRoute,
        private navCtrl: NavController,
        private placesService: PlacesService,
        private modalController: ModalController,
        private actionSheetController: ActionSheetController,
        private bookingService: BookingService,
        private loadingController: LoadingController,
        private authService: AuthService,
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
                this.isBookable = place.userId !== this.authService.userId;
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
                this.loadingController.create({
                    message: 'Booking place...'
                }).then(loadingEl => {
                    loadingEl.present();
                    const data = resultData.data.bookingData;
                    this.bookingService.addBooking(
                        this.place.id,
                        this.place.title,
                        this.place.imageUrl,
                        data.firstName,
                        data.lastName,
                        data.guestNumber,
                        data.startDate,
                        data.endDate
                    ).subscribe(() => {
                        loadingEl.dismiss();
                    });
                });
            }
        });
    }

    ngOnDestroy(): void {
        if (this.placeSub) {
            this.placeSub.unsubscribe();
        }
    }
}

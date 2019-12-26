import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookingService } from './booking.service';
import { Booking } from './booking.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-bookings',
    templateUrl: './bookings.page.html',
    styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
    loadedBookings: Booking[];
    isLoading = false;
    private bookingSub: Subscription;

    constructor(private bookingsService: BookingService, private loadingController: LoadingController) { }

    ngOnInit() {
        this.bookingSub = this.bookingsService.bookings.subscribe(bookings => {
            this.loadedBookings = bookings;
        });
    }

    ionViewWillEnter() {
        this.isLoading = true;
        this.bookingsService.fetchBookings().subscribe(() => {
            this.isLoading = false;
        });
    }

    onCancelBooking(bookingId: string, itemSliding: IonItemSliding) {
        itemSliding.close();
        this.loadingController.create({
            message: 'Cancelling'
        }).then(loadingEl => {
            loadingEl.present();
            this.bookingsService.cancelBooking(bookingId).subscribe(() => {
                loadingEl.dismiss();
            });
        });
    }

    ngOnDestroy(): void {
        if (this.bookingSub) {
            this.bookingSub.unsubscribe();
        }
    }
}

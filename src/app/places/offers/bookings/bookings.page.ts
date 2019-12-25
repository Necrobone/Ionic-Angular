import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Place} from '../../place.model';
import {NavController} from '@ionic/angular';
import {PlacesService} from '../../places.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-bookings',
    templateUrl: './bookings.page.html',
    styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
    place: Place;
    private placeSub: Subscription;

    constructor(private route: ActivatedRoute, private navCtrl: NavController, private placesService: PlacesService) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (!paramMap.has('placeId')) {
                this.navCtrl.navigateBack('/places/tabs/offers');
                return;
            }

            this.placeSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(place => {
                this.place = place;
            });
        });
    }

    ngOnDestroy(): void {
        if (this.placeSub) {
            this.placeSub.unsubscribe();
        }
    }

}

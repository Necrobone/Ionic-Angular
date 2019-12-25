import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlacesService} from '../places.service';
import {Place} from '../place.model';
import {IonItemSliding} from '@ionic/angular';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-offers',
    templateUrl: './offers.page.html',
    styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
    offers: Place[];
    private placesSub: Subscription;

    constructor(private placesService: PlacesService, private router: Router) {
    }

    ngOnInit() {
        this.placesSub = this.placesService.places.subscribe(places => {
            this.offers = places;
        });
    }

    onEdit(offerId: string, itemSliding: IonItemSliding) {
        itemSliding.close();
        this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
        console.log('Editing item', offerId);
    }

    ngOnDestroy() {
        if (this.placesSub) {
            this.placesSub.unsubscribe();
        }
    }
}

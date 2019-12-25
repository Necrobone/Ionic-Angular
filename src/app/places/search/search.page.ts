import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})

export class SearchPage implements OnInit, OnDestroy {
    loadedPlaces: Place[];
    listedLoadedPlaces: Place[];
    relevantPlaces: Place[];
    private placesSub: Subscription;

    constructor(private placesService: PlacesService, private menuController: MenuController, private authService: AuthService) {
    }

    ngOnInit() {
        this.placesSub = this.placesService.places.subscribe(places => {
            this.loadedPlaces = places;
            this.relevantPlaces = this.loadedPlaces;
            this.listedLoadedPlaces = this.relevantPlaces.slice(1);
        });
    }

    onOpenMenu() {
        this.menuController.toggle();
    }

    onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
        if (event.detail.value === 'all') {
            this.relevantPlaces = this.loadedPlaces;
        } else {
            this.relevantPlaces = this.loadedPlaces.filter(place => place.userId !== this.authService.userId);
        }

        this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    }

    ngOnDestroy(): void {
        if (this.placesSub) {
            this.placesSub.unsubscribe();
        }
    }
}

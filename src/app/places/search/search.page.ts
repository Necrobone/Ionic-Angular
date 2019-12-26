import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})

export class SearchPage implements OnInit, OnDestroy {
    loadedPlaces: Place[];
    listedLoadedPlaces: Place[];
    relevantPlaces: Place[];
    isLoading = false;
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

    ionViewWillEnter() {
        this.isLoading = true;
        this.placesService.fetchPlaces().subscribe(() => {
            this.isLoading = false;
        });
    }

    onOpenMenu() {
        this.menuController.toggle();
    }

    onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
        this.authService.userId.pipe(take(1)).subscribe(userId => {
            if (event.detail.value === 'all') {
                this.relevantPlaces = this.loadedPlaces;
            } else {
                this.relevantPlaces = this.loadedPlaces.filter(place => place.userId !== userId);
            }
            this.listedLoadedPlaces = this.relevantPlaces.slice(1);
        });
    }

    ngOnDestroy(): void {
        if (this.placesSub) {
            this.placesSub.unsubscribe();
        }
    }
}

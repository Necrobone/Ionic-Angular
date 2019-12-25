import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlacesService} from '../places.service';
import {Place} from '../place.model';
import {MenuController} from '@ionic/angular';
import {SegmentChangeEventDetail} from '@ionic/core';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})

export class SearchPage implements OnInit, OnDestroy {
    loadedPlaces: Place[];
    listedLoadedPlaces: Place[];
    private placesSub: Subscription;

    constructor(private placesService: PlacesService, private menuController: MenuController) {
    }

    ngOnInit() {
        this.placesSub = this.placesService.places.subscribe(places => {
            this.loadedPlaces = places;
            this.listedLoadedPlaces = this.loadedPlaces.slice(1);
        });
    }

    onOpenMenu() {
        this.menuController.toggle();
    }

    onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
        console.log(event.detail);
    }

    ngOnDestroy(): void {
        if (this.placesSub) {
            this.placesSub.unsubscribe();
        }
    }
}

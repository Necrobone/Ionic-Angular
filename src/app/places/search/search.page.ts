import {Component, OnInit} from '@angular/core';
import {PlacesService} from '../places.service';
import {Place} from '../place.model';
import {MenuController} from '@ionic/angular';
import {SegmentChangeEventDetail} from '@ionic/core';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})

export class SearchPage implements OnInit {
    loadedPlaces: Place[];
    listedLoadedPlaces: Place[];

    constructor(private placesService: PlacesService, private menuController: MenuController) {}

    ngOnInit() {
        this.loadedPlaces = this.placesService.places;
        this.listedLoadedPlaces = this.loadedPlaces.slice(1);
    }

    onOpenMenu() {
        this.menuController.toggle();
    }

    onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
        console.log(event.detail);
    }
}

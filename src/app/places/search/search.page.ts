import {Component, OnInit} from '@angular/core';
import {PlacesService} from '../places.service';
import {Place} from '../place.model';
import {MenuController} from '@ionic/angular';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})

export class SearchPage implements OnInit {
    loadedPlaces: Place[];

    constructor(private placesService: PlacesService, private menuController: MenuController) {}

    ngOnInit() {
        this.loadedPlaces = this.placesService.places;
    }

    onOpenMenu() {
        this.menuController.toggle();
    }
}

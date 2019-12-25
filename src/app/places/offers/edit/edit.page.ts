import {Component, OnDestroy, OnInit} from '@angular/core';
import {Place} from '../../place.model';
import {ActivatedRoute} from '@angular/router';
import {NavController} from '@ionic/angular';
import {PlacesService} from '../../places.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.page.html',
    styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit, OnDestroy {
    place: Place;
    form: FormGroup;
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
                this.form = new FormGroup({
                    title: new FormControl(this.place.title, {
                        updateOn: 'blur',
                        validators: [Validators.required]
                    }),
                    description: new FormControl(this.place.description, {
                        updateOn: 'blur',
                        validators: [Validators.required, Validators.maxLength(180)]
                    })
                });
            });
        });
    }

    onEditOffer() {
        if (!this.form.valid) {
            return;
        }
        console.log(this.form);
    }

    ngOnDestroy(): void {
        if (this.placeSub) {
            this.placeSub.unsubscribe();
        }
    }
}

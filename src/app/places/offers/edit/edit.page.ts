import { Component, OnDestroy, OnInit } from '@angular/core';
import { Place } from '../../place.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.page.html',
    styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit, OnDestroy {
    place: Place;
    form: FormGroup;
    private placeSub: Subscription;

    constructor(
        private route: ActivatedRoute,
        private navCtrl: NavController,
        private placesService: PlacesService,
        private router: Router,
        private loadingController: LoadingController) {
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

        this.loadingController.create({
            message: 'Updating place...'
        }).then(loadingEl => {
            loadingEl.present();
            this.placesService.editPlace(this.place.id, this.form.value.title, this.form.value.description).subscribe(() => {
                loadingEl.dismiss();
                this.form.reset();
                this.router.navigate(['/places/tabs/offers']);
            });
        });
    }

    ngOnDestroy(): void {
        if (this.placeSub) {
            this.placeSub.unsubscribe();
        }
    }
}

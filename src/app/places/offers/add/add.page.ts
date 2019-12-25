import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PlacesService} from '../../places.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-add',
    templateUrl: './add.page.html',
    styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
    form: FormGroup;

    constructor(private placesService: PlacesService, private router: Router) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl(null, {
                updateOn: 'blur',
                validators: [Validators.required]
            }),
            description: new FormControl(null, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.maxLength(180)]
            }),
            price: new FormControl(null, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.min(1)]
            }),
            dateFrom: new FormControl(null, {
                updateOn: 'blur',
                validators: [Validators.required]
            }),
            dateTo: new FormControl(null, {
                updateOn: 'blur',
                validators: [Validators.required]
            })
        });
    }

    onCreateOffer() {
        if (!this.form.valid) {
            return;
        }

        this.placesService.addPlace(
            this.form.value.title,
            this.form.value.description,
            'https://i.pinimg.com/originals/9c/88/44/9c8844b217bdb6c17db14f51ad2e51a5.jpg',
            +this.form.value.price,
            new Date(this.form.value.dateFrom),
            new Date(this.form.value.dateTo)
        );
        this.form.reset();
        this.router.navigate(['/places/tabs/offers']);
    }

}

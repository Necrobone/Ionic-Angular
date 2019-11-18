import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {ViewPage} from './view.page';
import {AddComponent} from '../../../bookings/add/add.component';

const routes: Routes = [
    {
        path: '',
        component: ViewPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ViewPage, AddComponent],
    entryComponents: [AddComponent]
})

export class ViewPageModule {}

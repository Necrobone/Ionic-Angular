import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlacesPage} from './places.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: PlacesPage,
        children: [
            {
                path: 'search',
                children: [
                    {
                        path: '',
                        loadChildren: './search/search.module#SearchPageModule'
                    },
                    {
                        path: ':placeId',
                        loadChildren: './search/view/view.module#ViewPageModule'
                    }
                ]
            },
            {
                path: 'offers',
                children: [
                    {
                        path: '',
                        loadChildren: './offers/offers.module#OffersPageModule'
                    },
                    {
                        path: 'add',
                        loadChildren: './offers/add/add.module#AddPageModule'
                    },
                    {
                        path: 'edit/:placeId',
                        loadChildren: './offers/edit/edit.module#EditPageModule'
                    },
                    {
                        path: ':placeId',
                        loadChildren: './offers/bookings/bookings.module#BookingsPageModule'
                    }
                ]
            },
            {
                path: '',
                redirectTo: '/places/tabs/search',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/places/tabs/search',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PlacesRoutingModule {
}

import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface PlaceData {
    availableFrom: string;
    availableTo: string;
    description: string;
    imageUrl: string;
    price: number;
    title: string;
    userId: string;
}

@Injectable({
    providedIn: 'root'
})
export class PlacesService {
    private _places = new BehaviorSubject<Place[]>([]);

    get places() {
        return this._places.asObservable();
    }

    constructor(private authService: AuthService, private http: HttpClient) {
    }

    fetchPlaces() {
        return this.http
            .get<{ [key: string]: PlaceData }>('https://ionic-5c5e9.firebaseio.com/offered-places.json')
            .pipe(
                map(resData => {
                    const places = [];
                    for (const key in resData) {
                        if (resData.hasOwnProperty(key)) {
                            places.push(new Place(
                                key,
                                resData[key].title,
                                resData[key].description,
                                resData[key].imageUrl,
                                resData[key].price,
                                new Date(resData[key].availableFrom),
                                new Date(resData[key].availableTo),
                                resData[key].userId
                            ));
                        }
                    }

                    return places;
                }),
                tap(places => {
                    this._places.next(places);
                })
            );
    }

    getPlace(id: string) {
        return this.http
            .get<PlaceData>(`https://ionic-5c5e9.firebaseio.com/offered-places/${id}.json`)
            .pipe(map(placeData => {
                return new Place(
                    id,
                    placeData.title,
                    placeData.description,
                    placeData.imageUrl,
                    placeData.price,
                    new Date(placeData.availableFrom),
                    new Date(placeData.availableTo),
                    placeData.userId
                );
            }));
    }

    addPlace(title: string, description: string, imageUrl: string, price: number, dateFrom: Date, dateTo: Date) {
        let generatedId: string;
        let newPlace: Place;
        return this.authService.userId
            .pipe(
                take(1),
                switchMap(userId => {
                    if (!userId) {
                        throw new Error('No user found!');
                    }

                    newPlace = new Place(
                        Math.random().toString(),
                        title,
                        description,
                        imageUrl,
                        price,
                        dateFrom,
                        dateTo,
                        userId
                    );
                    return this.http.post<{ name: string }>(
                        'https://ionic-5c5e9.firebaseio.com/offered-places.json',
                        {...newPlace, id: null}
                    );
                }),
                switchMap(resData => {
                    generatedId = resData.name;
                    return this.places;
                }),
                take(1),
                tap(places => {
                    newPlace.id = generatedId;
                    this._places.next(places.concat(newPlace));
                })
            );
    }

    editPlace(placeId: string, title: string, description: string) {
        let updatedPlaces: Place[];
        return this.places.pipe(
            take(1),
            switchMap(places => {
                if (!places || places.length <= 0) {
                    return this.fetchPlaces();
                } else {
                    return of(places);
                }
            }),
            switchMap(places => {
                const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
                updatedPlaces = [...places];
                const oldPlace = updatedPlaces[updatedPlaceIndex];

                updatedPlaces[updatedPlaceIndex] = new Place(
                    oldPlace.id,
                    title,
                    description,
                    oldPlace.imageUrl,
                    oldPlace.price,
                    oldPlace.availableFrom,
                    oldPlace.availableTo,
                    oldPlace.userId
                );
                return this.http.put(
                    `https://ionic-5c5e9.firebaseio.com/offered-places/${placeId}.json`,
                    {...updatedPlaces[updatedPlaceIndex], id: null}
                );
            }),
            tap(resData => {
                this._places.next(updatedPlaces);
            })
        );
    }
}

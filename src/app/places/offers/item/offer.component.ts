import {Component, Input, OnInit} from '@angular/core';
import {Place} from '../../place.model';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
})
export class OfferComponent implements OnInit {
  @Input() offer: Place;

  constructor() { }

  ngOnInit() {}
}

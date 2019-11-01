import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {

  constructor(private router: Router, private navCtrl: NavController) { }

  ngOnInit() {
  }

  onBookPlace() {
    this.navCtrl.navigateBack('/places/tabs/search');
  }
}

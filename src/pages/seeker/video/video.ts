import { Component, ElementRef, ViewChild  } from '@angular/core';
import { NavController, LoadingController, NavParams, ActionSheetController } from 'ionic-angular';
@Component({
  selector: 'page-video',
  templateUrl: 'video.html'
})
export class VideoPage {
    public data: any;
    constructor(public navCtrl: NavController,
    public navParams: NavParams) {
        this.data = navParams.get('data');
    }
}
import { Component, ElementRef, ViewChild  } from '@angular/core';
import { NavController, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { SeekerService } from '../../../provider/seeker-service';

@Component({
  selector: 'page-seeker-editabout',
  templateUrl: 'seeker-editabout.html'
})
export class SeekerEditaboutPage {
  
  @ViewChild('fileInpsabout') fileInpsabout: ElementRef;
  data: any;
  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public seekerService: SeekerService,
    public loading: LoadingController,
    public viewCtrl: ViewController,
    public navParams: NavParams) {
        this.data = navParams.get('data');
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    
  }

  upload_photo(){

  }

  save() {
    
  }

}

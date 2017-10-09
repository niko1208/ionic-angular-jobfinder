import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { SeekerService } from '../../../provider/seeker-service';

@Component({
  selector: 'page-seeker-message',
  templateUrl: 'seeker-message.html'
})
export class SeekerMessagePage {

  data: any;
  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public seekerService: SeekerService,
    public loading: LoadingController,
    public viewCtrl: ViewController,
    public navParams: NavParams) {
        
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    
  }

}

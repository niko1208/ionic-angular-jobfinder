import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { EmployerService } from '../../../provider/employer-service';

@Component({
  selector: 'page-employer-about',
  templateUrl: 'employer-about.html'
})
export class EmployerAboutPage {

  data: any;
  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public employerService: EmployerService,
    public loading: LoadingController,
    public navParams: NavParams) {
        this.data = navParams.get("data");
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    
  }

}

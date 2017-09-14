import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { EmployerService } from '../../../provider/employer-service';

@Component({
  selector: 'page-employer-work',
  templateUrl: 'employer-work.html'
})
export class EmployerWorkPage {

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

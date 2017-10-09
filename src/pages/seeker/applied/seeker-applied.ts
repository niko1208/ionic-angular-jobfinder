import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { SeekerService } from '../../../provider/seeker-service';
import { SeekerJobdetailPage } from '../jobdetail/seeker-jobdetail';

@Component({
  selector: 'page-seeker-applied',
  templateUrl: 'seeker-applied.html'
})
export class SeekerAppliedPage {

  list: any;
  jobSeekerID: any;
  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public seekerService: SeekerService,
    public loading: LoadingController,
    public navParams: NavParams) {
        
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    let user_setting = JSON.parse(localStorage.getItem('user_setting'));
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let param = {"seeker_id" : this.config.user_id};
    this.seekerService.postData("applyjobload", param)
    .subscribe(data => { console.log(data);
        loader.dismissAll();
        if(data.status == "success") {
          this.list = data.result;
          for(let i=0; i<this.list.length; i++) {
            let item = this.list[i];
            this.list[i]['timeago'] = this.config.getDiffDateString(this.list[i].timediff);
            this.list[i]['distance'] = this.config.calcCrow(this.list[i].job_location_lat, this.list[i].job_location_lng, user_setting.setting_location_lat, user_setting.setting_location_lng);
          }
        } else {
          this.util.createAlert("Failed", data.result);
        }
    })
  }

  goDetail(i) {
    let item = this.list[i];
    this.navCtrl.push(SeekerJobdetailPage, {data: item});
  }

}

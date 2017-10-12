import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { SeekerService } from '../../../provider/seeker-service';
import { SeekerAdsPage } from '../ads/seeker-ads';
import * as $ from 'jquery';

@Component({
  selector: 'page-seeker-home',
  templateUrl: 'seeker-home.html'
})
export class SeekerHomePage {

  list: any;
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
    this.loadAds();
  }

  loadAds() {
    let param = {"seeker_id" : this.config.user_id};
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    this.seekerService.postData("loadads", param)
    .subscribe(data => { console.log(data);
        loader.dismissAll();
        if(data.status == "success") {
            this.list = data.result;
            setTimeout(() => {
              let w = $('#content').width();
              $('.ads').css('height', w+'px');
            }, 500);
        } else {
          this.util.createAlert("Failed to Load!", data.result);
        }
    }, err => {
      loader.dismissAll();
      this.util.createAlert("Server Failed!", "");
    });
  }

  follow(item) {
    let url = "followadd";
    if(item.follow_cnt == '1') {
      url = "followdelete";
    }
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let employer_id = item.tbl_ads_employer_id;
    let param = {"seeker_id" : this.config.user_id, "employer_id" : employer_id};
    this.seekerService.postData(url, param)
    .subscribe(data => { 
        loader.dismissAll();
        if(data.status == "success") {
          item.follow_cnt = (item.follow_cnt=='1') ? '0' : '1';
          if(item.follow_cnt == '1') {
            this.util.creatToast("Followed");
          } else {
            this.util.creatToast("Unfollowed");
          }
        } else {
          this.util.createAlert("Failed!", data.result);
        }
    }, err => {
      loader.dismissAll();
      this.util.createAlert("Server Failed!", "");
    });
  }

  goads(item) {
    this.navCtrl.push(SeekerAdsPage, {data:item}, this.config.navOptions);
  }

}

import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { SeekerService } from '../../../provider/seeker-service';
import { EmployerService } from '../../../provider/employer-service';
import { SeekerJobdetailPage } from '../jobdetail/seeker-jobdetail';

@Component({
  selector: 'page-seeker-ads',
  templateUrl: 'seeker-ads.html'
})
export class SeekerAdsPage {

  data: any;
  list: any;
  photolist: any;
  general: any;
  desc = "";
  lbfollow = 'Follow';

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public seekerService: SeekerService,
    public employerService: EmployerService,
    public loading: LoadingController,
    public viewCtrl: ViewController,
    public navParams: NavParams) {
        this.data = navParams.get('data');
  }

  ionViewWillEnter() {
      if(this.data.follow_cnt == '1') this.lbfollow = "Following";
      this.loadData();
  }

  loadData() {
    let employer_id = this.data.tbl_ads_employer_id;
    let param = {"employer_id" : employer_id};
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    this.employerService.postData("adsloadmine", param)
    .subscribe(data => { console.log(data);
        loader.dismissAll();
        if(data.status == "success") {
          this.general = data.resultGeneral; 
            this.list = data.resultMyJobs; 
            this.photolist = data.resultPhotos;
            if(this.general != null)
                this.desc = this.general.tbl_ads_description;
        } else {
          this.util.createAlert("Failed to Load!", data.result);
        }
    }, err => {
      loader.dismissAll();
      this.util.createAlert("Server Failed!", "");
    });
  }

  follow() {
      let item = this.data;
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
            this.lbfollow = "Following";
          } else {
            this.util.creatToast("Unfollowed");
            this.lbfollow = "Follow";
          }
        } else {
          this.util.createAlert("Failed!", data.result);
        }
    }, err => {
      loader.dismissAll();
      this.util.createAlert("Server Failed!", "");
    });
  }

  goJobDetail(item) {
    this.navCtrl.push(SeekerJobdetailPage, {data: item});
  }
}

import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { SeekerService } from '../../../provider/seeker-service';
import { SeekerIndustryPage } from '../industry/seeker-industry';
import { SeekerCurLocationPage } from '../curlocation/seeker-curlocation';

@Component({
  selector: 'page-seeker-setting',
  templateUrl: 'seeker-setting.html'
})
export class SeekerSettingPage {

  data: any;
  user_info;
  user_setting: any;
  distance = '1';
  ischat = false;
  isfollow = false;
  isinvite = false;
  isshortlist = false;
  dd = {'industry': '#alljobs', 'time':'full time'};
  
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
    
    this.user_info = this.config.userinfo['user_info'];
    this.user_setting = this.config.userinfo['user_setting']; 
    console.log(this.user_setting); 
    if(this.user_setting != null) {
      if(this.user_setting.setting_notification_chat == 'YES') {
        this.ischat = true;
      }
      if(this.user_setting.setting_notification_follow == 'YES') {
        this.isfollow = true;
      }
      if(this.user_setting.setting_notification_invite == 'YES') {
        this.isinvite = true;
      }
      if(this.user_setting.setting_notification_shortlist == 'YES') {
        this.isshortlist = true;
      }
      this.distance = this.user_setting.setting_distance;
      this.dd.industry = this.user_setting.setting_industry;
      this.dd.time = this.user_setting.setting_time_available;
    }
    
    console.log()
  }

  goindustry() {
    this.navCtrl.push(SeekerIndustryPage, {dd: this.dd}, this.config.navOptions);
  }

  logout() {
    localStorage.setItem('user_id', "");
    localStorage.setItem('user_type', "");
    localStorage.setItem('user_state', "");

    localStorage.setItem('user_info', '');
    localStorage.setItem('user_curwork', '');
    localStorage.setItem('user_education', '');
    localStorage.setItem('user_experience', '');
    localStorage.setItem('user_language', '');
    localStorage.setItem('user_reference', '');
    localStorage.setItem('user_setting', '');

    this.config.userinfo = {user_info:null, user_experience:null, user_curwork:null, user_education:null, user_language:null, user_reference:null, user_setting:null};

    window.location.reload();
  }

  save() {
    let str_chat = "NO";
    let str_shortlist = "NO";
    let str_follow = "NO";
    let str_invite = "NO";
    if(this.ischat) str_chat = "YES";
    if(this.isinvite) str_invite = "YES";
    if(this.isfollow) str_follow = "YES";
    if(this.isshortlist) str_shortlist = "YES";

    let user_setting = this.config.userinfo['user_setting'];
    let param = {"seeker_id" : this.config.user_id, "location_address" : user_setting.setting_location_address, "location_lat" : user_setting.setting_location_lat, "location_lng" : user_setting.setting_location_lng, "distance" : user_setting.setting_distance, "notification_chat" : str_chat, "notification_shortlist" : str_shortlist, "notification_invite" : str_invite, "notification_follow" : str_follow, "industry" : user_setting.setting_industry, "time_available" : user_setting.setting_time_available};

    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    this.seekerService.postData("editsetting", param)
    .subscribe(data => { 
        loader.dismissAll();
        if(data.status == "success") {
          let resultSetting = JSON.stringify(this.config.userinfo['user_setting']);
          localStorage.setItem('user_setting', resultSetting);

          this.util.createAlert("Successfully saved settings", "");  
        } else {
          this.util.createAlert("Settings Save Failed", data.result);
        }
    }, err => {
      loader.dismissAll();
      this.util.createAlert("Server Failed!", "");
    });
  }

  goLocation() {
    this.navCtrl.push(SeekerCurLocationPage, null, this.config.navOptions);
  }

}

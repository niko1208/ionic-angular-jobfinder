import { Component  } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { Auth } from '../../../provider/auth';
import { EmployerEditProfilePage } from '../editprofile/employer-editprofile';
import { EmployerAdsPage } from '../ads/employer-ads';
import { EmployerService } from '../../../provider/employer-service';
import { EmployerCurLocationPage } from '../curlocation/employer-curlocation';

@Component({
  selector: 'page-employer-setting',
  templateUrl: 'employer-setting.html'
})
export class EmployerSettingPage {

  user_info: any;
  user_setting: any;
  user_profile: any;
  ischat = false;
  isapp = false;

  distance = '0';
  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public auth: Auth,
    public employerService: EmployerService,
    public loading: LoadingController) {
        
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    this.user_info = JSON.parse(localStorage.getItem('user_info'));
    this.user_setting = JSON.parse(localStorage.getItem('user_setting'));
    this.user_profile = JSON.parse(localStorage.getItem('user_profile'));

    this.distance = this.user_setting.setting_emp_distance;
    if(this.user_setting.setting_emp_notification_chat == 'YES') {
      this.ischat = true;
    }
    if(this.user_setting.setting_emp_notification_applicant == 'YES') {
      this.isapp = true;
    }
    console.log(this.user_info);
    console.log(this.user_setting);
    console.log(this.user_profile);
  }

  goProfile() {
    this.navCtrl.push(EmployerEditProfilePage, {
      userinfo: this.user_info,
      data: this.user_profile
    }, this.config.navOptions);
  }

  done() {
    if(this.ischat) this.user_setting.setting_emp_notification_chat = 'YES';
    else this.user_setting.setting_emp_notification_chat = 'NO';
    if(this.isapp) this.user_setting.setting_emp_notification_applicant = 'YES';
    else this.user_setting.setting_emp_notification_applicant = 'NO';
    this.user_setting.setting_emp_distance = this.distance;

    let param = {"employer_id" : this.config.user_id, "location_address" : this.user_setting.setting_emp_location_address, "location_lat" : this.user_setting.setting_emp_location_lat, "location_lng" : this.user_setting.setting_emp_location_lng, "distance" : this.user_setting.setting_emp_distance, "notification_chat" : this.user_setting.setting_emp_notification_chat, "notification_applicant" : this.user_setting.setting_emp_notification_applicant};

    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();

    this.employerService.postData("editsetting", param)
    .subscribe(data => { 
        loader.dismissAll();
        if(data.status == "success") {
          let userSetting = JSON.stringify(this.user_setting);
          localStorage.setItem('user_setting', userSetting);
        }
    })
  }

  goLocation() {
    this.navCtrl.push(EmployerCurLocationPage);
  }
  ads() {
    this.navCtrl.push(EmployerAdsPage, {}, this.config.navOptions);
  }

  logout() {
    localStorage.setItem('user_id', "");
    localStorage.setItem('user_type', "");
    localStorage.setItem('user_info', "");
    localStorage.setItem('user_setting', "");
    localStorage.setItem('user_profile', "");
    window.location.reload();
  }

}

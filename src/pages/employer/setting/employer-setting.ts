import { Component  } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { Auth } from '../../../provider/auth';
import { EmployerEditProfilePage } from '../editprofile/employer-editprofile';
import { EmployerAdsPage } from '../ads/employer-ads';
import { EmployerService } from '../../../provider/employer-service';
import { EmployerCurLocationPage } from '../curlocation/employer-curlocation';
import { EmployerHelpPage } from '../help/employer-help';
import { SplashPage } from '../../splash/splash';

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

  distance = '1';
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

    if(this.user_setting != null) { 
      this.distance = this.user_setting.setting_emp_distance;
      if(this.user_setting.setting_emp_notification_chat == 'YES') {
        this.ischat = true;
      }
      if(this.user_setting.setting_emp_notification_applicant == 'YES') {
        this.isapp = true;
      }
    } else {
      this.user_setting = {};
      this.user_setting['setting_emp_distance'] = "1";
      this.user_setting['setting_emp_employer_id'] = "";
      this.user_setting['setting_emp_id'] = "";
      this.user_setting['setting_emp_location_address'] = "Select your current location";
      this.user_setting['setting_emp_location_lat'] = "";
      this.user_setting['setting_emp_location_lng'] = "";
      this.user_setting['setting_emp_notification_applicant'] = "";
      this.user_setting['setting_emp_notification_chat'] = "";
      let user_setting = JSON.stringify(this.user_setting);
      localStorage.setItem('user_setting', user_setting);
    }
    if(this.user_profile == null) {
      this.user_profile = {};
      this.user_profile['profile_emp_about'] = "";
      this.user_profile['profile_emp_bus_size_max'] = "";
      this.user_profile['profile_emp_bus_size_min'] = "";
      this.user_profile['profile_emp_bus_size_title'] = "";
      this.user_profile['profile_emp_date'] = "";
      this.user_profile['profile_emp_employer_id'] = "";
      this.user_profile['profile_emp_founded'] = "";
      this.user_profile['profile_emp_id'] = "";
      this.user_profile['profile_emp_tech'] = "#alljobs";
      let user_profile = JSON.stringify(this.user_profile);
      localStorage.setItem('user_profile', user_profile);
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
          this.util.createAlert("Successfully saved settings", "");  
        } else {
          this.util.createAlert("Settings Save Failed", data.result);
        }
    }, err => {
      loader.dismissAll();
      this.util.createAlert("Server Failed!", "");
    })
  }

  goLocation() {
    this.navCtrl.push(EmployerCurLocationPage);
  }
  ads() {
    if(this.user_info.user_membership == 'basic') {
      this.util.createAlert("Premium Member Access Only", "");
      return;
    }
    this.navCtrl.push(EmployerAdsPage, {}, this.config.navOptions);
  }
  help() {
    this.navCtrl.push(EmployerHelpPage, {}, this.config.navOptions);
  }

  logout() {
    localStorage.setItem('user_id', "");
    localStorage.setItem('user_type', "");
    localStorage.setItem('user_info', "");
    localStorage.setItem('user_setting', "");
    localStorage.setItem('user_profile', "");
    let loader = this.loading.create({
      content: 'Login...',
    });
    loader.present();
    setTimeout(() => {
      loader.dismiss();
      //this.navCtrl.setRoot(SplashPage);
    }, 3000);
    window.location.reload();
  }

}

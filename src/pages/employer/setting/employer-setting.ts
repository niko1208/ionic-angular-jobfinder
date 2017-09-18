import { Component  } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { Auth } from '../../../provider/auth';
import { EmployerEditProfilePage } from '../editprofile/employer-editprofile';
import { EmployerAdsPage } from '../ads/employer-ads';

@Component({
  selector: 'page-employer-setting',
  templateUrl: 'employer-setting.html'
})
export class EmployerSettingPage {

  user_info: any;
  user_setting: any;
  user_profile: any;

  distance = '0';
  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public auth: Auth,
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

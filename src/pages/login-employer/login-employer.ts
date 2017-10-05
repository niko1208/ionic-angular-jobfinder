import { Component  } from '@angular/core';
import { NavController, LoadingController, ViewController } from 'ionic-angular';
import { Config } from '../../provider/config';
import { UtilService } from '../../provider/util-service';
import { Auth } from '../../provider/auth';
import { EmployerTabsPage } from '../employer/tabs/employer-tabs';
import { ResetEmployerPage } from '../reset-employer/reset-employer';
import { SignupVerifyPage } from '../signup-verify/signup-verify';

@Component({
  selector: 'page-login-employer',
  templateUrl: 'login-employer.html'
})
export class LoginEmployerPage {

    public email: any = "";
    public password: any = "";

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public auth: Auth,
    public viewCtrl: ViewController,
    public loading: LoadingController) {

  }

  goback() {
      this.navCtrl.pop(this.config.navOptionsBack);
  }

  login() {
      if(this.email == "") {
          this.util.createAlert("Error", "Please insert Email!");
          return;
      }
      if(!(this.config.validateEmail(this.email))) {
        this.util.createAlert("Error", "Please insert a valid email!");
        return;
      }
      if(this.password == "") {
          this.util.createAlert("Error", "Please insert Password!");
          return;
      }
      
      let loader = this.loading.create({
        content: 'Login...',
      });
      loader.present();

      let param = {"email" : this.email, "password" : this.password, "device" : this.config.platform, "token" : this.config.deviceToken};
      this.auth.login(param, "employer")
      .subscribe(data => {
          loader.dismissAll();
          if(data.status == "success") {
            this.config.user_id = data.resultUser.user_id;
            this.config.user_type = "employer";
            this.config.user_state = data.resultUser.user_state;

            let resultUser = JSON.stringify(data.resultUser);
            let resultSetting = JSON.stringify(data.resultSetting);
            let resultProfile = JSON.stringify(data.resultProfile);
            localStorage.setItem('user_info', resultUser);
            localStorage.setItem('user_setting', resultSetting);
            localStorage.setItem('user_profile', resultProfile);
            
            localStorage.setItem('user_id', this.config.user_id);
            localStorage.setItem('user_state', this.config.user_state);
            localStorage.setItem('user_type', "employer");

            if(data.resultUser.user_state == '0') {
                this.navCtrl.push(SignupVerifyPage, {email: this.email}, this.config.navOptions).then(()=> {
                    const index = this.viewCtrl.index;
                    this.navCtrl.remove(index);
                });
            } else {
                this.navCtrl.push(EmployerTabsPage, null, this.config.navOptions).then(()=> {
                    const index = this.viewCtrl.index;
                    this.navCtrl.remove(index);
                });
            }
          } else {
            this.util.createAlert("SignIn Failed", data.result);
          }
      }, error => {
          loader.dismissAll();
          this.util.createAlert("SignIn Failed", "");
      })
  }

  goReset() {
      this.navCtrl.push(ResetEmployerPage, null, this.config.navOptions);
  }

}

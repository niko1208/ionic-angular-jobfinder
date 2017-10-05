import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Config } from '../../provider/config';
import { UtilService } from '../../provider/util-service';
import { Auth } from '../../provider/auth';
import { LoginEmployerPage } from '../login-employer/login-employer';
import { LoginSeekerPage } from '../login-seeker/login-seeker';

@Component({
  selector: 'page-signup-verify',
  templateUrl: 'signup-verify.html'
})
export class SignupVerifyPage {

    public vcode: any;
    public email: any;

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public auth: Auth,
    public loading: LoadingController,
    public navParams: NavParams) {
        this.email = navParams.get('email');
  }

  goback() {
      this.navCtrl.pop(this.config.navOptionsBack);
  }

  resend() {
      let vcode = Math.floor(Math.random() * (9999-1000))+1000;
      var email = this.email;
      let param = {"user_id" : this.config.user_id, "verify_code" : vcode, "email" : email};

      let loader = this.loading.create({
        content: 'Loading...',
      });
      loader.present();

      this.auth.reverify(param, this.config.user_type)
      .subscribe(data => {
          loader.dismissAll();
          if(data.status == 'success') {
              this.util.createAlert("", "New verification code has been sent!");
          } else {
              this.util.createAlert("Failed", data.result);
          }
      }, err => {
          loader.dismissAll();
          this.util.createAlert("Failed", "");
      });
  }
  verify() {
      if(this.vcode == "") {
          this.util.createAlert("Error", "Please insert your verification code!");
          return;
      }
      let loader = this.loading.create({
        content: 'Loading...',
      });
      loader.present();
      let param = {"user_id" : this.config.user_id, "verify_code" : this.vcode, "device" : this.config.platform, "token" : this.config.deviceToken};
      this.auth.verify(param, this.config.user_type)
      .subscribe(data => {
          loader.dismissAll();
          if(data.status == 'success') {
              if(this.config.user_type == 'employer') {
                //this.util.createAlert("Success", "You have successfully created your Jobfinder Account.");
                this.navCtrl.push(LoginEmployerPage, null, this.config.navOptions);
              } else {
                this.navCtrl.push(LoginSeekerPage, null, this.config.navOptions);
              }
          } else {
              this.util.createAlert("Failed", data.result);
          }
      }, err => {
          loader.dismissAll();
          this.util.createAlert("Failed", "");
      });
  }

}

import { Component  } from '@angular/core';
import { NavController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public auth: Auth) {

  }

  goback() {
      this.navCtrl.pop(this.config.navOptionsBack);
  }

  verify() {
      if(this.vcode == "") {
          this.util.createAlert("Error", "Please insert Verify Code!");
          return;
      }
      let param = {"user_id" : this.config.user_id, "verify_code" : this.vcode, "device" : this.config.platform, "token" : this.config.deviceToken};
      this.auth.verify(param, this.config.user_type)
      .subscribe(data => {
          if(data.status == 'success') {
              if(this.config.user_type == 'employer') {
                this.navCtrl.push(LoginEmployerPage, null, this.config.navOptions);
              } else {
                this.navCtrl.push(LoginSeekerPage, null, this.config.navOptions);
              }
          }
      });
  }

}

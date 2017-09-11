import { Component  } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Config } from '../../provider/config';
import { LoginEmployerPage } from '../login-employer/login-employer';
import { LoginSeekerPage } from '../login-seeker/login-seeker';
import { TermsPage } from '../terms/terms';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController, public config: Config) {

  }

  goback() {
      this.navCtrl.pop(this.config.navOptionsBack);
  }

  goEmployerLogin() {
      this.config.user_type = "employer";
      this.navCtrl.push(LoginEmployerPage, null, this.config.navOptions);
  }
  goSeekerLogin() {
      this.config.user_type = "jobseeker";
      this.navCtrl.push(LoginSeekerPage, null, this.config.navOptions);
  }
  goTerms() {
      this.navCtrl.push(TermsPage, null, this.config.navOptions);
  }

}

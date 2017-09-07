import { Component  } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Config } from '../../provider/config';

@Component({
  selector: 'page-login-seeker',
  templateUrl: 'login-seeker.html'
})
export class LoginSeekerPage {

  constructor(public navCtrl: NavController, public config: Config) {

  }

  goback() {
      this.navCtrl.pop(this.config.navOptionsBack);
  }
  
}
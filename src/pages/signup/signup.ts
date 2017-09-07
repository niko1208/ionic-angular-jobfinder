import { Component  } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Config } from '../../provider/config';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public config: Config) {

  }

  goLogin() {
      this.navCtrl.push(LoginPage, null, this.config.navOptions).then(()=> {
          const index = this.viewCtrl.index;
          this.navCtrl.remove(index);
      });
  }

}

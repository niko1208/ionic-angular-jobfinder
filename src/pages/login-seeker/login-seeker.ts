import { Component  } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Config } from '../../provider/config';
import { UtilService } from '../../provider/util-service';
import { Auth } from '../../provider/auth';

@Component({
  selector: 'page-login-seeker',
  templateUrl: 'login-seeker.html'
})
export class LoginSeekerPage {

    public email: any;
    public password: any;

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public auth: Auth) {

  }

  goback() {
      this.navCtrl.pop(this.config.navOptionsBack);
  }
  
  login() {
      if(this.email == "") {
          this.util.createAlert("Error", "Please insert Email!");
          return;
      }
      if(this.password == "") {
          this.util.createAlert("Error", "Please insert Password!");
          return;
      }
      
      let param = {"email" : this.email, "password" : this.password, "device" : this.config.platform, "token" : this.config.deviceToken};
      this.auth.login(param, 'jobseeker')
      .subscribe(data => {
          
      })
  }
}
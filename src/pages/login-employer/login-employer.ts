import { Component  } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Config } from '../../provider/config';
import { UtilService } from '../../provider/util-service';
import { Auth } from '../../provider/auth';

@Component({
  selector: 'page-login-employer',
  templateUrl: 'login-employer.html'
})
export class LoginEmployerPage {

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
      
      let param = {"email" : this.email, "password" : this.password};
      this.auth.login_employer(param)
      .subscribe(data => {
          
      })
  }

}
